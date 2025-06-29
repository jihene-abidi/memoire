import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdateCandidatCvComponent } from '../update-candidat-cv/update-candidat-cv.component';
import {ClientImports} from "../../client-imports";
import {FileService} from "../../../../core/services/file.service";
import { JobOfferConstant } from '../job-offer.constants';
import {catchError, finalize, of} from "rxjs";
import {tap} from "rxjs/operators";

interface DialogData {
  identifier: string;
  time: string;
  canModifyCv?: boolean;
  currentCvTitle?: string;
  currentCvId?: string;
  jobOfferId?: string;
  candidatureId?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  imports: [ClientImports],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
  standalone: true,
})
export class ConfirmationDialogComponent implements OnInit {
  jobOfferConstant = JobOfferConstant;
  canChangeCv: boolean = true;
  isCheckingConversation: boolean = false;
  conversationCheckError: string = '';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private fileService: FileService,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
   ngOnInit() {
    this.checkConversationStatus();
  }
  private checkConversationStatus(): void {
   /* this.fileService.checkConversationExists(this.data.identifier).pipe(
      tap((hasConversation: boolean) => {
        this.canChangeCv = !hasConversation;
        if (hasConversation) {
          this.conversationCheckError = JobOfferConstant.CONVERSATION_ALREADY_EXISTS;
        }
      }),
      catchError((error) => {
        console.error(JobOfferConstant.CONVERSATION_CHECK_ERROR, error);
        this.conversationCheckError = JobOfferConstant.CONVERSATION_CHECK_ERROR_MESSAGE;
        this.canChangeCv = false;
        return of(false);
      }),
      finalize(() => {
        this.isCheckingConversation = false;
      })
    ).subscribe();*/
  }
  openCvJobChange() {
    if (!this.canChangeCv) {
      return;
    }
    const cvJobChangeDialog = this.dialog.open(UpdateCandidatCvComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        currentCvTitle: this.data.currentCvTitle,
        currentCvId: this.data.currentCvId,
        candidatureId: this.data.candidatureId,
        jobOfferId: this.data.jobOfferId
      },
      disableClose: false
    });
    cvJobChangeDialog.afterClosed().subscribe(result => {
      if (result && result.updated) {
        this.data.currentCvTitle = result.newCvTitle;
        this.data.currentCvId = result.newCvId;
      }
    });
  }
  protected readonly JobOfferConstant = JobOfferConstant;

  closeDialog() {
    this.dialogRef.close();
  }
  phoneDial() {
    this.router.navigate(['/client/phone-dial']);
    this.closeDialog();
  }
}