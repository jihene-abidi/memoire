import {Component } from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import { MatIcon } from "@angular/material/icon";
import { MatDivider } from "@angular/material/divider";
import { Router, RouterLink} from '@angular/router';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import {MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { UserService } from "../../core/services/user";
import {UserModel} from "../../core/models/user";
import { NavbarConstants } from './navbar.constants';
import {MatChipAvatar} from "@angular/material/chips";
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatSuffix} from "@angular/material/form-field";
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatButtonToggle} from "@angular/material/button-toggle";
import { MatListModule } from '@angular/material/list';

@Component({
  selector: "app-navbar",
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrls: ['./navbar.component.css'],
  imports: [
    MatToolbarModule,
    MatIcon,
    MatDivider,
    RouterLink,
    MatToolbar,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    NgIf,
    MatButton,
    MatChipAvatar,
    MatDrawer,
    MatDrawerContainer,
    MatSuffix,
    MatSidenavModule,
    MatButtonToggle,
    NgClass,
    MatListModule


  ],
})
export class NavbarComponent{
  isMenuOpen = false;
  userConnected: UserModel | null = null; 
  NavbarConstants = NavbarConstants;
  pic = 'assets/UserAvatar.png';
  showPicture: boolean = false;
  constructor(
    private router: Router,
    private userService :UserService,


  ) {}


  ngOnInit(): void {
    this.getCurrentUser();
    this.getInitials();
  }

  getInitials(): string {
    if (!this.userConnected) {
      return NavbarConstants.NO_ACCESS;
    } else {
      const email = this.userConnected.email;

      if (email && email.includes('@')) {
        const nameParts = email.split('@')[0].split('.');

        if (nameParts.length === 2) {
          const [firstName, lastName] = nameParts;

          const firstInitial = firstName.charAt(0).toUpperCase();
          const lastInitial = lastName.charAt(0).toUpperCase();


          return `${firstInitial}${lastInitial}`;
        } else {
          return NavbarConstants.INVALID_FORMAT;
        }
      } else {
        return NavbarConstants.INVALID_EMAIL;
      }
    }
  }

  shouldHideNavbar(): boolean {
    const currentRoute = this.router.url;
    return currentRoute.includes('/auth/signup') || currentRoute.includes('/auth/login');
  }

  getCurrentUser(): void{

    this.userConnected = this.userService.getCurrentUser();
       this.userService.currentUser$.subscribe((user) => {
      if (user) {
        this.userConnected = user;
        if (user.profile_image) {
          this.pic = `http://127.0.0.1:5000/${user.profile_image}`;
          this.showPicture = true;
        } else {
          this.pic = 'assets/UserAvatar.png';
          this.showPicture = false;
        }
      }
    });
   }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
 


  getFullName(): string {
     console.log(this.userConnected)
    if (!this.userConnected) {
      console.log(this.userConnected)
      return 'Guest';
    } else {
      const first_name= this.userConnected.first_name;
      if(first_name){
        return first_name
      } else {
        return 'Guest'
      }
      // const email = this.userConnected.email;
      // if (email && email.includes('@')) {
      //   const nameParts = email.split('@')[0].split('.');
      //   if (nameParts.length === 2) {
      //     const [firstName, lastName] = nameParts;
      //     return `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`;
      //   } else {
      //     return 'Guest';
      //   }
      // } else {
      //   return 'Guest';
      // }
    }
  }

  signOut() {
    localStorage.removeItem(NavbarConstants.CURRENT_USER_LOCAL_STORAGE);
    this.router.navigate(['/auth/login']);
  }
}