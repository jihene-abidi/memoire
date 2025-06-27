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
// import { ConfirmationDialogComponent } from './confirm-dialog-offre/confirmation-dialog.component';
// import { SelectCvDialogComponent } from './select-cv-dialog/select-cv-dialog.component';
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
    userCandidatures: Candidature[] = [];
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
        this.JobOfferService.findAll().then((data: JobOffer[]) => {
          this.allOffers = data.map((offer) => {
            if (offer.user?._id== this.currentUser?._id) {
            /*  this.CandidatureService.getAllCandidatures(
                this.limite,
                this.pages
                ,offer._id
              ).subscribe(
                (candidatures: Candidature[]) => {
                  this.userCandidatures = candidatures;
                },
              );*/
            }else{
              console.warn(this.jobOfferConstant.NO_CANDIDATES)
            }
    
            const origin = this.getOrigin(offer.link);
            const offerDate = offer.published_on || '';
            const offerDateFormatted = this.datePipe.transform(
              offerDate,
              'yyyy-MM-dd'
            )!;
            const location = offer.location || '';
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
            (offer) => offer.visibility === this.selectedFilter
          );
        }
      }
      
      showJobForCandidature(): void {
        this.cacheService.clearByPattern('/candidature');
       /* this.CandidatureService.getAllCandidatures(this.limite, this.pageCandidature, this.currentUser?._id)
          .pipe(
            map(candidatures => candidatures.filter(c => c.job.id)),

            switchMap(candidatures => {
              if (candidatures.length === 0) {
                this.hasMoreData = false;
                this.isLoadingMore = false;
                return of([]);
              }

              const jobIds = candidatures.map(c => c.job.id);
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
            this.applySearchFilter();
            this.isLoadingMore = false;
          });*/
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
          (candidature) => candidature.job && candidature.job._id === jobId
        );
      }
    
      applyToJob(offer: JobOffer & { _id?: string }) {
        if (this.hasAppliedToJob(offer._id)) {
         /* this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: {
              message: this.translate.instant(this.jobOfferConstant.ALREADY_APPLIED) ,
              isError: true,
            },
          });*/
          return;
        }
    /*
        const dialogRef = this.dialog.open(SelectCvDialogComponent, {
          width: '1400px',
          data: { cvs: this.currentCvs },
        });*/
    /*
        dialogRef.afterClosed().subscribe((selectedCv: Cv) => {
          if (selectedCv) {
            const candidature: Candidature = {
              cv: selectedCv,
              job: offer,
              user: this.currentUser,
            };
    
            this.CandidatureService.applyToJob(candidature).subscribe(
              (response) => {
                this.userCandidatures.push(response.candidature);
                this.dialog.open(ConfirmationDialogComponent, {
                  width: '400px',
                  data: {
                    identifier: response.candidature.identifier,
                  },
                });
              },
              (error) => console.error(ErrorConstant.ERROR_SEND, error)
            );
          }
        });*/
      }
    
    
    
      openSelectDialog(offer: JobOffer & { _id?: string }) {
        if (!offer._id) {
          console.error('Job ID not found');
          return;
        }
    
        this.router.navigate(['/client/joboffer/candidates', offer._id]);
      }
    
      getPdfThumbnail(pdfUrl: string, cv: Cv): void {
        /*
        if (!pdfUrl) {
          console.error(this.translate.instant(this.cvConstants.ERROR_INVALID_PDFURL));
          return;
        }
    
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        loadingTask.promise
          .then((pdf) => pdf.getPage(1))
          .then((page) => {
            const scale = 2;
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) {
              console.error(this.translate.instant(this.cvConstants.ERROR_FAILED_CANVAS));
              return;
            }
    
            canvas.width = viewport.width;
            canvas.height = viewport.height;
    
            return page
              .render({ canvasContext: context, viewport })
              .promise.then(() => {
                cv.imageSrc = canvas.toDataURL();
              });
          })
          .catch((error) => {
            console.error(this.translate.instant(this.cvConstants.ERROR_INVALID_FORMAT), error);
          });*/
      }
      showApplicationDetails(offer: JobOffer & { _id?: string }) {
      /*  if (!offer._id) return;
    
        const candidature = this.getCandidatureInfo(offer._id);
    
        if (candidature) {
          this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: {
              identifier: candidature.identifier,
              isDetails: true,
            },
          });
        }*/
      }
    
      getCandidatureInfo(jobId: string): Candidature | undefined {
        if (!this.userCandidatures || !jobId) {
          return undefined;
        }
    
        return this.userCandidatures.find(
          (candidature) => candidature.job && candidature.job._id === jobId
        );
      }
    
      private shouldUseTemplate1(): boolean {
        return true;
      }
    
    }
    