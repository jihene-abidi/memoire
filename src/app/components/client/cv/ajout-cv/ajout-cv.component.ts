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
    private fb: FormBuilder,
    private cvService: CvService,
    private userService: UserService,
    private router: Router,
    private toastrService: ToastrService,
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
    this.spinner = true;

    const user: UserModel = this.userService.getCurrentUser()!;
    
    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    formData.append('title', this.uploadForm.value.title);
    formData.append('visibility', this.uploadForm.value.visibility || 'private');
    this.cvService.insert(user._id?? "null",formData).subscribe({
      next: (res) => {
        this.spinner = false;
        this.toastrService.success(CvConstants.Ajout_Succes);
        this.router.navigate(['client/my-cvs']);
      },
      error: (err) => {
        this.spinner = false;
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