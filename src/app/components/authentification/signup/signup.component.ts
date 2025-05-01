import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCard, MatCardHeader } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { AuthentificationConstant } from '../authentification.constants';
import { AuthentificationImports } from '../authentification-imports';
// import { AmplifyService } from '../../../core/services/amplify';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

// import { AuthService } from '../../../core/services/auth';
// import { UserService } from '../../../core/services/user';
// import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatIconModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    AuthentificationImports,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  showSpinner: boolean = false;
  authConstant = AuthentificationConstant;
  showPassword = false;
  showConfirmPassword = false;
  formSubmitted: boolean = false;
  isSignDivVisiable: boolean = false;
  captchaKey: string = '';
  constructor(
    private fb: FormBuilder,
    // private toastrService: ToastrService,
    private router: Router,
    //private configService: ConfigService,
    // private authservice: AuthService,
    // private userService: UserService, 
    // private translate: TranslateService
  ) {
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        recaptcha: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );

    this.signupForm.get('password')?.valueChanges.subscribe(() => {
      this.signupForm.get('confirmPassword')?.updateValueAndValidity();
    });
    this.signupForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.signupForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }
  ngOnInit(): void {
    // this.configService.loadConfig().subscribe({
    //   next: () => {
    //     this.captchaKey = this.configService.getCaptchaKey();
    //   },
    //   error: (err) => {
    //     console.error(this.authConstant.ERROR_RECAPTCHA, err);
    //   },
    // });
  }

  passwordsMatchValidator(formGroup: FormGroup): void {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');
    if (
      confirmPasswordControl?.errors &&
      !confirmPasswordControl.errors['passwordMismatch']
    ) {
      return;
    }
    if (passwordControl?.value !== confirmPasswordControl?.value) {
      confirmPasswordControl?.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl?.setErrors(null);
    }
  }
  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  getUsernameFromEmail(str: any): string {
    return str.slice(0, str.indexOf('@'));
  }
  onSignup(): void {
    this.formSubmitted = true;

    if (!this.signupForm.controls['recaptcha'].value) {
    //   this.toastrService.error(
    //     this.translate.instant(this.authConstant.RECAPTCHA_NOT_VERIFIED),
    //     this.translate.instant(this.authConstant.ERROR_TITLE)
    //   );
      return;
    }

    const email = this.signupForm.controls['email'].value;
    if (this.signupForm.invalid || !this.isValidEmail(email)) {
      if (!this.isValidEmail(email)) {
        // this.toastrService.error(
        //   this.translate.instant(this.authConstant.EMAIL_INVALID_ERROR),
        //   this.translate.instant(this.authConstant.INVALID_FORM_TITLE)
        // );
      } else {
        this.signupForm.markAllAsTouched();
        // this.toastrService.error(
        //   this.translate.instant(this.authConstant.INVALID_FORM),
        //   this.translate.instant(this.authConstant.INVALID_FORM_TITLE)
        // );
      }
      return;
    }
    
    const userName = this.getUsernameFromEmail(email);
    const { password } = this.signupForm.value;
    this.showSpinner = true;
    // this.authservice.signUp(userName, password, email).subscribe({
    //   next: () => {
    //     this.showSpinner = false;
    //     this.toastrService.success(
    //       this.translate.instant(this.authConstant.SIGN_UP_SUCCESS),
    //       this.translate.instant(this.authConstant.SIGNUP_SUCCESSFUL)
    //     );
    //     this.router.navigateByUrl('/auth/login');
    //   },
    //   error: (error) => {
    //     this.showSpinner = false;
    //     console.error('Signup error:', error);
    //     if (error.code === 'UsernameExistsException') {
    //       this.toastrService.error(
    //         this.translate.instant(this.authConstant.USER_ALREADY_EXISTS),
    //         this.translate.instant(this.authConstant.ERROR_TITLE)
    //       );
    //     } else {
    //       this.toastrService.error(
    //         this.translate.instant(this.authConstant.UNKNOWN_ERROR),
    //         this.translate.instant(this.authConstant.SIGNUP_ERROR)
    //       );
    //     }
    //   },
    // });
  }
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
  navigateToSignIn() {
    this.router.navigate(['auth/login']);
  }
}
