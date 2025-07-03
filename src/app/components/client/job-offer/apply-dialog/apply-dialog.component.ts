import { Component, Inject } from '@angular/core';
import { ToastrService } from "ngx-toastr";

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { JobOfferConstant } from '../job-offer.constants';
import { Router } from '@angular/router';
import { MatButton } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-apply-dialog',
  templateUrl: './apply-dialog.component.html',
  styleUrls: ['./apply-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatDialogTitle,
    MatIconModule,
    CommonModule
  ]
})
export class ApplyDialogComponent {
  jobOfferConstant = JobOfferConstant;
  selectedOption: string = '';

  constructor(
    private  toastrService :ToastrService,
        private router: Router,
    public dialogRef: MatDialogRef<ApplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { jobOffer: any, selectedCv: any },

  ) {}

  selectOption(option: string) {
    this.selectedOption = option;
  }

  proceed() {
      this.dialogRef.close({
        proceed: true,
        interviewType: this.selectedOption,

      });
    }


  closeDialog() {
    this.dialogRef.close({ proceed: false });
  }
}