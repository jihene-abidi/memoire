import {
  Component,
  Inject,
  OnInit,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { ReportModalConstants } from './report-modal.constants';
import { JobOfferConstant } from '../job-offer.constants';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorConstant } from '../../../../core/constants/error.constant';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFPageProxy } from 'pdfjs-dist';

import {
  MatProgressSpinner,
} from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { NgIf, NgForOf } from '@angular/common';
import { MatIconButton } from '@angular/material/button';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

export interface ReportModalData {
  candidatureId: string;
  reportUrl: string | null;
  candidatureName: string;
}

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  standalone: true,
  imports: [
    MatProgressSpinner,
    MatIcon,
    MatIconButton,
    NgIf,
    NgForOf,
  ],
  styleUrls: ['./report-modal.component.scss'],
})
export class ReportModalComponent implements OnInit {
  jobOfferConstant = JobOfferConstant;
  @ViewChildren('pdfCanvas') pdfCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;

  loading = false;
  reportUrl: string | null = null;
  reportImage: string | null = null;
  candidatureId: string;
  candidatureName: string;
  pdfPages: PDFPageProxy[] = [];

  constructor(
    public dialogRef: MatDialogRef<ReportModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReportModalData,
    private candidatureService: CandidatureService,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer
  ) {
    this.candidatureId = data.candidatureId;
    this.reportUrl = data.reportUrl;
    this.candidatureName = data.candidatureName;
  }

  ngOnInit(): void {
    if (this.candidatureId) {
      this.loadReport();
    }
  }

  private loadReport(): void {
    this.loading = true;
    this.cleanUpUrls();

   this.candidatureService.getReportpath(this.candidatureId!).subscribe({
      next: (file) => {
        if (!file) {
          this.handleReportError(new Error('File not found'));
          return;
        }
        this.fetchAndProcessFile(file);
      },
      error: (err) => {
        this.handleReportError(err);
      }
    });
  }

  private fetchAndProcessFile(file: { source: string, name?: string }): void {
    fetch(file.source)
      .then(response => response.blob())
      .then(blob => {
        if (file.name?.endsWith('.pdf') || file.source.includes('.pdf')) {
          this.processPdfFile(blob);
        } else {
          this.reportImage = URL.createObjectURL(blob);
          this.loading = false;
        }
      })
      .catch(err => {
        this.handleReportError(err);
      });
  }

  private processPdfFile(blob: Blob): void {
    pdfjsLib.getDocument({
      url: URL.createObjectURL(blob),
      standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@2.16.105/standard_fonts/',
    }).promise.then(pdf => {
      this.pdfPages = [];
      this.loadPdfPages(pdf, 1);
    }).catch(err => {
      this.handleReportError(err);
    });
  }

  private loadPdfPages(pdf: pdfjsLib.PDFDocumentProxy, pageIndex: number): void {
    if (pageIndex > pdf.numPages) {
      this.loading = false;
      setTimeout(() => this.renderAllPages(), 0);
      return;
    }

    pdf.getPage(pageIndex).then(page => {
      this.pdfPages.push(page);
      this.loadPdfPages(pdf, pageIndex + 1);
    }).catch(err => {
      this.handleReportError(err);
    });
  }

  private renderAllPages(): void {
    this.pdfCanvases.forEach((canvasRef, index) => {
      if (index >= this.pdfPages.length) return;

      const canvas = canvasRef.nativeElement;
      const context = canvas.getContext('2d');
      if (!context) return;

      const page = this.pdfPages[index];
      const viewport = page.getViewport({ scale: 1 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      page.render({
        canvasContext: context,
        viewport: viewport,
      });
    });
  }

  private handleReportError(err: Error): void {
    console.error('Error loading report', err);
    this.toastrService.error(ErrorConstant.REPORT_DOWNLOAD_FAILED);
    this.loading = false;
  }

  downloadReport(): void {
    if (!this.reportUrl) return;

  /*  this.fileService.awsFile(this.reportUrl).subscribe({
      next: (file) => {
        if (!file) return;

        const link = document.createElement('a');
        link.href = file.source;
        link.download = `Rapport_${this.candidatureName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (error) => {
        console.error('Error downloading report', error);
        this.toastrService.error(this.translate.instant(ErrorConstant.REPORT_DOWNLOAD_FAILED));
      },
    });*/
  }

  private cleanUpUrls(): void {
    if (this.reportImage) {
      URL.revokeObjectURL(this.reportImage);
      this.reportImage = null;
    }
  }

  closeModal(): void {
    this.cleanUpUrls();
    this.dialogRef.close({ reportUrl: this.reportUrl });
  }

  protected readonly ReportModalConstants = ReportModalConstants;
  protected readonly JobOfferConstant = JobOfferConstant;
}