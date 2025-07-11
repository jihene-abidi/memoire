import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientImports } from '../../client-imports';
import { Cv ,Visibility} from '../../../../core/models/cv';
import { SharedButtonComponent } from '../../../../shared/shared-button/shared-button.component';
import { Candidature } from '../../../../core/models/candidature';
import { UserModel } from '../../../../core/models/user';
import { JobOfferConstant } from '../job-offer.constants';
import {ToastrService} from "ngx-toastr";



export interface SelectCvDialogData {
  cvs: Cv[];
  isDownloadMode?: boolean;   

}
@Component({
  selector: 'app-application',
  standalone: true,
  imports: [ClientImports,SharedButtonComponent],
  templateUrl: './application.component.html',
  styleUrls:['./application.component.css']
 
})
export class ApplicationComponent {
 
  candidatures: any[];
  loading: boolean = true;
  Visibility = Visibility;  
  currentUser!: UserModel;
  jobOfferConstant = JobOfferConstant;
  
  




  constructor(
    public dialogRef: MatDialogRef<ApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cvs: Cv[],candidatures: Candidature[] } ,
    private toastrService: ToastrService,



 
  ) {
    this.candidatures = data.candidatures.map(candidature => ({
      ...candidature,
      loading: true 
    }));
    
    setTimeout(() => {
      this.loading = false;  
    }, 1000);
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  
  
  
  downloadCv(candidature: Candidature) {
    const cv = candidature.cv;
  }
}