import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCard, MatCardHeader } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthentificationConstant } from '../authentification.constants';
import { AuthentificationImports } from '../authentification-imports';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
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
    private toastrService: ToastrService,
    private router: Router,
    private authservice: AuthService, 
  ) {
    // Création du formulaire avec validations
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required], 
      },
      { validators: this.passwordsMatchValidator } // Validation personnalisée
    );

    // Lorsqu’on change le mot de passe, on vérifie si la confirmation est toujours correcte
    this.signupForm.get('password')?.valueChanges.subscribe(() => { //valueChanges utiliser pour déclencher la vérification dès que l’utilisateur modifie le mot de passe 
      this.signupForm.get('confirmPassword')?.updateValueAndValidity();
    });
    this.signupForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.signupForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }
  ngOnInit(): void {
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
      confirmPasswordControl?.setErrors({ passwordMismatch: true }); // Erreur si les mots de passe ne correspondent pas
    } else {
      confirmPasswordControl?.setErrors(null);
    }
  }
  // Pour afficher ou masquer les champs mot de passe
  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  // Utilisé pour extraire un nom d’utilisateur à partir d’un email
  getUsernameFromEmail(str: any): string {
    return str.slice(0, str.indexOf('@'));
  }
   // Fonction appelée à la soumission du formulaire
  onSignup(): void {
    this.formSubmitted = true;

    const email = this.signupForm.controls['email'].value;
    // Vérification de la validité du formulaire et de l’email
    if (this.signupForm.invalid || !this.isValidEmail(email)) {
      if (!this.isValidEmail(email)) {
        this.toastrService.error(
          this.authConstant.EMAIL_INVALID_ERROR,
          this.authConstant.INVALID_FORM_TITLE
        );
      } else {
        this.signupForm.markAllAsTouched();
        this.toastrService.error(
          this.authConstant.INVALID_FORM,
          this.authConstant.INVALID_FORM_TITLE
        );
      }
      return;
    }

    // Récupération des champs nécessaires
    const role = this.signupForm.controls['role'].value;
    const userName = this.getUsernameFromEmail(email);
    const { password } = this.signupForm.value;
    this.showSpinner = true;
     // Appel API d’inscription
     this.authservice.signUp(userName, password, email, role).subscribe({
       next: () => {
         this.showSpinner = false;
         this.toastrService.success(
          this.authConstant.SIGN_UP_SUCCESS,
           this.authConstant.SIGNUP_SUCCESSFUL
         );
         this.router.navigateByUrl('/auth/login'); // Redirection après succès
       },
      error: (error) => {
         this.showSpinner = false;
        console.error('Signup error:', error);
        if (error.code === 'UsernameExistsException') {
          this.toastrService.error(
           this.authConstant.USER_ALREADY_EXISTS,
            this.authConstant.ERROR_TITLE
         );
         } 
       },
     });
  }
  // Fonction pour vérifier le format de l’email avec une RegExp
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
  // Redirection vers la page de login
  navigateToSignIn() {
    this.router.navigate(['auth/login']);
  }
  
}
