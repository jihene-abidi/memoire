import {Component, Inject, OnInit} from '@angular/core';
import { NgForOf } from "@angular/common";
import { UserService } from "../../../../core/services/user";
import { CvService } from "../../../../core/services/cv.service";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ClientImports} from "../../client-imports";
import {MatTooltip} from "@angular/material/tooltip";
import {JobOfferConstant} from "../../job-offer/job-offer.constants";
import {Expertise} from "../../../../core/models/expertise";

interface School {
  degree: string;
  institution: string;
  year: string;
}
@Component({
  selector: 'app-cv-pdf',
  standalone: true,
  templateUrl: './cv-pdf.component.html',
  imports: [
    NgForOf,
    ClientImports,
    MatTooltip
  ],
  styleUrls: ['./cv-pdf.component.css']
})
export class CvPdfComponent implements OnInit {

  name: string = '';
  phone: string = '';
  email: string = '';
  snapshot: string = '';
  contact:string[]=[];
  hashtags: string[] = [];
  clients: string[] = [];
  languages: string[] = [];
  industries: string[] = [];
  atouts: string[] = [];
  certifications: string[] = [];
  education: School[] = [];
  Pdfname!:string;

  constructor(private cvService: CvService,     @Inject(MAT_DIALOG_DATA) public data: { cvId: string },   private dialogRef: MatDialogRef<CvPdfComponent>

  ) {}

  ngOnInit(): void {
    this.loadCv();
  }

  loadCv(): void {
    this.cvService.findOne(this.data.cvId).subscribe({
      next: (cv) => {
        if (cv?.expertise?.owner) {
          this.name = cv.expertise.owner;
        }
        if (cv?.expertise) {
          this.setExpertiseFields(cv.expertise);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement du CV :', err);
      }
    });
  }
  private setExpertiseFields(expertise: Expertise): void {
    this.phone = expertise.contact.phone_number||'';
    this.email =expertise.contact.email||'';
    this.snapshot = expertise.snapshot || '';
    this.hashtags = expertise.hashtags || [];
    this.languages = expertise.languages || [];
    this.atouts = expertise.atouts || [];
    this.certifications = expertise.certifications || [];
    this.education = expertise.education || [];
  }

  generatePDF(): void {
    const element = document.getElementById('cv-pdf');
    if (!element) return;
    element.classList.add('cv-pdf-export');
   html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 595.28;
      const pdfHeight = 841.89;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      this.Pdfname = this.name + "_CV.pdf";
      pdf.save(this.Pdfname);
      element.classList.remove('cv-pdf-export');
    }).catch((error) => {
      console.error('Erreur lors de la génération du PDF avec html2canvas :', error);
      element.classList.remove('cv-pdf-export');
    });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

}