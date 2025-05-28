import { Routes } from '@angular/router';
import { AuthentificationRoutes } from './components/authentification/authentification-routing';
import {MainLayoutComponent} from "./shared/layout/main-layout/main-layout.component";
import { ClientRouting } from './components/client/client-routing';
import { AuthGuard } from './core/services/auth-guard.service';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
          {
            path: 'auth',
            children: AuthentificationRoutes,
          },
          {
            path: 'client',
            children: ClientRouting,
    
          },
          {
            path: '',
            redirectTo: 'auth/login',
            pathMatch: 'full',
          },
        ],
    
      },
      {
        path: 'client',
        children: ClientRouting,
    
      },
      {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
      },
      {
        path: '',
        redirectTo: 'auth/signup',
        pathMatch: 'full',
      },
      // Handle unknown routes
      {
        path: '**',
        redirectTo: 'auth/login',
      },
];
