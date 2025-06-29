import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientImports } from '../../client-imports';
import { JobOfferConstant } from '../job-offer.constants';
import { CvService } from '../../../../core/services/cv.service';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { FileService } from '../../../../core/services/file.service';
import { Cv } from '../../../../core/models/cv';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../core/services/user';
import { MatTooltip } from "@angular/material/tooltip";
import { MatRadioButton } from "@angular/material/radio";
import {catchError, of, switchMap} from "rxjs";
import {map} from "rxjs/operators";


interface UpdateCandidatCvDialogData {
  currentCvTitle: string;
  currentCvId: string;
  jobOfferId: string;
  candidatureId : string;
}

@Component({
  selector: 'app-update-candidat-cv',
  imports: [ClientImports, MatTooltip, MatRadioButton],
  templateUrl: './update-candidat-cv.component.html',
  styleUrl: './update-candidat-cv.component.css',
  standalone: true,
})

export class UpdateCandidatCvComponent implements OnInit {
  jobOfferConstant = JobOfferConstant;
  availableCvs: Cv[] = [];
  selectedCvId: string = '';
  isLoading = false;
  isUpdatingCv = false;

  constructor(
    public dialogRef: MatDialogRef<UpdateCandidatCvComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateCandidatCvDialogData,
    private cvService: CvService,
    private candidatureService: CandidatureService,
    private fileService: FileService,
    private toastrService: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadAvailableCvs();
  }

  loadAvailableCvs() {
    this.isLoading = true;
    const currentUser = this.userService.getCurrentUser();
    this.cvService.findAll(20, undefined, currentUser?._id).subscribe({
      next: (response: any) => {
        let cvs: Cv[] = [];
        if (response.data && Array.isArray(response.data)) {
          cvs = response.data;
        } else if (Array.isArray(response)) {
          cvs = response;
        } else if (response.cvs && Array.isArray(response.cvs)) {
          cvs = response.cvs;
        } else {
          this.toastrService.warning(this.jobOfferConstant.ERROR_LOADING_CVS);
          cvs = [];
        }
        this.availableCvs = cvs.filter((cv: Cv) =>
          cv._id !== this.data.currentCvId
        );
        this.isLoading = false;
      },
      error: () => {
        this.toastrService.error(this.jobOfferConstant.ERROR_LOADING_CVS);
        this.isLoading = false;
        this.availableCvs = [];
      }
    });
  }


  selectCv(cvId: string) {
    this.selectedCvId = cvId;
  }

  confirmCvUpdate() {
    if (!this.selectedCvId) {
      this.toastrService.warning(this.jobOfferConstant.WARNING_SELECT_CV);
      return;
    }

    this.isUpdatingCv = true;
    const selectedCv = this.availableCvs.find(cv => cv._id === this.selectedCvId);

    if (!selectedCv) {
      this.toastrService.error(this.jobOfferConstant.ERROR_CV_NOT_FOUND);
      this.isUpdatingCv = false;
      return;
    }

    const updatePayload = { cv: selectedCv };
/*
    this.candidatureService.updateCandidature(this.data.candidatureId, updatePayload).pipe(
      switchMap((response) => {
        const identifier = response.candidature?.identifier;

        if (!identifier) {
          this.toastrService.warning(this.jobOfferConstant.WARNING_NO_IDENTIFIER);
          this.dialogRef.close({
            updated: true,
            newCvId: this.selectedCvId,
            newCvTitle: selectedCv.title,
            candidature: response.candidature
          });
          return of(null); // stop the stream
        }

        return this.fileService.updateCandidatureInS3({
          ...response.candidature,
          identifier
        }).pipe(
          map(() => ({ response, success: true })),
          catchError(() => of({ response, success: false }))
        );
      })
    ).subscribe({
      next: (result) => {
        if (!result) return;

        const { response, success } = result;

        if (success) {
          this.toastrService.success(this.translate.instant(this.jobOfferConstant.SUCCESS_CV_UPDATED ));
        } else {
          this.toastrService.success(this.translate.instant(this.jobOfferConstant.SUCCESS_CV_DB_ONLY));
        }

        this.dialogRef.close({
          updated: true,
          newCvId: this.selectedCvId,
          newCvTitle: selectedCv.title,
          candidature: response
        });
      },
      error: (error) => {
        this.toastrService.error(
          error.error?.message || this.translate.instant(this.jobOfferConstant.ERROR_UPDATE_FAILED)
        );
        this.isUpdatingCv = false;
      }
    });*/
  }



  closeDialog() {
    this.dialogRef.close({ updated: false });
  }
}