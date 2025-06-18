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
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { CvConstants } from '../cv.constants';
import { CvService } from '../../../../core/services/cv.service';
import { UserService } from '../../../../core/services/user';
import { UserModel } from '../../../../core/models/user';
import { MatTooltip } from '@angular/material/tooltip';
import { ClientImports } from '../../client-imports';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { SharedButtonComponent } from '../../../../shared/shared-button/shared-button.component';
import { Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";
import { Cv } from '../../../../core/models/cv';
import { FileService } from '../../../../core/services/file.service';
import { finalize, mergeMap, switchMap, throwError,EMPTY, Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {CacheService} from "../../../../core/services/cache";
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
    private toastrService: ToastrService,
    private cacheService: CacheService
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

    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = this.fileToUpload.name?.substring(this.fileToUpload.name?.lastIndexOf('.')).toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      this.spinner = false;
      this.toastrService.error(CvConstants.ERROR_FILE_TYPE);
      return;
    }

    const user: UserModel = this.userService.getCurrentUser()!;
    
    const buildFormData = (cv: Cv): FormData => {
      const formData = new FormData();

      if (cv.title) formData.append('title', cv.title);
      if (cv.visibility) formData.append('visibility', cv.visibility);
      if (cv.cv_txt) formData.append('cv_txt', cv.cv_txt);
      if (this.fileToUpload) formData.append('file', this.fileToUpload);

      if (cv.user.first_name) formData.append('userName', cv.user.first_name);

      // If expertise is defined, send it as a JSON string
      if (cv.expertise) {
        formData.append('expertise', JSON.stringify(cv.expertise));
      }

      return formData;
    };
      const insertCv = (cvText: string): Observable<any> => {
      const cv = new Cv();
      cv.title = this.uploadForm.value.title;
      cv.user._id = user._id;
      cv.user.first_name = user.first_name;
      cv.visibility = this.uploadForm.value.visibility;
      cv.cv_txt = cvText;

      const formData = buildFormData(cv);
      return this.cvService.insert(user._id?? "null", formData);
    };

    
    const processCv$ =
      fileExtension === '.pdf'
        ? this.fileService.extractTextFromPDF(this.fileToUpload).pipe(
            switchMap((context: string) =>
              this.cvService.analyseCv(user._id?? "null",context).pipe(
                switchMap((data: any) => {
                  const cv = new Cv();
                  cv.title = this.uploadForm.value.title;
                  cv.user._id = user._id;
                  cv.user.first_name = user.first_name;
                  cv.visibility = this.uploadForm.value.visibility;
                  cv.cv_txt = context;
                  cv.expertise.owner = data.owner;
                  cv.expertise.contact = {
                    email: data.contact.email,
                    phone_number: data.contact.phone_number,
                  };
                  cv.expertise.technologies = data.technologies;
                  cv.expertise.skills = data.skills;
                  cv.expertise.experience = data.experience;
                  cv.expertise.levels = {
                    education_level: data.levels.education_level,
                    experience_level: data.levels.experience_level,
                    skills_level: data.levels.skills_level,
                    language_level: data.levels.language_level,
                  };
                  cv.expertise.education = data.education;
                  cv.expertise.languages = data.languages;
                  cv.expertise.snapshot = data.snapshot;
                  cv.expertise.hashtags = data.hashtags;
                  cv.expertise.certifications = data.certifications;
                  cv.expertise.atouts = data.atouts;

                  const formData = buildFormData(cv);
                  return this.cvService.insert(user._id?? "null", formData);
                })
              )
            ),
            catchError(() => {
              this.toastrService.error(CvConstants.ERROR_PDF_TEXT);
              return EMPTY;
            })
          )
        : insertCv(this.cv_text);

    processCv$
      .pipe(finalize(() => (this.spinner = false)))
      .subscribe({
        next: () => {
          const fileName = this.fileToUpload?.name || 'unknown file';
          this.uploadStatus = `${fileName}`;
          this.toastrService.success(CvConstants.Ajout_Succes);
          this.router.navigate(['client/my-cvs']);
        },
        error: () => {
          this.toastrService.error(CvConstants.TOASTR_ERROR);
        },
      });
  }
 


  }



  protected readonly CvConstants = CvConstants;
  protected readonly cvConstants = CvConstants;
  navigateAllCvs() {
    this.router.navigate(['/client/my-cvs']);
  }
}