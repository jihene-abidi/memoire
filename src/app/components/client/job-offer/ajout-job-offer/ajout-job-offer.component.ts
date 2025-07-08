import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ClientImports } from '../../client-imports';
import { FormsModule } from '@angular/forms';
import { AjoutJobOfferConstants } from './ajout-job-offer.constants';
import { MatInput } from '@angular/material/input';
import { SharedButtonComponent } from '../../../../shared/shared-button/shared-button.component';
import { JobOfferConstant } from '../job-offer.constants';
import { JobOfferService } from '../../../../core/services/JobOfferService';
import { CvConstants } from '../../cv/cv.constants';
import { Router, RouterModule } from '@angular/router';
import { JobOffer } from '../../../../core/models/jobOffer';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CacheService } from '../../../../core/services/cache';
@Component({
  selector: 'app-ajout-job-offer',
  standalone: true,
  imports: [
    ClientImports,
    FormsModule,
    MatInput,
    SharedButtonComponent,
    RouterModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule
  ],
  templateUrl: './ajout-job-offer.component.html',
  styleUrl: './ajout-job-offer.component.css',
})
export class AjoutJobOfferComponent {
  jobOffer: JobOffer = new JobOffer();
  isDetailsExpanded = false;
  levels: string[] = [AjoutJobOfferConstants.JUNIOR_LEVEL, AjoutJobOfferConstants.SENIOR_LEVEL];
  spinner: boolean = false;

  constructor(
    public jobofferservice: JobOfferService,
    private router: Router,
    private cacheService: CacheService
  ) {}



  addJobOffer() {
    this.cacheService.clearByPattern('/offre');

    if (!this.jobOffer.title) {
      return;
    }

    const jobOfferToSend: any = { title: this.jobOffer.title };
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      const user = JSON.parse(userString);
      jobOfferToSend.user = user;
    }

    if (this.jobOffer.link) jobOfferToSend.link = this.jobOffer.link;
    if (this.jobOffer.company) jobOfferToSend.company = this.jobOffer.company;
    if (this.jobOffer.location)
      jobOfferToSend.location = this.jobOffer.location;

    if (Array.isArray(this.jobOffer.technologies)) {
      jobOfferToSend.technologies = this.jobOffer.technologies.map(
        (tech: string) => tech.trim()
      );
    } else if (typeof this.jobOffer.technologies === 'string') {
      jobOfferToSend.technologies = this.jobOffer.technologies
        .split(',')
        .map((tech: string) => tech.trim());
    }

    if (Array.isArray(this.jobOffer.skills)) {
      jobOfferToSend.skills = this.jobOffer.skills.map((skill: string) =>
        skill.trim()
      );
    } else if (typeof this.jobOffer.skills === 'string') {
      jobOfferToSend.skills = this.jobOffer.skills
        .split(',')
        .map((skill: string) => skill.trim());
    }

    if (this.jobOffer.level) jobOfferToSend.level = this.jobOffer.level;
    if (this.jobOffer.published_on)
      jobOfferToSend.published = this.jobOffer.published_on;
    if (this.jobOffer.expired) jobOfferToSend.expired = this.jobOffer.expired;
    if (this.jobOffer.visibility)
      jobOfferToSend.visibility = this.jobOffer.visibility;

    this.spinner = true;
    this.jobofferservice.insert(jobOfferToSend).subscribe(
      (response) => {
        this.router.navigate(['/client/joboffer']);
      },
      (error) => {
        console.error("Erreur lors de l'ajout de l'offre", error);
        this.spinner = false;
      }
    );
  }

  protected readonly ajoutJobOfferConstants = AjoutJobOfferConstants;
  protected readonly jobOfferConstant = JobOfferConstant;
  protected readonly CvConstants = CvConstants;

  navigateToJobOffers() {
    this.router.navigate(['/client/joboffer']);
  }

  onUrlEntered(): void {
  if (this.jobOffer.link) {
    const userString = localStorage.getItem('currentUser');
    const user = JSON.parse(userString!);
    
    const userId = user._id; // 🔁 Remplace ça dynamiquement selon ton app (auth service, etc.)
    this.jobofferservice.scrapeFromUrl(userId, this.jobOffer.link).subscribe({
      next: (response) => {
        // Remplir les champs du formulaire
        this.jobOffer.title = response.title;
        //this.jobOffer.description = response.description;
        this.jobOffer.company = response.company;
        this.jobOffer.location = response.location;
        this.jobOffer.technologies = response.technologies
        this.jobOffer.skills= response.skills
        this.jobOffer.published_on = response.published_on
        this.jobOffer.level = response.level
      },
      error: (err) => {
        console.error('Erreur scraping backend :', err);
      }
    });
  }
}
}