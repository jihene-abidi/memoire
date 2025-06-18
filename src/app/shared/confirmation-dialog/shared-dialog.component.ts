import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from "@angular/material/button";
import {deleteJobConstant} from "../../components/client/job-offer/supprimer-job-offer/supprimer-job-offer.constants";
import {CommonModule} from "@angular/common";
import {Shared_dialogConstant} from "./shared-dialog.constants";


@Component({
  selector: 'app-shared-dialog',
  templateUrl: './shared-dialog.component.html',
  styleUrls: ['./shared-dialog.component.css'],
  imports: [
    MatDialogActions,
    MatButton,
    MatDialogContent,
    MatDialogTitle,
    CommonModule,
  ],
  standalone: true
})
export class SharedDialogComponent {
  iconSrc: string;
  iconAlt: string;
  constructor(
    public dialogRef: MatDialogRef<SharedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; actionButtonText?: string; actionButtonColor?: string ;    actionType?: 'delete' | 'update' | 'custom';
    }
  ) {
    if (data.actionType === 'delete') {
    this.iconSrc = 'assets/trash-01.svg';
    this.iconAlt = 'trash icon';
  } else if (data.actionType === 'update') {
    this.iconSrc = 'assets/refresh.png';
    this.iconAlt = 'refresh icon';
    } else {
    this.iconSrc = '';
    this.iconAlt = 'default icon';
  }

  }
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {

    this.dialogRef.close(false);
  }

  protected readonly deleteJobConstant = deleteJobConstant;


  onNoClick(): void {
    this.dialogRef.close();
  }

  protected readonly Shared_dialogConstant = Shared_dialogConstant;
}