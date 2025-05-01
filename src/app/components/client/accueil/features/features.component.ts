import { Component } from '@angular/core';
import {FeaturesSectionConstants} from '../accueil.constants'

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css'],
})
export class FeaturesComponent {
  featuresConstants = FeaturesSectionConstants;
}
