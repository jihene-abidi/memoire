import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientImports } from '../../client-imports';
import { Cv, Visibility } from '../../../../core/models/cv';
import { FileService } from '../../../../core/services/file.service';
import { SharedButtonComponent } from '../../../../shared/shared-button/shared-button.component';
import { Candidature } from '../../../../core/models/candidature';
import { UserModel } from '../../../../core/models/user';
import { JobOfferConstant } from '../job-offer.constants';
import { ToastrService } from "ngx-toastr";
import { CandidatureService } from '../../../../core/services/candidature.service';
import { UserService } from '../../../../core/services/user';
import { CvService } from '../../../../core/services/cv.service';
import { JobOfferService } from '../../../../core/services/JobOfferService';
import { JobOffer } from '../../../../core/models/jobOffer';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CvConstants } from '../../cv/cv.constants';
import * as pdfjsLib from 'pdfjs-dist';

import { HttpClient } from '@angular/common/http';
import {CacheService} from "../../../../core/services/cache";
import { ErrorConstant } from '../../../../core/constants/error.constant';
import {ReportModalComponent} from "../report-modal/report-modal.component";
import { ReportService } from '../../../../core/services/report.service';


import {MatDialog} from '@angular/material/dialog';
import {CvPdfComponent} from "../../cv/cv-pdf/cv-pdf.component";


@Component({
  selector: 'app-candidates-page',
  standalone: true,
  imports: [ClientImports, SharedButtonComponent, MatTooltipModule],
  templateUrl: './candidates-page.component.html',
  styleUrls: ['./candidates-page.component.css']
})
export class CandidatesPageComponent implements OnInit {
  allCandidatures: any[] = [];
  displayedCandidatures: any[] = [];
  loading: boolean = true;
  Visibility = Visibility;
  currentUser!: UserModel;
  jobOfferConstant = JobOfferConstant;
  jobOfferId: string | null = null;
  jobOffer: JobOffer | null = null;
  itemsPerPage: number = 4;
  currentPage: number = 1;
  cvConstants = CvConstants;
  limite: number=100;
  pages: number=1;
  showPopup = false;
  currentImageUrl = '';
  imageUrl = '../../../../../assets/reportExemple2.png';
  imageURL2:string='../../../../../assets/reportExemple1.png';
  cv: any;


  showReportModal = false;
  selectedCandidateId?: string;
  selectedReportUrl = '';
  generatingReport = false;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private toastrService: ToastrService,
    private candidatureService: CandidatureService,
    private userService: UserService,
    private cvService: CvService,
    private jobOfferService: JobOfferService,
    private cacheService: CacheService,
    private dialog: MatDialog,

    private http: HttpClient,
    private ReportService:ReportService



  ) {}

  ngOnInit(): void {
    this.cacheService.clearByPattern('/candidature');
    this.currentUser = this.userService.getCurrentUser()!;
    this.jobOfferId = this.route.snapshot.paramMap.get('id');

    if (!this.jobOfferId) {
      this.toastrService.error('Job offer ID is missing');
      this.router.navigate(['/client/joboffer']);
      return;
    }

    this.loadJobOffer();

    this.loadCandidatures();
  }

  loadJobOffer(): void {
    if (!this.jobOfferId) return;

    this.jobOfferService.findOne(this.jobOfferId)
      .then((jobOffer: JobOffer) => {
        this.jobOffer = jobOffer;
      })
      .catch((error: any) => {
        console.error('Error fetching job offer:', error);
        this.toastrService.error(ErrorConstant.FAILED_JOB_LOAD);
      });
  }

  loadCandidatures(): void {
    if (!this.jobOfferId || !this.currentUser._id) return;

    this.candidatureService.getAllCandidaturesByOffer(this.jobOfferId)
      .subscribe({
        next: (candidatures: Candidature[]) => {
          const cvIds = candidatures.map(candidature => candidature.cv_id).filter(id => !!id);
          this.cvService.findAll(undefined, undefined, this.currentUser._id)
            .subscribe({
              next: (allCvs: Cv[]) => {
                candidatures.forEach(candidature => {
                  const matchingCv = allCvs.find(cv => cv?._id == candidature.cv_id);
                  if (matchingCv) {
                    candidature.cv_id = matchingCv._id;
                  }
                });

                this.allCandidatures = candidatures.map(candidature => ({
                  ...candidature,
                  loading: true,
                  generatingReport: false

                }));

                this.updateDisplayedCandidatures();

                this.allCandidatures.forEach(candidature => {
                  if (candidature.cv_id) {
                    this.cvService.getCvFilePath(candidature.cv_id).subscribe({
                      next: (pdfData) => {
                        this.getPdfThumbnail(pdfData.source, candidature.cv_id);
                      },
                      error: (err) => {
                        console.error(this.cvConstants.ERROR_RETRIEVING_PDF, err);
                      }
                    });
                  } else {
                    console.error('Missing cv or cv_s3 for candidature:', candidature);
                  }
                });

                setTimeout(() => {
                  this.loading = false;
                }, 1000);
              },
              error: (err) => console.error('Error fetching CVs:', err)
            });
        },
        error: (err) => console.error('Error fetching candidatures:', err)
      });
  }

  updateDisplayedCandidatures(): void {
    const startIndex = 0;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.displayedCandidatures = this.allCandidatures.slice(startIndex, endIndex);
  }
  getScoreClass(score: number): string {
    if (score < 50) {
      return 'low';
    } else if (score < 75) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  loadMore(): void {
    if (this.displayedCandidatures.length < this.allCandidatures.length) {
      this.currentPage++;
      this.updateDisplayedCandidatures();
    }
  }

  hasMoreCandidatures(): boolean {
    return this.displayedCandidatures.length < this.allCandidatures.length;
  }

  getPdfThumbnail(pdfUrl: string, cv: Cv): void {
    if (!pdfUrl) {
      console.error(this.cvConstants.ERROR_INVALID_PDFURL);
      return;
    }
    this.cvService.findOne(cv).subscribe({
      next: (response) => {
        this.cv = response;
      },
      error: (err) => {
        console.error(this.cvConstants.ERROR_RETRIEVING_PDF, err);
      }
    });
    pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/pdf.worker.min.mjs";
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    loadingTask.promise
      .then((pdf) => pdf.getPage(1))
      .then((page) => {
        const scale = 2;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          console.error(this.cvConstants.ERROR_FAILED_CANVAS);
          return;
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        return page.render({ canvasContext: context, viewport }).promise.then(() => {
          this.cv.imageSrc = canvas.toDataURL();
        });
      })
      .catch((error) => {
        console.error(this.cvConstants.ERROR_INVALID_FORMAT, error);
      });
  }

  downloadCv(candidature: Candidature) {
    const cvId = candidature.cv_id;
    if (!cvId) {
      console.error('CV file path is missing.');
      return;
    }
      this.cvService.getCvFilePath(cvId).subscribe({
      next: (file) => {
        this.triggerDownload(file.source, file.name);
      },
      error: (error) => {
        console.error('Error downloading CV:', error);
      },
    });
    
  }


  generateReport(candidature: any): void {
    if (candidature.report_file_id || candidature.report_s3 || candidature.generatingReport) {
      return;
    }
    candidature.generatingReport = true;
    this.ReportService.downloadReport(candidature._id).subscribe({
      next: (response) => {
        candidature.generatingReport = false;
        if (!response) {
          this.toastrService.error(ErrorConstant.REPORT_LINK_NOT_FOUND);
          return;
        }

        candidature.report_s3 = response.message;
        this.toastrService.success(JobOfferConstant.GENERATE_REPORT_SUCCESS);
        
      this.candidatureService.getCandidatureById(candidature.candidate_id).subscribe({
        next: (res) => {
          res.forEach((resp: any) => {
             if(candidature._id === resp._id) {
              this.viewReport(resp);
          }
          });
         
          
        },
        error: (error) => {
          console.error('Error downloading report:', error);
        },
      });  
      },
      error: (error) => {
        candidature.generatingReport = false;
      const errorMessage = ErrorConstant.REPORT_GENERATION_FAILED;
       this.toastrService.error(errorMessage);
      }
    });
  }


  viewReport(candidature: Candidature): void {
    if (!candidature.report_path) {
      return;
    }
    this.dialog.open(ReportModalComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: {
        candidatureId: candidature._id,
        reportUrl: candidature.report_path,
        candidatureName: candidature.cv?.title
      },
      panelClass: 'report-modal-dialog'
    });
  }

  downloadAudio(candidature: any) {
    if (!candidature.audio_S3) {
      this.toastrService.error(ErrorConstant.CANDIDATE_NOT_PASSED_YET);
      return;
    }
/*
    this.fileService.awsFile(candidature.audio_S3).subscribe({
      next: (file) => {
        this.triggerDownload(file.source, file.name);
      },
      error: (error) => {
        console.error('Error downloading report:', error);
      },
    });  */
    }

  private triggerDownload(url: string, fileName: string) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onImageLoad(candidature: any) {
    candidature.loading = false;
  }

  navigateBack(): void {
    this.router.navigate(['/client/joboffer']);
  }




  downloadImage() {
    const link = document.createElement('a');
    link.href = this.currentImageUrl;
    link.download = this.currentImageUrl.split('/').pop() || 'rapport.png';
    link.click();
  }
  openImagePopup(imageUrl: string) {
    this.currentImageUrl = imageUrl;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.currentImageUrl = '';
  }
  openReportModal(candidature: Candidature): void {
    this.selectedCandidateId = candidature.identifier;
    this.selectedReportUrl = candidature.report_s3 || '';
    this.showReportModal = true;
  }


  closeReportModal() {
    this.showReportModal = false;
    this.selectedCandidateId = '';
    this.selectedReportUrl = '';
  }
  openCvPreview(cvId: string) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let dialogWidth = '70vw';
    let dialogHeight = 'calc(60vw * 1.50)';
    let panelClass = 'cv-preview-dialog';
    const maxDialogRatio = 1.5;

    const isMobile = screenWidth <= 768;
    const isPortrait = screenHeight > screenWidth;

    if (isMobile) {
      if (isPortrait) {
        dialogWidth = '95vw';
        dialogHeight = 'calc(60vw * 1.50)';
        panelClass = 'mobile-portrait-dialog';
      } else {
        dialogWidth = '90vw';
        dialogHeight = 'calc(60vw * 1.50)';
        panelClass = 'mobile-landscape-dialog';
      }
    }

    const calculatedHeight = parseFloat(dialogHeight);
    const calculatedWidth = parseFloat(dialogWidth);

    if (calculatedHeight > screenHeight * 0.9) {
      dialogHeight = '90vh';
    }

    if (calculatedWidth > screenWidth * 0.95) {
      dialogWidth = '95vw';
    }

    this.dialog.open(CvPdfComponent, {
      width: dialogWidth,
      height: dialogHeight,
      maxWidth: isMobile ? '100vw' : '80vw',
      maxHeight: '90vh',
      panelClass: panelClass,
      data: { cvId },
      autoFocus: !isMobile,
      restoreFocus: true,
      disableClose: false,
      backdropClass: isMobile ? 'mobile-dialog-backdrop' : ''
    });
  }


}