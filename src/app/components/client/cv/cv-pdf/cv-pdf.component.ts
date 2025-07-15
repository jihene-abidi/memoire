import {Component, Inject, OnInit} from '@angular/core';
import { NgForOf } from "@angular/common";
import { CvService } from "../../../../core/services/cv.service";
import html2canvas from 'html2canvas'; // Bibliothèque JS pour capturer un élément HTML sous forme d’image
import jsPDF from 'jspdf';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ClientImports} from "../../client-imports";
import {MatTooltip} from "@angular/material/tooltip";
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
  // Déclaration et initialisation des variables utilisées dans le HTML
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

  // Injection des dépendances via le constructeur
  constructor(private cvService: CvService,    @Inject(MAT_DIALOG_DATA) public data: { cvId: string },   private dialogRef: MatDialogRef<CvPdfComponent>

  ) {}
  // Méthode du cycle de vie Angular appelée au chargement du composant
  ngOnInit(): void {
    this.loadCv(); // Charger les données du CV dès le début
  }

  // Récupère les données du CV depuis le service en utilisant l'identifiant reçu
  loadCv(): void {
    this.cvService.findOne(this.data.cvId).subscribe({
      next: (cv) => {
        if (cv?.expertise?.owner) {
          this.name = cv.expertise.owner; // Récupère le nom du propriétaire du CV
        }
        if (cv?.expertise) {
          this.setExpertiseFields(cv.expertise); // Remplit les autres champs à partir de l’objet expertise
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement du CV :', err); // Gère les erreurs d’API
      }
    });
  }
  // Méthode privée pour remplir les champs avec les données de l’objet "expertise"
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

  // Génère un PDF à partir du contenu HTML du CV
  generatePDF(): void {
    const element = document.getElementById('cv-pdf'); // Sélectionne l’élément HTML contenant le CV
    if (!element) return;
    element.classList.add('cv-pdf-export'); // Ajoute une classe CSS spéciale si nécessaire pour le style

   html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png'); // Convertit l’élément en image
      const pdfWidth = 595.28; // Largeur A4 en points
      const pdfHeight = 841.89; // Hauteur A4 en points
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); // Ajoute l’image dans le PDF
      this.Pdfname = this.name + "_CV.pdf"; // Nomme le fichier
      pdf.save(this.Pdfname); // Télécharge le fichier PDF
      element.classList.remove('cv-pdf-export'); // Supprime la classe ajoutée
    }).catch((error) => {
      console.error('Erreur lors de la génération du PDF avec html2canvas :', error);
      element.classList.remove('cv-pdf-export');
    });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

}