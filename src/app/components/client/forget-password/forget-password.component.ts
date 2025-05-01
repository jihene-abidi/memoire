import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
//import { ToastrService } from 'ngx-toastr';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
//import { AmplifyService } from '../../../core/services/amplify';
import { ClientImports } from '../client-imports';
import { forgetPasswordConstants } from './forget-password.constants';
//import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    ClientImports,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCardModule,
   // TranslatePipe,
  ],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent {
  forgetPasswordForm: FormGroup;
  verificationCodeSent: boolean = false;
  psw_constant = forgetPasswordConstants;

  constructor(
    private fb: FormBuilder,
    //private toastrService: ToastrService,
    private router: Router,
    //private amplifyService: AmplifyService,
   // private translate: TranslateService
  ) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      verificationCode: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  requestVerificationCode() {
    const email = this.forgetPasswordForm.get('email')?.value;
    if (this.forgetPasswordForm.get('email')?.valid) {
    /*  this.amplifyService.sendForgotPassword(email).subscribe({
        next: () => {
          this.toastrService.success(
            this.translate.instant(this.psw_constant.EMAIL_CODE_MESSAGE)
          );
          this.verificationCodeSent = true;
        },
        error: () => {
          this.toastrService.error(
            this.translate.instant(this.psw_constant.CODE_SEND_FAILURE_MESSAGE)
          );
        },
      });*/
    } else {
      /*this.toastrService.warning(
        this.translate.instant(this.psw_constant.VALID_EMAIL_REQUIRED_MESSAGE)
      );*/
    }
  }

  resetPassword() {
    if (this.forgetPasswordForm.valid) {
      const email = this.forgetPasswordForm.get('email')?.value;
      const verificationCode =
        this.forgetPasswordForm.get('verificationCode')?.value;
      const newPassword = this.forgetPasswordForm.get('newPassword')?.value;
/*
      this.amplifyService
        .forgotPasswordSubmit(email, verificationCode, newPassword)
        .then(() => {
          this.toastrService.success(
            this.translate.instant(this.psw_constant.SUCCESS)
          );
          this.router.navigate(['/login']);
        })
        .catch((e:any) => {
          const errorType = e.code || e.__type;
          if (errorType === 'CodeMismatchException') {
            this.toastrService.error(e.message);
          } else {
            this.toastrService.error(
              this.translate.instant(this.psw_constant.ERROR_OCCURED_MESSAGE)
            );
          }
        });*/
    }
  }
}
