import { Component, OnInit } from '@angular/core';
import { ClientImports } from '../client-imports';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { JobOfferConstant } from './job-offer.constants';
import {ToastrService} from "ngx-toastr";
import { MatDialog } from '@angular/material/dialog';
import { JobOfferService } from '../../../core/services/JobOfferService';
import { JobOffer } from '../../../core/models/jobOffer';
import { SharedButtonComponent } from '../../../shared/shared-button/shared-button.component';
import { DialogService } from '../../../core/services/openDialog.service';
// import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { ConfirmationDialogComponent } from './confirm-dialog-offre/confirmation-dialog.component';
import { SelectCvDialogComponent } from './select-cv-dialog/select-cv-dialog.component';
 import { Candidature } from '../../../core/models/candidature';
import { CandidatureService } from '../../../core/services/candidature.service';
import { Cv } from '../../../core/models/cv';
import { UserModel } from '../../../core/models/user';
import { ErrorConstant } from '../../../core/constants/error.constant';
import { UserService } from '../../../core/services/user';
//import { CvService } from '../../../core/services/cv.service';
//import { ApplicationComponent } from './application/application.component';
//import { CvConstants } from '../cv/cv.constants';
//import { FileService } from '../../../core/services/file.service';
//import * as pdfjsLib from 'pdfjs-dist';
import { CacheService } from '../../../core/services/cache';
import { JobOfferApi } from '../../../core/api/JobOfferApi';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { log } from 'console';
import { DatePipe } from '@angular/common';
import {map} from "rxjs/operators";
import {catchError, finalize, forkJoin, of, retry, switchMap} from 'rxjs';

@Component({
    selector: 'app-job-offer',
    standalone: true,
    imports: [
      ClientImports,
      MatTooltipModule,
      MatChipsModule,
      MatGridListModule,
      SharedButtonComponent,
      MatMenuModule,
      MatIconModule,
      MatButtonModule,
    ],
    providers: [DatePipe],
    templateUrl: './job-offer.component.html',
    styleUrls: ['./job-offer.component.css'],
  })
  export class JobOfferComponent implements OnInit {
    constructor(
     // private CvService: CvService,
      private UserService: UserService,
      private CandidatureService: CandidatureService,
      private dialog: MatDialog,
      private JobOfferService: JobOfferService,
      private dialogService: DialogService,
      private jobOfferservice: JobOfferService,
      private router: Router,
      private datePipe: DatePipe,
      private cacheService: CacheService,
      private toastrService: ToastrService
  
  
    ) {}
    jobOfferConstant = JobOfferConstant;
    Offers: any[] = [];
    allOffers: any[] = [];
    selectedFilter: string = 'all';
    currentCvs!: Cv[];
    currentUser: UserModel | null = null; 
    userCandidatures: any[] = [];
    visibility!: string;
   // cvConstants = CvConstants;
    limite: number=100;
    pages: number=1;
    pageCandidature:number=1;
    isLoadingCandidatures: boolean = false;

    ngOnInit() {
      this.currentUser = this.UserService.getCurrentUser()!;
  
      this.refresh();
    }
    async refresh() {
        this.JobOfferService.findAll().then((data: any[]) => {
          this.allOffers = data.map((offer) => {
               this.CandidatureService.getAllCandidaturesByOffer(offer._id).subscribe(
                (candidatures: any[]) => {
                  this.userCandidatures.push(...candidatures);
                },
              );
    
            const origin = this.getOrigin(offer.link);
            const offerDate = offer.published_on || '';
            const startDate = offer.start_date || '';
            const offerDateFormatted = this.datePipe.transform(
              offerDate,
              'yyyy-MM-dd'
            )!;
            const startDateFormatted = this.datePipe.transform(
              startDate,
              'yyyy-MM-dd'
            )!;
            const location = offer.location || '';
            const description = offer.job_description || '';
            const salaire = offer.salary || '';
            const start_date = offer.start_date || '';
            const level = offer.level|| '';
            const skills = offer.skills || [];
            const technologies =  offer.technologies || [];
            const visibility = offer.visibility || 'public';
            const company = offer.company || offer.company || '';
            const expired = offer.start_date || '';
    
            return {
              ...offer,
              level,
              location,
              skills,
              technologies,
              origin: origin.name,
              logo:
                origin.logo || origin.logo || 'assets/default.png',
              offerDate,
              offerDateFormatted,
              visibility,
              company,
              expired,
              start_date,
              startDateFormatted,
              description,
              salaire
            };
          });
    
          if (this.currentUser && this.currentUser._id) {
            const clientId = this.currentUser._id;
    
           /* this.CvService.findAll(undefined, undefined, clientId).subscribe(
              (cvs: Cv[]) => {
                this.currentCvs = cvs;
              }
            );*/
          } else {
            console.warn(ErrorConstant.USER_NOT_FOUND_WARNING);
          }
          this.applyFilter();
        });
      }
      applyFilter() {
        if (this.selectedFilter === 'applied') {
          this.showJobForCandidature();
          return;
        }
        else if (this.selectedFilter === 'all') {
          this.Offers = this.allOffers;
        } else {
          this.Offers = this.allOffers.filter(
            (offer) => offer.created_by.$oid === this.currentUser?._id
          );
        }
      }
       private transformOffer(offer: any): any {
    const sanitizedDetails = offer.details
      ? offer.details.replace(/```/g, '').trim()
      : '';
    let details: any = {};
    try {
      details = JSON.parse(sanitizedDetails);
    } catch (error) {}

    const origin = this.getOrigin(offer.link);
    const offerDate = details.offerDate || offer.published_on || offer.createdAt || '';
    const offerDateFormatted = this.datePipe.transform(offerDate, 'yyyy-MM-dd')!;
    const location = details.jobAdress || offer.location || '';
    const start_date = offer.start_date || '';
    const startDateFormatted = this.datePipe.transform(start_date, 'yyyy-MM-dd')!;
    const description = offer.job_description || '';
    const skills = offer.skills
      ? typeof offer.skills === 'string'
        ? offer.skills.split(',')
        : Array.isArray(offer.skills)
          ? offer.skills
          : []
      : offer.skills || [];
    const technologies = offer.technologies
      ? typeof offer.technologies === 'string'
        ? offer.technologies.split(',')
        : Array.isArray(offer.technologies)
          ? offer.technologies
          : []
      : offer.technologies || [];
    const visibility = offer.visibility || 'public';
    const level = details.level || offer.level || '';
    const company = details.companyName || offer.company || '';
    const expired = details.offerDate || offer.expired || '';

    return {
      ...offer,
      location,
      skills,
      technologies,
      origin: origin?.name,
      logo: origin?.logo || 'assets/joboffericons/default.png',
      offerDate,
      offerDateFormatted,
      start_date,
      startDateFormatted,
      visibility,
      company,
      expired,
      description
    };
  }

      showJobForCandidature(): void {
        this.cacheService.clearByPattern('/candidature');
      this.CandidatureService.getAllCandidatures(this.currentUser?._id)
          .pipe(
            map(candidatures => candidatures.filter(c => c.job_id)),

            switchMap(candidatures => {
              if (candidatures.length === 0) {
             //   this.hasMoreData = false;
              //  this.isLoadingMore = false;
                return of([]);
              }

              const jobIds = candidatures.map(c => c.job_id);
              return forkJoin(
                jobIds
                  .filter((id): id is string => !!id)
                  .map(id => this.JobOfferService.findOne(id))
              );
            }),
            map(offers => offers.map(offer => this.transformOffer(offer))),
            catchError(err => {
              console.error(err);
              return of([]);
            })
          )
          .subscribe(newOffers => {
            this.allOffers = [...newOffers];
            this.Offers = this.allOffers;
          //  this.applySearchFilter();
           // this.isLoadingMore = false;
          });
      }

      getOrigin(link: string | undefined) {
        if (!link) {
          return { name: 'Unknown', logo: 'assets/joboffericons/default.png' };
        }
    
        if (link.includes('linkedin.com')) {
          return { name: 'LinkedIn', logo: 'assets/joboffericons/linkedin.svg' };
        } else if (link.includes('welcometothejungle.com')) {
          return {
            name: this.jobOfferConstant.WELCOME_TO_THE_JUNGLE,
            logo: 'assets/joboffericons/wlcj.png',
          };
        } else if (link.includes('free-work.com')) {
          return { name: 'Free Work', logo: 'assets/joboffericons/free-work.png' };
        } else {
          return { name: 'Other', logo: 'assets/joboffericons/default.png' };
        }
      }
      openDialog(actionType: 'delete' | 'update' | 'custom', jobOfferId?: string) {
        this.dialogService.openDialog(actionType).subscribe(async (result) => {
          if (result) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (actionType === 'delete' && jobOfferId) {
              const targetOffer = await this.jobOfferservice.findOne(jobOfferId);
              const isOwner = targetOffer.created_by?.$oid === currentUser._id;
              if (isOwner) {
                this.deleteItem(jobOfferId);
              } else {
                this.toastrService.error(this.jobOfferConstant.DELETE_UNAUTHORIZED);
    
                return;
              }
              this.router.navigate(['/client/joboffer']);
            } else if (actionType === 'update' && jobOfferId) {
              const targetOffer = await this.jobOfferservice.findOne(jobOfferId);
              const isOwner = targetOffer.created_by?.$oid === currentUser._id;
              if (isOwner) {
                this.updateItem(jobOfferId);
              } else {
                this.toastrService.error(this.jobOfferConstant.UPDATE_UNAUTHORIZED);
                return;
              }
    
            } else if (actionType === 'custom') {
              this.customAction();
            }
          } else {
            console.log(`${actionType} canceled`);
          }
        });
      }
      private deleteItem(jobOfferId: string) {
        this.cacheService.clearByPattern('/offre');
    
        this.jobOfferservice.remove(jobOfferId).subscribe({
          next: () => {
            this.refresh();
          },
          error: (err: any) => console.error('Error deleting job offer:', err),
        });
      }
    
      protected updateItem(jobOfferId: string) {
         this.cacheService.clearByPattern('/offre');
        this.router.navigate(['/client/joboffer/update-job-offer'], {
          queryParams: {
            id: jobOfferId,
          },
        });
      }
      private customAction() {
        console.log('Custom action performed');
      }
    
      hasAppliedToJob(jobId: string): boolean {
        if (!this.userCandidatures || !jobId) {
          return false;
        }
        return this.userCandidatures.some(
          (candidature) => candidature.job_id === jobId
        );
      }
    
      applyToJob(offer: JobOffer & { _id?: string }) {
        if (this.hasAppliedToJob(offer._id)) {
          this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: {
              message: this.jobOfferConstant.ALREADY_APPLIED ,
              isError: true,
            },
          });
          return;
        }
 
        
        const dialogRef = this.dialog.open(SelectCvDialogComponent, {
          width: '1400px',
          data: { cvs: this.currentCvs },
        });
    
        dialogRef.afterClosed().subscribe((result: { selectedCv: Cv, interviewType?: string }) => {
          if (result.selectedCv) {
            const candidature = {
              cv_id: result.selectedCv._id,
              job_id: offer._id,
              candidate_id: this.currentUser!._id,
            };
            this.CandidatureService.applyToJob(candidature).subscribe(
              async (response) => {
                this.userCandidatures.push(response.candidature);
                if (result.interviewType === 'text') {
                  await this.router.navigate(['/client/text-chat',response.candidature._id]);
                } else if (result.interviewType === 'call') {
                  this.dialog.open(ConfirmationDialogComponent, {
                    width: '400px',
                    data: {
                      identifier: response.candidature.application_code,
                    },
                  });
                }
              },
              (error) => console.error(ErrorConstant.ERROR_SEND, error)
            );
          }
        });
      }
    
    
    
      openSelectDialog(offer: JobOffer & { _id?: string }) {
        if (!offer._id) {
          console.error('Job ID not found');
          return;
        }
    
        this.router.navigate(['/client/joboffer/candidates', offer._id]);
      }
  
      showApplicationDetails(offer: JobOffer & { _id?: string }) {
      if (!offer._id) return;
    
        const candidature = this.getCandidatureInfo(offer._id);
    
        if (candidature) {
          this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: {
              identifier: candidature.application_code,
              isDetails: true,
            },
          });
        }
      }
    
      getCandidatureInfo(jobId: string): Candidature | undefined {
        if (!this.userCandidatures || !jobId) {
          return undefined;
        }
    
        return this.userCandidatures.find(
          (candidature) => candidature.job_id === jobId
        );
      }
    
      private shouldUseTemplate1(): boolean {
        return true;
      }
    
    }
    