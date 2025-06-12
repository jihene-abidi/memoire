import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { clientProfileConstant, errorMessages } from './client-profile.constant';
import { ClientImports } from '../client-imports';

import { UserModel } from '../../../core/models/user';
//import {ResponseStatusModel} from "../../../core/models/response-status";
import intlTelInput from 'intl-tel-input';
import { SuccessConstant } from '../../../core/constants/success.constant';
import { ErrorConstant } from '../../../core/constants/error.constant';
import { UserService } from '../../../core/services/user';

@Component({
  selector: 'app-client-profile',
  standalone: true,
    imports: [ClientImports],
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css'],
})
export class ClientProfileComponent implements OnInit {
  @ViewChild('phoneInput') phoneInput!: ElementRef;


  profileForm!: FormGroup;
  clientProfileConstant = clientProfileConstant;
  errorMessages = errorMessages;
  userConnected!: UserModel;
  showPicture = false;
  pic = 'assets/profile-img.png';
  ClientForm: FormGroup;
  initialCountry: any;
  selectCountry!: string;
  selectedImageFile?: any;  //Stocke le fichier sélectionné


  constructor(
    private fb: FormBuilder,
   private toastr: ToastrService,
   private userService: UserService,
  ) {
    this.ClientForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: [{ value: '', disabled: true }],
      is_verified:[''],
      role: [''],
      phone: ['', [
        Validators.required,
        Validators.pattern('^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})(?: *x(\\d+))?\\s*$')
      ]]
    });
    this.ClientForm.get('mail')?.disable();
  }

  ngOnInit(): void {
    this.userConnected = this.userService.getCurrentUser();
    this.ClientForm.patchValue({
      phone: this.userConnected.phone || ''
    });


    const email = this.userConnected?.email || '';

    this.profileForm = this.fb.group({
      first_name: [this.userConnected.first_name || '', [
        Validators.required,
        Validators.pattern(clientProfileConstant.patterns.name)
      ]],
      last_name: [this.userConnected.last_name || '', [
        Validators.required,
        Validators.pattern(clientProfileConstant.patterns.name)
      ]],
      phone: [this.userConnected.phone || '', [
        Validators.required,
        Validators.pattern(clientProfileConstant.patterns.phone)
      ]],
      email: [{ value: email, disabled: true }, Validators.required],
    });
    this.initializePhoneInput();


  }

  ngAfterViewInit() {
    this.initializePhoneInput();
  }

  private initializePhoneInput(): void {
    if (this.phoneInput?.nativeElement) {
      this.initialCountry = intlTelInput(this.phoneInput.nativeElement, {
        initialCountry: 'tn',
        separateDialCode: true,
      });

      if (this.userConnected?.phone) {
        this.phoneInput.nativeElement.value = this.userConnected.phone;
      }
    }
  }

  private formatPhoneNumber(): string {
    if (this.phoneInput?.nativeElement) {
      const phoneValue = this.phoneInput.nativeElement.value;
      return phoneValue;
    }
    return '';
  }

  getCountryCode() {
    if (this.initialCountry) {
      const countryData = this.initialCountry.getSelectedCountryData();
      return countryData;
    }
    return null;
  }

  private extractLastName(email: string): string {
    if (email?.includes('@')) {
      const parts = email.split('@')[0].split('.');
      return parts[1] || '';
    }
    return '';
  }


  getInitials(): string {
    const email = this.userConnected?.email;
    if (email?.includes('@')) {
      const [first_name, lastName] = email.split('@')[0].split('.');
      return first_name && lastName ? `${first_name[0].toUpperCase()}${lastName[0].toUpperCase()}` : clientProfileConstant.INVALID_FORMAT;
    }
    return clientProfileConstant.INVALID_EMAIL;
  }

  getFullName(): string {
    const email = this.userConnected?.email;
    if (email?.includes('@')) {
      const [first_name, last_name] = email.split('@')[0].split('.');
      return first_name && last_name ? `${first_name[0].toUpperCase() + first_name.slice(1)} ${last_name[0].toUpperCase() + last_name.slice(1)}` : 'Guest';
    }
    return 'Guest';
  }

  get formControls() {
    return this.profileForm.controls;
  }

  Onsubmit(): void {
    const formValues = this.profileForm.getRawValue();
    const formattedPhone = this.formatPhoneNumber();

    const updatedUser: Partial<UserModel> = {
      _id: this.userConnected._id,
      email: formValues.email,
      phone: formattedPhone,
      first_name: formValues.first_name,
      last_name: formValues.last_name,
    };

    this.userService.update(updatedUser).subscribe({
      next: () => {
        if (updatedUser._id) {
          this.userService.findOne(updatedUser._id).subscribe({
            next: (res) => {
              this.userService.setCurrentUser(res);
              this.toastr.success(errorMessages.success, 'Success');
            },
            error: () => {
              this.toastr.error(errorMessages.error, 'Error');
            }
          });
        }
      },
      error: () => {
        this.toastr.error(errorMessages.error, 'Error');
      }
    });

  }

  // 🔹 AJOUT : Convertit et envoie l'image vers l'API
  updateProfileImage(): void {
    if (!this.selectedImageFile || !this.userConnected?._id) {
      this.toastr.error(errorMessages.error, 'Error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result as string;

      const userToUpdate: Partial<UserModel> = {
        _id: this.userConnected._id,
        img: base64Image
      };

      this.userService.updateimage(userToUpdate,this.selectedImageFile).subscribe({
        next: () => {
          this.toastr.success(errorMessages.success, 'Success');
          this.userService.findOne(this.userConnected._id!).subscribe({
            next: (res) => this.userService.setCurrentUser(res),
          });
        },
        error: () => {
          this.toastr.error(errorMessages.error, 'Error');
        }
      });
    };

    reader.readAsDataURL(this.selectedImageFile);
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0];

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = () => {
        this.pic = reader.result as string; // update preview image
      };
      reader.readAsDataURL(this.selectedImageFile);

      // Optional: call update function directly here if you want immediate upload
      this.updateProfileImage();
    }
  }
}


