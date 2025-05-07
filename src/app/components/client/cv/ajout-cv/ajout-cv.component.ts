import { Component } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Cv } from '../../../../core/models/cv';
import { MatButton } from '@angular/material/button';
import { FileService } from '../../../../core/services/file.service';
import { NgIf } from '@angular/common';
import { CvConstants } from '../cv.constants';
import { CvService } from '../../../../core/services/cv.service';
import { UserService } from '../../../../core/services/user';
import { UserModel } from '../../../../core/models/user';
import { finalize, mergeMap, throwError } from 'rxjs';
import { MatTooltip } from '@angular/material/tooltip';
import { catchError } from 'rxjs/operators';
import { ClientImports } from '../../client-imports';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { SharedButtonComponent } from '../../../../shared/shared-button/shared-button.component';
import { Router } from '@angular/router';
import { CacheService } from '../../../../core/services/cache';



@Component({
  selector: 'app-ajout-cv',
  standalone: true,
    imports: [
        MatFormField,
        MatRadioButton,
        MatRadioGroup,
        MatIcon,
        MatLabel,
        MatCheckbox,
        FormsModule,
        MatInputModule,
        MatButton,
        NgIf,
        ReactiveFormsModule,
        MatTooltip,
        ClientImports,
        PaginationComponent,
        SharedButtonComponent,
    ],
  templateUrl: './ajout-cv.component.html',
  styleUrls: ['./ajout-cv.component.css'],
})
export class AjoutCvComponent {
  uploadForm: FormGroup;
  fileToUpload: File | null = null;
  uploadStatus: string = '';
  titre: string = '';
  visibility: 'public' | 'private' = 'private';
  currentUser: UserModel;
  cv_text: string = '';
  spinner: boolean = false;
  constructor(
    private fileService: FileService,
    private fb: FormBuilder,
    private cvService: CvService,
    private userService: UserService,
    private router: Router,
    private cacheService: CacheService,
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      visibility: ['private', Validators.required],
      file: [Validators.required],
    });

    this.currentUser = new UserModel();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileToUpload = input.files[0];
      this.uploadForm.patchValue({ file: this.fileToUpload.name });
      this.uploadStatus = ` ${this.fileToUpload.name}`;
    }
  }

  onDrop(event: any): void {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      this.fileToUpload = file;
      this.uploadForm.patchValue({ file: file.name });
      this.uploadStatus = ` ${file.name}`;
    }
  }

  onDragOver(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.fileToUpload) {
      this.cacheService.clearByPattern('/cv');
      this.spinner = true;
      // this.fileService
      //   .ngOnUpload(this.fileToUpload)
      //   .pipe(
      //     mergeMap((response) => {
      //       this.uploadForm.patchValue({ file: response });
      //       const user: UserModel = this.userService.getCurrentUser();
      //       const cv = new Cv();
      //       cv.title = this.uploadForm.value.title;
      //       cv.user._id = user._id;
      //       cv.user.userName = user.userName;
      //       cv.cv_s3 = this.uploadForm.value.file;
      //       cv.visibility = this.uploadForm.value.visibility;

      //       if (this.fileToUpload?.type === 'application/pdf') {
      //         return this.fileService
      //           .extractTextFromPDF(this.fileToUpload)
      //           .pipe(
      //             mergeMap((context: string) => {
      //               cv.cv_txt = context;
      //               return this.cvService.insert(cv);
      //             })
      //           );
      //       } else {
      //         cv.cv_txt = this.cv_text;
      //         return this.cvService.insert(cv);
      //       }
      //     }),
      //     finalize(() => {
      //       setTimeout(() => {
      //         this.router.navigate(['client/my-cvs']);
      //       }, 500);
      //     })
      //   )
      //   .subscribe({
      //     next: () => {
      //       const fileName = this.fileToUpload?.name || 'unknown file';
      //       this.uploadStatus = `${fileName}`;
      //       this.toastrService.success(this.translate.instant(CvConstants.Ajout_Succes));
      //       this.router.navigate(['client/my-cvs']);
      //     },
      //     error: (error) => {
      //       this.spinner = false;
      //       if (
      //         error.message ===
      //         CvConstants.ERROR_FILE_TYPE
      //       ) {
      //         this.toastrService.error(this.translate.instant(CvConstants.TOASTR_ERROR));
      //       } else {
      //         this.toastrService.error(this.translate.instant(CvConstants.Ajout_Failed));
      //       }
      //     },
      //   });
    }
  }

  protected readonly CvConstants = CvConstants;
  protected readonly cvConstants = CvConstants;
  navigateAllCvs() {
    this.router.navigate(['/client/my-cvs']);
  }
}
