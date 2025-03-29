import { Component } from '@angular/core';
//import {NavbarComponent} from "../../navbar/navbar.component";
import {Router, RouterOutlet} from "@angular/router";
import {FooterComponent} from "../app/shared/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    //NavbarComponent,
    RouterOutlet,
    FooterComponent,
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  showFooter = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.showFooter = !this.router.url.includes('/client/chat');
    });
  }
}
