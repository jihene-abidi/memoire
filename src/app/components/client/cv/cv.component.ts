import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {ToastrService} from "ngx-toastr";
import {CvService} from "../../../core/services/cv.service";
import {FileService} from "../../../core/services/file.service";
import {CvConstants} from "../../client/cv/cv.constants";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {Cv} from "../../../core/models/cv";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CacheService} from "../../../core/services/cache";


@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [MatGridListModule, MatIconModule, MatCardModule, MatFormField, MatLabel, MatIconButton, MatInput, NgIf, NgForOf, MatButton, MatProgressSpinnerModule, NgClass],
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css'],
})
export class CvComponent implements OnInit {
  limit: number = 4;
  page: number = 1;
  visibility: string = "public";
  titleColNumber: number = 0;
  optionsColNumber: number = 0;
  cvsColNumber: number = 0;
  rowHeight: string = '5:1';
  isLoading = false;
  hasMoreCvs = true;
  cvConstants = CvConstants;
  cvs: Cv[] = [];
  @Input() pdfUrl!: string;
  selectedCv!: Cv;
  loadingImages: { [key: string]: boolean } = {};
  cvLoadingStates: Map<string, boolean> = new Map();




  constructor(
    private toastrService: ToastrService,
    private cvService: CvService,
    private fileService: FileService,
    private breakpointObserver: BreakpointObserver,
    private cacheService: CacheService

  ) {

    this.breakpointObserver
      .observe([
        '(max-width: 576px)',
        '(min-width: 577px) and (max-width: 768px)',
        '(min-width: 769px) and (max-width: 1024px)',
        '(min-width: 1025px)',
      ])
      .subscribe((result: BreakpointState) => {
        if (result.breakpoints['(max-width: 576px)']) {
          this.titleColNumber = 1;
          this.optionsColNumber = 1;
          this.cvsColNumber = 1;
          this.rowHeight = '3:1';
        } else if (
          result.breakpoints['(min-width: 577px) and (max-width: 768px)']
        ) {
          this.titleColNumber = 1;
          this.optionsColNumber = 2;
          this.cvsColNumber = 2;
          this.rowHeight = '5:1';
        } else if (
          result.breakpoints['(min-width: 769px) and (max-width: 1024px)']
        ) {
          this.titleColNumber = 2;
          this.optionsColNumber = 4;
          this.cvsColNumber = 3;
        } else if (result.breakpoints['(min-width: 1025px)']) {
          this.titleColNumber = 2;
          this.optionsColNumber = 4;
          this.cvsColNumber = 4;
        }
      });
  }

  ngOnInit() {
    this.refresh();
  }

  refresh(): void {
    this.isLoading = true;

    this.cvService.findAllPublic().subscribe({
      next: (cvs) => {
        // Initialize imageSrc for each CV
        cvs.forEach(cv => {
          if (cv._id) {
            this.loadingImages[cv._id] = true;
            cv.imageSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Placeholder image
          }
        });

        this.cvs = cvs;

        for (let cv of cvs) {
              this.loadPdfThumbnail(cv);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error(this.cvConstants.ERROR_RETRIEVING_CV, error);
        this.isLoading = false;
      }
    });
  }
  isCvImageLoading(cvId: string): boolean {
    return this.cvLoadingStates.get(cvId) || false;
  }
 loadPdfThumbnail(cv: Cv): void {
    if (!cv._id) {
      console.error('e');
      return;
    }

   this.cvLoadingStates.set(cv._id, true);

      this.cvService.getCvFilePath(cv._id).subscribe({
      next: (pdfData) => {
        this.getPdfThumbnail(pdfData.source, cv);
      },
      error: (err) => {
        console.error('Error retrieving PDF:', err);
        if (cv._id) {
          this.cvLoadingStates.set(cv._id, false);
        }
      },
    });
  }

  getPdfThumbnail(pdfUrl: string, cv: Cv): void {
    if (!pdfUrl || !cv._id) {
      console.error(this.cvConstants.ERROR_PDF_CV);
      return;
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/pdf.worker.min.mjs";
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    loadingTask.promise
      .then((pdf) => {
        return pdf.getPage(1);
      })
      .then((page) => {
        const scale = 2;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          console.error(this.cvConstants.FAILED_CANVAS);
          this.cvLoadingStates.set(cv._id!, false);
          return;
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderTask = page.render({
          canvasContext: context,
          viewport,
        });

        return renderTask.promise.then(() => {
          const imgUrl = canvas.toDataURL();

          const img = new Image();
          img.onload = () => {
            cv.imageSrc = imgUrl;
            this.cvLoadingStates.set(cv._id!, false);
          };
          img.src = imgUrl;
        });
      })
      .catch((error) => {
        console.error(this.cvConstants.ERROR_PDF, error);
        this.cvLoadingStates.set(cv._id!, false);
      });
  }


  loadMoreCvs(): void {
    this.cacheService.clearByPattern('/cv');
    if (!this.hasMoreCvs || this.isLoading) return;
    this.page++;
    this.isLoading = true;

    this.cvService.findAll(this.limit, this.page, "", this.visibility).subscribe({
      next: (newCvs) => {
        if (!newCvs || newCvs.length < this.limit) {
          this.hasMoreCvs = false;
        }

        this.cvs = [...this.cvs, ...newCvs];

        newCvs.forEach((cv) => {
        //   this.fileService.showFile(cv.cv_s3).subscribe({
        //     next: (pdfData) => {
        //       this.getPdfThumbnail(pdfData.source, cv);
        //     },
        //     error: (err) => {
        //       console.error(this.cvConstants.ERROR_RETRIEVING_PDF, err);
        //     }
        //   });
        });

        this.page++;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error(this.cvConstants.ERROR_RETRIEVING_CV, error);
        this.isLoading = false;
      }
    });
  }


  downloadCv(cvId: string) {
    this.cvService.downloadCv(cvId).subscribe({
      next: (file: Blob) => {
       this.openCvInNewTab(file);
      },
       error: (error) => {
         console.error(this.cvConstants.ERROR_UPLOADING_CV, error);
       },
    });
  }


  openCvInNewTab(fileUrl: Blob) {
    const blobUrl = URL.createObjectURL(fileUrl);
    window.open(blobUrl, '_blank');
  }

  private triggerDownload(url: string, fileName: string) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  showUploadToast() {
   this.toastrService.success(CvConstants.RECRUTER_UPLOAD_CV);
  }
}