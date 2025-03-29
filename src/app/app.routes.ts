import { Routes } from '@angular/router';
import { AuthentificationRoutes } from './components/authentification/authentification-routing';
import {MainLayoutComponent} from "./shared/layout/main-layout/main-layout.component";
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
          {
            path: 'auth',
            children: AuthentificationRoutes,
          },
          {
            path: '',
            redirectTo: 'auth/login',
            pathMatch: 'full',
          },
        ],
    
      },
      {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
      },
      // Handle unknown routes
      {
        path: '**',
        redirectTo: 'auth/login',
      },
];
