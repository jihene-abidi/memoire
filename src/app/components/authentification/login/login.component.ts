import { Component } from '@angular/core';
import { AuthentificationImports } from '../authentification-imports';
import {
  FormsModule,
  ReactiveFormsModule, 
  FormGroup,
  FormBuilder,
  Validators,  
} from '@angular/forms'; 
import {ToastrService} from "ngx-toastr";
import { Router } from '@angular/router';
import { AuthentificationConstant } from '../authentification.constants';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import { AuthService } from '../../../core/services/auth';
import { UserService } from '../../../core/services/user';
import { switchMap } from 'rxjs/operators'; // Permet de chaîner deux requêtes HTTP sans imbriquer les souscriptions

@Component({
  selector: 'app-login',
  standalone: true, //composant autonome fonctionne indépendamment, sans avoir besoin d'être déclarés dans un module Angular
  imports: [AuthentificationImports, FormsModule, ReactiveFormsModule, MatProgressSpinner],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  signInForm: FormGroup;
  showSpinner: boolean = false;
  isSignDivVisiable: boolean  = false;
  authConstant = AuthentificationConstant;
  
 constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.signInForm = this.fb.group({
      // Initialisation du formulaire de connexion avec des validateurs
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Méthode appelée lors du clic sur le bouton "Sign In"
  onSignIn() {
    // Vérifie si le formulaire est valide
    if (this.signInForm.valid) {
      this.showSpinner = true; // Affiche le spinner
      // Récupération des valeurs saisies
      const email = this.signInForm.get('email')?.value;
      const password = this.signInForm.get('password')?.value;
  /******************************************************************/
      // Appelle le service pour se connecter
      this.authService.signIn(email, password).pipe(
         // Si connexion réussie, on enchaîne avec getUserByToken pour récupérer les infos utilisateur
        switchMap(() => this.authService.getUserByToken())
        ).subscribe({
          next: (user) => {
            // On stocke les infos utilisateur dans le service
            this.userService.setCurrentUser(user); // 🔹 stocke dans le localStorage
            console.log('Utilisateur connecté récupéré :', user);
            this.toastrService.success('Connexion réussie !');
            this.router.navigate(['/client/home']);
        },
        error: (err) => {
          this.showSpinner = false;  // Si erreur, on arrête le spinner
        }
      });
    } else {
      // Si le formulaire n’est pas valide
      this.toastrService.error(this.authConstant.INVALID_FORM, this.authConstant.INVALID_FORM_TITLE);
      this.signInForm.markAllAsTouched();
    }
  /********************************************************************************/
  }


  // Méthode appelée lors du clic sur le lien "Sign Up"
  onNavigateToSignUp() {
    this.router.navigate(['/auth/signup']);
  }

  // Méthode appelée lors du clic sur "Forgot Password"
  onNavigateToForgetPassword() {
    this.router.navigate(['/client/forget-password']);
  }
}
