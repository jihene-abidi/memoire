import { Component } from '@angular/core';
import { FooterConstants } from './footer.constants';
import { Router, RouterLink } from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    NgIf,
  ],
})
export class FooterComponent {
  mobileMenuOpen = false;
  footerConstants = FooterConstants;

  constructor(private router: Router) {} // Added constructor for Router

  scrollToTopPage(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  shouldHideFooter(): boolean {
    const currentRoute = this.router.url;
    return currentRoute.includes('/auth/signup') || currentRoute.includes('/auth/login');
  }
}
