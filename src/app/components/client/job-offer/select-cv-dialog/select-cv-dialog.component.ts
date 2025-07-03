import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { Cv } from '../../../../core/models/cv';
import { ClientImports } from '../../client-imports';
import { JobOfferConstant } from '../job-offer.constants';
import {ApplyDialogComponent} from "../apply-dialog/apply-dialog.component";
import { MyCvsComponent } from '../../cv/my-cvs/my-cvs.component';
import { CvService } from '../../../../core/services/cv.service';



@Component({
  selector: 'app-select-cv-dialog',
  templateUrl: './select-cv-dialog.component.html',
  standalone: true,
  imports: [ClientImports, MyCvsComponent],
  styleUrls: ['./select-cv-dialog.component.css'],
})
export class SelectCvDialogComponent {
  selectedCv!: Cv;
  jobOfferConstant = JobOfferConstant;
  hideAddCvButton: boolean = true;

  constructor(
    private cvService: CvService,
    public dialogRef: MatDialogRef<SelectCvDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cvs: Cv[] },
    private dialog: MatDialog
  ) {
  }

onSelect() {
  const dialogRef = this.dialog.open(ApplyDialogComponent, {
    width: '400px',
    data: {
      selectedCv: this.selectedCv,
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && result.proceed) {
      if (result.interviewType === 'call' || result.interviewType === 'text') {
        this.cvService.findOne(this.selectedCv._id).subscribe((cv) => {
          this.dialogRef.close({
            selectedCv:cv,
            interviewType: result.interviewType
          });
        });
      } else {
        this.dialogRef.close();
      }
    }
  });
}

}