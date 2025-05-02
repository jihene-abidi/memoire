import { Component } from '@angular/core';
import { AuthentificationImports } from '../authentification-imports';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { UserModel } from '../../../core/models/user';
//import {ToastrService} from "ngx-toastr";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationConstant } from '../authentification.constants';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthentificationImports, FormsModule, ReactiveFormsModule, MatProgressSpinner],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  signInForm: FormGroup;
  user: UserModel = new UserModel();
  showSpinner: boolean = false;
  isSignDivVisiable: boolean  = false;
  authConstant = AuthentificationConstant;
 // signUpForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    //private toastrService: ToastrService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.signInForm = this.fb.group({
      // Initialisation du formulaire de connexion avec des validateurs
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    // this.signUpForm = this.fb.group({
    //   email: ['', [Validators.required, Validators.email]],
    //   password: ['', [Validators.required, Validators.minLength(6)]],
    // });
  }

  // Méthode appelée lors du clic sur le bouton "Sign In"
  onSignIn() {
    if (this.signInForm.valid) {
      this.showSpinner = true;

      // Enregistre l'utilisateur dans le localStorage
      localStorage.setItem(AuthentificationConstant.CURRENT_USER_LOCAL_STORAGE, JSON.stringify(this.user));

      // Récupération des valeurs saisies
      const email = this.signInForm.get('email')?.value;
      const password = this.signInForm.get('password')?.value;

      // Affichage dans la console pour débogage
      console.log("sign in form value",this.signInForm)
      this.showSpinner = false;

      // Redirection vers la page profil client
      this.router.navigate(['/client/client-profile']);
   
    } else {
      //this.toastrService.error(this.authConstant.INVALID_FORM, this.authConstant.INVALID_FORM_TITLE);
      console.log("message erreur")
      
      // Si le formulaire est invalide, on marque tous les champs comme touchés pour afficher les erreurs
      this.signInForm.markAllAsTouched();
    }
  }


  // Méthode appelée lors du clic sur le lien "Sign Up"
  onNavigateToSignUp() {
    console.log('signup')
    this.router.navigate(['/auth/signup']);
  }

  // Méthode appelée lors du clic sur "Forgot Password"
  onNavigateToForgetPassword() {
    this.router.navigate(['/client/forget-password']);
  }
}
