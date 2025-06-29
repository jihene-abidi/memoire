import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientImports } from '../../client-imports';
import { Cv ,Visibility} from '../../../../core/models/cv';


import { FileService } from '../../../../core/services/file.service';
import { SharedButtonComponent } from '../../../../shared/shared-button/shared-button.component';
import { Candidature } from '../../../../core/models/candidature';
import { UserModel } from '../../../../core/models/user';
import { JobOfferConstant } from '../job-offer.constants';
import {ToastrService} from "ngx-toastr";
import {TranslatePipe,TranslateService} from "@ngx-translate/core";
import { ErrorConstant } from '../../../../core/constants/error.constant';
import { WarningConstant } from '../../../../core/constants/warning.constant';




export interface SelectCvDialogData {
  cvs: Cv[];
  isDownloadMode?: boolean;   

}
@Component({
  selector: 'app-application',
  standalone: true,
  imports: [ClientImports,SharedButtonComponent,TranslatePipe],
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
    private fileService:FileService,
    private toastrService: ToastrService,
    private translate: TranslateService



 
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

    if (!cv.cv_s3) {
      console.error('CV file path is missing.');
      return;
    }

    this.fileService.awsFile(cv.cv_s3).subscribe({
      next: (file) => {
        this.triggerDownload(file.source, file.name);
      },
      error: (error) => {
        console.error('Error downloading CV:', error);
      },
    });
  }
  

  downloadReport(candidature: any) {
    if(!candidature.report_s3){
      this.toastrService.error(this.translate.instant(ErrorConstant.CANDIDATE_ERROR))
      return
    }

  
    this.fileService.awsFile(candidature.report_s3).subscribe({
      next: (file) => {
        this.triggerDownload(file.source, file.name);
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement du rapport :', error);
      },
    });
  }
  downloadAudio(){
    this.toastrService.warning(this.translate.instant(WarningConstant.AUDIO_ERROR))
  }

  

  private triggerDownload(url: string, fileName: string) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  onImageLoad(candidature: any) {
    candidature.loading = false; 
  }
}