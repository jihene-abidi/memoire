import { Routes } from '@angular/router';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { ChangePasswordComponent } from '../client/change-password/change-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { AccueilComponent } from './accueil/accueil.component';
import { JobOfferComponent } from './job-offer/job-offer.component';
import { CvComponent } from './cv/cv.component';
import { AjoutJobOfferComponent } from './job-offer/ajout-job-offer/ajout-job-offer.component';
import { AjoutCvComponent } from './cv/ajout-cv/ajout-cv.component';
import { UpdateJobOffreComponent } from './job-offer/update-job-offre/update-job-offre.component';
import { ModifierCvComponent } from './cv/modifier-cv/modifier-cv.component';
import { SupprimerJobOfferComponent } from './job-offer/supprimer-job-offer/supprimer-job-offer.component';
import { MyCvsComponent } from './cv/my-cvs/my-cvs.component';
import { TextChatbotComponent } from './cv/chatbot/chatbot-text/chatbot-text.component';
import { CandidatesPageComponent } from './job-offer/application/candidates-page.component';
import { PhoneDialComponent } from './job-offer/phone-dial/phone-dial.component';
import { ContactUsComponent } from './accueil/contact-us/contact-us.component';
import { ChatbotComeponent } from './cv/chatbot/chatbot';


export const ClientRouting: Routes = [
    { path: 'client-profile', component: ClientProfileComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'forget-password', component: ForgetPasswordComponent },
    { path: 'home', component: AccueilComponent },
    { path: 'joboffer', component: JobOfferComponent },
    { path: 'cv', component: CvComponent },
    { path: 'joboffer/ajout-job-offer', component: AjoutJobOfferComponent },
    { path: 'ajoutcv', component: AjoutCvComponent },
    { path: 'joboffer/update-job-offer', component: UpdateJobOffreComponent },
    { path: 'joboffer/candidates/:id', component: CandidatesPageComponent },
    { path: 'modifier-cv/:id', component: ModifierCvComponent },
    { path: 'joboffer/supp-job-offer', component: SupprimerJobOfferComponent },
    { path: 'my-cvs', component: MyCvsComponent },
    { path: 'chat/:id', component: ChatbotComeponent },
    { path: 'text-chat/:id', component: TextChatbotComponent },
    { path: 'phone-dial', component: PhoneDialComponent },
    { path: 'contact-us', component: ContactUsComponent },



  ];