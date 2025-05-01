import { Routes } from '@angular/router';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { ChangePasswordComponent } from '../client/change-password/change-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { AccueilComponent } from './accueil/accueil.component';


export const ClientRouting: Routes = [
    { path: 'client-profile', component: ClientProfileComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'forget-password', component: ForgetPasswordComponent },
    { path: 'home', component: AccueilComponent },

  ];