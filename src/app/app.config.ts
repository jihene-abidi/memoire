import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),  provideHttpClient(),provideClientHydration(), provideAnimationsAsync(),provideAnimations(),importProvidersFrom(ToastrModule.forRoot())]
};
