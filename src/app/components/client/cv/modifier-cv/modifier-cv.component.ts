import { Component, OnInit } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { CvConstants } from '../cv.constants';
import { AmplifyService } from '../../../../core/services/amplify';
//import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { UserModel } from '../../../../core/models/user';
import { ClientImports } from '../../client-imports';
import { SharedButtonComponent } from '../../../../shared/shared-button/shared-button.component';
import { CvService } from '../../../../core/services/cv.service';
import { Cv, Visibility } from '../../../../core/models/cv';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user';
import { FileService } from '../../../../core/services/file.service';
import { CacheService } from '../../../../core/services/cache';
import { ErrorConstant } from '../../../../core/constants/error.constant';

@Component({
  selector: 'app-modifier-cv',
  standalone: true,
  imports: [
    ClientImports,
    MatFormField,
    MatRadioButton,
    MatRadioGroup,
    MatLabel,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButton,
    NgIf,
    SharedButtonComponent
  ],
  templateUrl: './modifier-cv.component.html',
  styleUrls: ['./modifier-cv.component.css'],
})
export class ModifierCvComponent implements OnInit {
  uploadForm: FormGroup;
  fileToUpload: File | null = null;
  uploadStatus: string = '';
  titre: string = '';
  visibility: 'public' | 'private' = 'private';
  currentUser!: UserModel;
  cvId: string | null = null;
  cvData: Cv | null = null;
  constants = CvConstants;

  constructor(
    private fileService: FileService,
    private fb: FormBuilder,
    private amplifyService: AmplifyService,
    //private toastrService: ToastrService,
    private cvService: CvService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cacheService: CacheService
  ) {
    this.uploadForm = this.fb.group({
      titre: ['', Validators.required],
      visibility: ['private', Validators.required],
      file: [null],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.cvId = params.get('id');
      if (this.cvId) {
        this.loadCvData(this.cvId);
      } else {
        //this.toastrService.error(this.translate.instant(ErrorConstant.CV_ID_NOT_FOUND));
        this.router.navigate(['/client/my-cvs']);
      }
    });
  }

  loadCvData(cvId: string): void {
    this.cvService.findOne(cvId).subscribe(
      (cv: Cv) => {
        this.cvData = cv;

        if (cv.cv_s3) {
          const fileId = cv.cv_s3;

          this.fileService.findOne(fileId).subscribe(
            (fileData) => {
              this.uploadStatus = `${fileData.name}`;
              this.populateFormWithCvData(cv);
            },
            (error) => {
              //console.error(this.translate.instant(ErrorConstant.ERROR_LOADING_FILE), error);
              this.populateFormWithCvData(cv);
            }
          );
        } else {
          this.populateFormWithCvData(cv);
        }
      },
      (error) => {
        //this.toastrService.error(this.translate.instant(ErrorConstant.FAILED_LOAD_CV));
        console.error('Error loading CV data:', error);
        this.router.navigate(['/client/my-cvs']);
      }
    );
  }

  populateFormWithCvData(cv: Cv): void {
    const visibilityValue =
      cv.visibility === Visibility.Public ? 'public' : 'private';

    this.uploadForm.patchValue({
      titre: cv.title,
      visibility: visibilityValue,
    });

    this.titre = cv.title;
    this.visibility = visibilityValue as 'public' | 'private';

    if (cv.cv_s3 && !this.uploadStatus) {
      this.uploadStatus = `${CvConstants.UPLOAD_STATUSES}: ${cv.cv_s3}`;

      

    }

    console.log('Form populated with CV data:', {
      titre: cv.title,
      visibility: visibilityValue,
      cv_s3: cv.cv_s3,
    });
  }

  updateCv(): void {
    if (this.uploadForm.valid && this.cvData) {
      this.cacheService.clearByPattern('/cv');
      const updatedCv: Cv = {
        ...this.cvData,
        _id: this.cvData._id,
        title: this.uploadForm.value.titre,
        visibility:
          this.uploadForm.value.visibility === 'public'
            ? Visibility.Public
            : Visibility.Private,
      };

      if (this.fileToUpload) {
        this.amplifyService.upload(this.fileToUpload).subscribe({
          next: (response) => {
            this.submitCvUpdate(updatedCv);
          },
          error: (error) => {
           // this.uploadStatus = this.translate.instant(CvConstants.UPLOAD_STATUSES.UPLOAD_FAILED) ;
           // this.toastrService.error(this.translate.instant(CvConstants.Modify_Failed));
          },
        });
      } else {
        this.submitCvUpdate(updatedCv);
      }
    }
  }

  submitCvUpdate(updatedCv: Cv): void {
    this.cvService.update(updatedCv).subscribe({
      next: () => {
       // this.toastrService.success(this.translate.instant(CvConstants.Modify_Succes));
        this.router.navigate(['/client/my-cvs']);
      },
      error: (error) => {
       // this.toastrService.error(this.translate.instant(CvConstants.Modify_Failed));
        console.error('Error updating CV:', error);
      },
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
     // this.uploadStatus = `${this.translate.instant(CvConstants.UPLOAD_STATUSES.FILE_SELECTED)} ${file.name}`;

    }
  }

  onDrop(event: any): void {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      this.fileToUpload = file;
     // this.uploadStatus = `${this.translate.instant(CvConstants.UPLOAD_STATUSES.FILE_SELECTED)}${file.name}`;

    }
  }

  onDragOver(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
