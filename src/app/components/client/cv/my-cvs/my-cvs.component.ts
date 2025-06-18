import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ClientImports } from '../../client-imports';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CvConstants } from '../cv.constants';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedButtonComponent } from "../../../../shared/shared-button/shared-button.component";
import { DialogService } from "../../../../core/services/openDialog.service";
import { CvService } from "../../../../core/services/cv.service";
import { FileService } from "../../../../core/services/file.service";
import {Cv, Visibility} from "../../../../core/models/cv";
// import * as pdfjsLib from 'pdfjs-dist';
import {UserService} from "../../../../core/services/user";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import { MatTooltipModule } from '@angular/material/tooltip';
import {CacheService} from "../../../../core/services/cache";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-my-cvs',
  standalone: true,
  imports: [
    ClientImports,
    MatGridListModule,
    MatIconModule,
    MatCardModule,
    SharedButtonComponent,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './my-cvs.component.html',
  styleUrl: './my-cvs.component.css',

})
export class MyCvsComponent implements OnInit {
  @Input() displayedCvs: Cv[] = [];
  @Output() cvSelected = new EventEmitter<Cv>();
  @Input() hideAddCvButton: boolean = false;
  @Output() cvClicked = new EventEmitter<any>();
  @Input() selectedCv!: Cv | null;
  titleColNumber: number = 0;


  optionsColNumber: number = 0;
  cvsColNumber: number = 0;
  rowHeight: string = '5:1';
  cvConstants = CvConstants;
  limit :number = 4;
  page:number = 1;
  isLoading = false;
  hasMoreCvs = true;
  searchQuery: string = '';
  readonly dialog = inject(DialogService);
  cvLoadingStates: Map<string, boolean> = new Map();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cvService: CvService,
    private fileService: FileService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
   
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
    this.loadMyCvs();
  }

  openDialog(idCV: string, index: number) {
    this.dialog.openDialog('delete').subscribe((result) => {
      this.deleteCv(idCV, index);
    });
  }

  deleteCv(idCV: string, index: number) {
    this.cvService.remove(idCV).subscribe({
      next: () => {
        this.displayedCvs.splice(index, 1);
        this.toastr.success(this.cvConstants.DELETE_SUCCES);
        this.clearStorageKeysWithSubstring('cvchalice/?limit');
      },
      error: (error) => {
        this.toastr.error(this.cvConstants.DELETE_ERROR);
      },
    });
  }

  clearStorageKeysWithSubstring(substring: string) {
    const storageKeys = Object.keys(localStorage);
    storageKeys.forEach((key) => {
      if (localStorage.getItem(key)?.includes(substring)) {
        localStorage.removeItem(key);
      }
    });
    this.ngOnInit();
  }

  loadMyCvs() {
    this.isLoading = true;
    const userId = this.userService.getCurrentUser()?._id;

    this.cvService
      .findAll(this.limit, this.page, userId, '', this.searchQuery)
      .subscribe({
        next: (cvs) => {
          if (cvs.length === 0) {
          // No need to load thumbnails
          this.isLoading = false;
          return;
        }
          cvs.forEach((cv) => {
            if (cv._id) {
              this.cvLoadingStates.set(cv._id, true);

              cv.imageSrc =
                'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            }
          });

          this.displayedCvs = cvs;
          this.hasMoreCvs = cvs.length === this.limit;

          for (let cv of cvs) {
            this.loadPdfThumbnail(cv);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error(this.cvConstants.ERROR_LOADING, error);
          this.isLoading = false;
        },
      });
  }

  loadMoreCvs() {
    this.cacheService.clearByPattern('/cv');
    if (!this.hasMoreCvs || this.isLoading) return;
    this.page++;
    this.isLoading = true;

    const userId = this.userService.getCurrentUser()?._id;

    this.cvService
      .findAll(
        this.limit,
        this.page,
        userId,
        undefined,
        this.searchQuery
      )
      .subscribe({
        next: (newCvs) => {
          if (newCvs.length === 0) {
            this.hasMoreCvs = false;
          } else {
            newCvs.forEach((cv) => {
              if (cv._id) {
                this.cvLoadingStates.set(cv._id, true);
                cv.imageSrc =
                  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
              }
            });

            this.displayedCvs = [...this.displayedCvs, ...newCvs];

            for (let cv of newCvs) {
              this.loadPdfThumbnail(cv);
            }
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error(this.cvConstants.ERROR_LOADING, error);
          this.isLoading = false;
        },
      });
  }

  loadPdfThumbnail(cv: Cv): void {
    if (!cv.cv_s3 || !cv._id) {
      //console.error(this.cvConstants.ERROR_CV_S3);
      return;
    }

    this.cvLoadingStates.set(cv._id, true);

   /* this.fileService.showFile(cv.cv_s3).subscribe({
      next: (pdfData) => {
        this.getPdfThumbnail(pdfData.source, cv);
      },
      error: (err) => {
        console.error('Error retrieving PDF:', err);
        if (cv._id) {
          this.cvLoadingStates.set(cv._id, false);
        }
      },
    });*/
  }

  getPdfThumbnail(pdfUrl: string, cv: Cv): void {
    if (!pdfUrl || !cv._id) {
      console.error(this.cvConstants.ERROR_PDF_CV);
      return;
    }

   /* const loadingTask = pdfjsLib.getDocument(pdfUrl);
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
      });*/
  }

  searchCvs(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.page = 1;
    this.displayedCvs = [];
    this.loadMyCvs();
  }

  isCvImageLoading(cvId: string): boolean {
    return this.cvLoadingStates.get(cvId) || false;
  }

  protected readonly Visibility = Visibility;
  protected readonly console = console;
}