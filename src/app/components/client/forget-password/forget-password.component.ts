import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { ClientImports } from '../client-imports';
import { forgetPasswordConstants } from './forget-password.constants';
import {UserService} from "../../../core/services/user";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    ClientImports,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCardModule,
  ],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent {
  forgetPasswordForm: FormGroup;
  verificationCodeSent: boolean;
  psw_constant = forgetPasswordConstants;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    //private amplifyService: AmplifyService,
    private userService: UserService
  ) {
    this.verificationCodeSent = false;
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      verificationCode: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  requestVerificationCode() {
    const email = this.forgetPasswordForm.get('email')?.value;
    if (this.forgetPasswordForm.get('email')?.valid) {
      this.userService.requestResetPassword(email).subscribe({
        next: () => {
          this.toastrService.success(
            "CODE Sent !!"
          );
          this.verificationCodeSent = true;
        },
        error: () => {
          this.toastrService.error(
            "CODE SEND FAILURE "
          );
        },
      });
    } else {
      this.toastrService.warning(
        "VALID EMAIL REQUIRED "
      );
    }
    console.log(this.verificationCodeSent)
  }

  resetPassword() {

    if (this.forgetPasswordForm.valid) {
      const verificationCode =
        this.forgetPasswordForm.get('verificationCode')?.value;
      const newPassword = this.forgetPasswordForm.get('newPassword')?.value;
      const email = this.forgetPasswordForm.get('email')?.value;




      this.userService
        .resetPassword(email, verificationCode, newPassword)
        .subscribe({
          next : () => {
            this.toastrService.error(
              "Password Changed"
            );
            this.router.navigate(['/auth/login'])
          }
        })
    }
  }
}
