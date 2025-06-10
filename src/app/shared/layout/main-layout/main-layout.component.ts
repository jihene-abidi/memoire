import { Component } from '@angular/core';
import {NavbarComponent} from "../../navbar/navbar.component";
import {Router, RouterOutlet} from "@angular/router";
import {FooterComponent} from "../../footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    RouterOutlet,
    FooterComponent,
  ],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  showFooter = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.showFooter = !this.router.url.includes('/client/chat');
    });
  }
}
