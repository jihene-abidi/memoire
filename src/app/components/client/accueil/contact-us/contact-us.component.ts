import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContactSectionConstants } from '../accueil.constants';
import { ClientImports } from '../../client-imports';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import {SharedButtonComponent} from "../../../../shared/shared-button/shared-button.component";
//import {CvConstants} from "../../cv/cv.constants";
import {TranslatePipe} from "@ngx-translate/core";
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [ClientImports, MatFormFieldModule, MatInputModule, MatButtonModule, SharedButtonComponent,TranslatePipe],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent {
  
}
