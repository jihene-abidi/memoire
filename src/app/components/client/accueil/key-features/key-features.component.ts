import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {KeyFeaturesSectionConstants} from '../accueil.constants'

@Component({
  selector: 'app-key-features',
  standalone: true,
  imports: [CommonModule, MatCardModule,],
  templateUrl: './key-features.component.html',
  styleUrls: ['./key-features.component.css'],
})
export class KeyFeaturesComponent {
  keyFeaturesSectionConstants = KeyFeaturesSectionConstants;

}
