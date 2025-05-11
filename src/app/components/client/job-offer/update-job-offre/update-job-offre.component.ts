import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { AjoutJobOfferConstants } from '../ajout-job-offer/ajout-job-offer.constants';
import { MatInput } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { ClientImports } from '../../client-imports';
import { JobOfferService } from '../../../../core/services/JobOfferService';
import { ActivatedRoute } from '@angular/router';
import { JobOffer } from '../../../../core/models/jobOffer';
import { from } from 'rxjs';
import { JobOfferConstant } from '../job-offer.constants';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { CacheService } from '../../../../core/services/cache';

@Component({
  selector: 'app-update-job-offre',
  standalone: true,
  imports: [
    ClientImports,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
  ],
  providers: [DatePipe],
  templateUrl: './update-job-offre.component.html',
  styleUrl: './update-job-offre.component.css',
})
export class UpdateJobOffreComponent {
  jobOfferId!: string;
  jobOffer: JobOffer | null = null;
  isEditing = false;
  title: string = '';
  company?: string = '';
  location?: string[] = [];
  templateType: string = 'template2';
  origin: string = '';
  formattedDate: Date | null = null;
  technologies: string | string[] = [];
  skills: string | string[] = [];
  visibility: string = '';
  level: string = '';
  expired: string = '';
  offerDate: string | Date = '';

  levels: string[] = [
    AjoutJobOfferConstants.JUNIOR_LEVEL,
    AjoutJobOfferConstants.SENIOR_LEVEL,
  ];

  constructor(
    private toastrService: ToastrService,
    private joboffrerservice: JobOfferService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private cacheService: CacheService
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.jobOfferId = params['id'];
    });

    from(this.joboffrerservice.findOne(this.jobOfferId)).subscribe(
      (offer: JobOffer) => {
        this.jobOffer = offer;
        this.title = offer.title;
        this.getJobOfferDetails(offer);

        if (this.jobOffer.link) {
          this.templateType = 'template1';
        } else {
          this.templateType = 'template2';
        }
      },
      (error: any) => {
        this.toastrService.error(
          //this.translate.instant(JobOfferConstant.FAILED_LOAD_JOB_OFFER)
        );
      }
    );
  }
  getJobOfferDetails(offer: JobOffer) {
    this.location = offer.location ?? [];
    this.skills = Array.isArray(offer.skills)
      ? offer.skills
      : offer.skills?.split(',') || [];
    this.technologies = Array.isArray(offer.technologies)
      ? offer.technologies
      : offer.technologies?.split(',') || [];

    this.visibility = offer.visibility || 'public';
    this.level = offer.level || offer.level || '';
    this.company = offer.company || offer.company || '';
    this.offerDate = offer.date || offer.published || '';
    this.formattedDate = new Date(this.offerDate);
  }

  updateOffre() {
    if (!this.title || this.title.trim() === '') {
      this.cacheService.clearByPattern('/offre');
      this.toastrService.error(
       // this.translate.instant(AjoutJobOfferConstants.UPDATE_ERROR_TOAST)
      );
      return;
    }

    this.technologies = Array.isArray(this.technologies)
      ? this.technologies
      : this.technologies.split(',').map((item: string) => item.trim());
    this.skills = Array.isArray(this.skills)
      ? this.skills
      : this.skills.split(',').map((item: string) => item.trim());

    if (this.jobOffer) {
      const updateData: Partial<JobOffer> = { title: this.title };
      if (this.jobOffer.link) {
        this.joboffrerservice.patch(this.jobOffer._id, updateData).subscribe(
          () => {
            this.toastrService.success(
              //this.translate.instant
              (
                AjoutJobOfferConstants.UPDATE_SUCCESS_TOAST
              )
            );
            this.router.navigate(['/client/joboffer']);
          },
          (error: any) => {
            console.error('Error updating job offer:', error);
            this.toastrService.error(
             // this.translate.instant(JobOfferConstant.FAILED_LOAD_JOB_OFFER)
            );
          }
        );
      } else if (!this.jobOffer.link) {
        const fullJobOfferData: JobOffer = {
          ...this.jobOffer,
          title: this.title,
          published: this.formattedDate?.toString(),
          location: this.location,
          skills: this.skills,
          technologies: this.technologies,
          visibility: this.visibility,
          level: this.level,
          company: this.company,
          expired: this.expired,
        };
        this.joboffrerservice.update(fullJobOfferData).subscribe(
          () => {
            this.toastrService.success(
              //this.translate.instant
              (
                AjoutJobOfferConstants.UPDATE_SUCCESS_TOAST
              )
            );
            this.router.navigate(['/client/joboffer']);
          },
          (error: any) => {
            console.error('Error updating job offer:', error);
            this.toastrService.error(
              //this.translate.instant(JobOfferConstant.FAILED_LOAD_JOB_OFFER)
            );
          }
        );
      }
    }
  }

  protected readonly AjoutJobOfferConstants = AjoutJobOfferConstants;
}
