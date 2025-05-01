import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {WhyUsSectionConstants} from '../accueil.constants'
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-choose-us',
  standalone: true,
  imports: [MatCardModule,CommonModule,TranslatePipe],
  templateUrl: './choose-us.component.html',
  styleUrls: ['./choose-us.component.css'],
})
export class ChooseUsComponent {
  whyUsConstants = WhyUsSectionConstants;
}
