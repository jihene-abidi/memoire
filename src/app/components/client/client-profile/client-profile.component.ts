import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { clientProfileConstant, errorMessages } from './client-profile.constant';
import { ClientImports } from '../client-imports';

import { UserModel } from '../../../core/models/user';
//import { SuccessConstant } from '../../../core/constants/success.constant';
//import { ErrorConstant } from '../../../core/constants/error.constant';
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



  constructor(
    private fb: FormBuilder,
   private toastr: ToastrService,
   private userService: UserService,
  ) {
    this.ClientForm = this.fb.group({
      last: [''],
      first: [''],
      mail: [{ value: '', disabled: true }],
      phone: ['', [
        Validators.required,
        Validators.pattern('^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})(?: *x(\\d+))?\\s*$')
      ]]    });
    this.ClientForm.get('mail')?.disable();
  }

  ngOnInit(): void {
    this.userConnected = this.userService.getCurrentUser();
    this.ClientForm.patchValue({
      phone: this.userConnected.phone || ''

    });


    const email = this.userConnected?.email || '';

    this.profileForm = this.fb.group({
      firstName: [this.userConnected.userName || '', [
        Validators.required,
        Validators.pattern(clientProfileConstant.patterns.name)
      ]],
      lastName: [this.userConnected.lastName || '', [
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
      const [firstName, lastName] = email.split('@')[0].split('.');
      return firstName && lastName ? `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}` : clientProfileConstant.INVALID_FORMAT;
    }
    return clientProfileConstant.INVALID_EMAIL;
  }

  getFullName(): string {
    const email = this.userConnected?.email;
    if (email?.includes('@')) {
      const [firstName, lastName] = email.split('@')[0].split('.');
      return firstName && lastName ? `${firstName[0].toUpperCase() + firstName.slice(1)} ${lastName[0].toUpperCase() + lastName.slice(1)}` : 'Guest';
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
      userName: formValues.firstName,
      lastName: formValues.lastName,
    };


   
  }

}
