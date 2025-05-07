import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { deleteJobConstant, errorMessages } from './supprimer-job-offer.constants';
import { ToastrService } from 'ngx-toastr';
import { ClientImports } from '../../client-imports';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-supprimer-job-offer',
  standalone: true,
  imports: [MatDialogModule,ClientImports ],
  templateUrl:'./supprimer-job-offer.component.html',
  styleUrl:'./supprimer-job-offer.component.css'
})
export class SupprimerJobOfferComponent {
  deleteJobConstant = deleteJobConstant;
  errorMessages = errorMessages;

  constructor(public dialogRef: MatDialogRef<SupprimerJobOfferComponent>, private toastr: ToastrService,private translate:TranslateService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    const isDeleted = this.deleteJobOffer();
    if (isDeleted) {
      this.toastr.success(this.translate.instant(this.errorMessages.success), this.translate.instant(this.errorMessages.successTitle) );
    } else {
      this.toastr.error(this.translate.instant(this.errorMessages.error), this.translate.instant(this.errorMessages.errorTitle) );
    }
    this.dialogRef.close(true);
  }

  deleteJobOffer(): boolean {
    return true;
  }

}
