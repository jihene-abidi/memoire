import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClientImports } from '../../client-imports';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormControl } from '@angular/forms';
import { ChatConstants } from '../cv.constants';
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { InteractionCVService } from '../../../../core/services/interaction-cv.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserModel } from '../../../../core/models/user';
import { UserService } from '../../../../core/services/user';
import { CvService } from '../../../../core/services/cv.service';
import { Cv } from '../../../../core/models/cv';

// Définitions des interfaces pour les messages et données de chat
interface ChatMessage { type: string; content: string; }
interface ChatData { title: string; chat_history: ChatMessage[]; favorite: boolean; }



@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [ClientImports, MatSidenavModule, MatTab, MatTabGroup],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css'],
})
export class ChatbotComeponent implements OnInit, OnDestroy {
  messageControl = new FormControl(''); // Contrôle du champ de saisie du message
  constants = ChatConstants;
  isLeftSidebarOpen = window.innerWidth > 850; // Affiche/sidebar selon largeur
  isRightSidebarOpen = window.innerWidth > 850;
  showChatNames = true;          // Indique si les titres de chat sont visibles
  chats: ChatData[] = [];       // Historique complet des discussions
  cv_id = '';                  // ID de CV passé dans l’URL
  id = '';
  CV_interaction: any[] = [];  // Interactions liées au CV depuis API
  currentChat: string[] = [];  // Messages actuels affichés dans le chat
  title = '';                 // Titre du chat en cours
  currentUser!: UserModel;    // Utilisateur connecté
  cv!: Cv;                    // CV chargé
  titre = "History";         // Titre du composant
  limit = 10;
  page = 1;
  selectedChat = 0;         // Chat sélectionné par l’utilisateur
  isSendingMessage = false; // Indique si une requête est en cours
  private subscriptions: Subscription[] = [];
  private refreshInterval?: number;
  private pageReloadInterval?: number;

  @ViewChild('userMsg') userMsgElement!: ElementRef; // Référence DOM pour le champ texte

  constructor(
    public cvIntercationService: InteractionCVService, // Service d’interaction chat/CV
    private route: ActivatedRoute,                     // Pour lire params dans l’URL
    private UserService: UserService,                  // Service utilisateur
    private cvChaliceService: CvService,               // Service pour récupérer le CV

  ) {}

  ngOnInit(): void {
    // Récupère l’utilisateur courant
    this.currentUser = this.UserService.getCurrentUser()!;
    // Récupère l’ID du CV depuis l’URL, puis charge le CV ou initie un nouveau chat
    this.route.paramMap.subscribe(params => {
      this.cv_id = params.get("id") ?? '';

      if (this.cv_id) {
        this.cvChaliceService.findOne(this.cv_id).subscribe(
          (cvData: Cv) => {
            this.cv = cvData;
            this.newChat();
          },
          (error) => {
            console.error("Error loading CV:", error);
          }
        );
      } else {
        this.newChat();
      }
    });

    // Scroll automatique vers le bas après 500 ms
    setTimeout(() => this.scrollToBottom(), 500);

  
    
  }



  ngOnDestroy(): void {
    // Nettoie les abonnements et timers à la destruction du composant
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.refreshInterval) window.clearInterval(this.refreshInterval);
    if (this.pageReloadInterval) window.clearInterval(this.pageReloadInterval);
  }

  forceRefresh(): void {
    window.location.reload(); // Recharge complètement la page
  }

  // Met à jour l’affichage à partir d’un objet ChatData
  private updateChatDisplay(chatData: ChatData): void {
    this.currentChat = [];
    for (let i = 1; i < chatData.chat_history.length; i++) {
      this.currentChat.push(chatData.chat_history[i].content);
    }
    this.title = chatData.title || '';
    this.scrollToBottom();
  }

  getArrowDirection(): string {
    return this.showChatNames ? "arrow-up" : "arrow-down"; // Pour icônes visuels UI
  }


  newChat(): void {
    this.title = "UNTITLED";
    this.currentChat = [];
    if (this.CV_interaction.length > 0 && this.CV_interaction[0].chats) {
      this.selectedChat = this.CV_interaction[0].chats.length;
    } else {
      this.selectedChat = 0;
    }
    this.currentChat.push(ChatConstants.START_CONVERSATION);
  }
  // Permet d’envoyer le message en appuyant sur 'Entrée'
  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent): void {
    if (document.activeElement === this.userMsgElement?.nativeElement && !this.isSendingMessage) {
      event.preventDefault();
      this.sendMessage(this.userMsgElement.nativeElement);
    }
  }

  // Fonction asynchrone pour envoyer un message au service
  async sendMessage(inputField: HTMLInputElement): Promise<void> {
    const question = inputField.value.trim();
    if (!question) return;

    this.isSendingMessage = true;
    this.currentChat.push(question); // Affiche la question
    this.currentChat.push("..."); // Montre que la réponse est en cours
    inputField.value = '';
    this.messageControl.reset();

    try {
       const response: any = await this.cvIntercationService.update(this.cv_id,question);
      this.currentChat[this.currentChat.length - 1] = response.answer || 'No answer received';
    } catch (error) {
      console.error("Chat error:", error);
      this.currentChat[this.currentChat.length - 1] = 'Error processing your message';
    } finally {
      this.isSendingMessage = false;
    }
  }

  // Formate un message brut en HTML (gras, sauts de ligne, etc.)
  formatMessage(message: string): string {
    if (!message) return '';
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(\d+)\.\s+/g, '<br><strong>$1.</strong> ')
      .replace(/\n/g, '<br>');
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.getElementById('chat-container');
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = (event.target as Window).innerWidth;
    this.isLeftSidebarOpen = width > 850;
    this.isRightSidebarOpen = width > 850;
  }

  toggleLeftSidebar(): void { this.isLeftSidebarOpen = !this.isLeftSidebarOpen; }
  toggleRightSidebar(): void { this.isRightSidebarOpen = !this.isRightSidebarOpen; }
}

