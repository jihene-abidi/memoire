import { Component } from '@angular/core';
import { HeroSectionConstants } from '../accueil.constants'
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../core/services/user';
import { UserModel } from '../../../../core/models/user';
import {NgClass, NgIf} from "@angular/common";
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterModule, NgIf,NgClass],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent {
  heroConstants = HeroSectionConstants;
  userConnected: UserModel | null = null;


constructor(private userService: UserService) {} // injecte correctement le service

  ngOnInit(): void {
    this.userConnected = this.userService.getCurrentUser(); // fonctionne si bien défini dans le service
  }

}
