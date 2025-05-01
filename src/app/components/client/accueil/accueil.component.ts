import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeroComponent} from './hero/hero.component';
import {FeaturesComponent} from './features/features.component';
import {KeyFeaturesComponent} from './key-features/key-features.component';
import {ChooseUsComponent} from './choose-us/choose-us.component';
import {StatsSectionComponent} from './stats-section/stats-section.component';
import {ContactUsComponent} from './contact-us/contact-us.component'
import {TranslatePipe} from "@ngx-translate/core";


@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, HeroComponent, FeaturesComponent, KeyFeaturesComponent, ChooseUsComponent, StatsSectionComponent, ContactUsComponent,TranslatePipe],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
})
export class AccueilComponent {

}
