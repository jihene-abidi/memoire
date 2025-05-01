import { Component } from '@angular/core';
import { HeroSectionConstants } from '../accueil.constants'
import { RouterModule } from '@angular/router';

//import {TranslatePipe} from "@ngx-translate/core";
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent {
  heroConstants = HeroSectionConstants;
}
