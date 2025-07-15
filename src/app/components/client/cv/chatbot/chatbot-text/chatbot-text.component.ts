import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClientImports } from '../../../client-imports';
import { MatSidenavModule } from '@angular/material/sidenav'; // Module pour la barre latérale
import { FormControl } from '@angular/forms';
import { ChatConstants } from '../../cv.constants';
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { InteractionCVService } from '../../../../../core/services/interaction-cv.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserModel } from '../../../../../core/models/user';
import { UserService } from '../../../../../core/services/user';
import { CvService } from '../../../../../core/services/cv.service';
import { Cv } from '../../../../../core/models/cv';


interface ChatMessage { type: string; content: string; }
interface ChatData { title: string; chat_history: ChatMessage[]; favorite: boolean; }



@Component({
  selector: 'app-chatbot-text',
  standalone: true,
  imports: [ClientImports, MatSidenavModule, MatTab, MatTabGroup],
  templateUrl: './chatbot-text.component.html',
  styleUrls: ['./chatbot-text.component.css'],
})
export class TextChatbotComponent implements OnInit, OnDestroy {
  // Champs du formulaire pour écrire un message
  messageControl = new FormControl('');
  constants = ChatConstants;
  // Contrôle de l'affichage des barres latérales selon la taille de l'écran
  isLeftSidebarOpen = window.innerWidth > 850;
  isRightSidebarOpen = window.innerWidth > 850;
  showChatNames = true;
  chats: ChatData[] = [];
  cv_id = '';
  candidature_id = '';
  id = '';
  CV_interaction: any[] = [];
  currentChat: string[] = []; // Stocke les messages du chat courant
  title = '';
  currentUser!: UserModel;
  cv!: Cv;
  titre = "History";
  limit = 10;
  page = 1;
  selectedChat = 0;
  isSendingMessage = false;
  private subscriptions: Subscription[] = [];
  private refreshInterval?: number;
  private pageReloadInterval?: number;
  // Récupère la référence HTML de l'élément de saisie utilisateur
  @ViewChild('userMsg') userMsgElement!: ElementRef;

  constructor(
    public cvIntercationService: InteractionCVService,
    private route: ActivatedRoute,
    private UserService: UserService,
    private cvChaliceService: CvService,

  ) {}

  ngOnInit(): void {
    // Récupération de l'utilisateur courant
    this.currentUser = this.UserService.getCurrentUser()!;
    // Récupère l'ID de candidature depuis l'URL
    this.route.paramMap.subscribe(params => {
      this.candidature_id = params.get("id") ?? '';
      if (this.candidature_id) {
       this.newChat();  // Démarre un nouveau chat si ID présent
      }
    });
    // Scroll automatique vers le bas du chat
    setTimeout(() => this.scrollToBottom(), 500);
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.refreshInterval) window.clearInterval(this.refreshInterval);
    if (this.pageReloadInterval) window.clearInterval(this.pageReloadInterval);
  }

  // Forcer le rechargement de la page
  forceRefresh(): void {
    window.location.reload();
  }

  // Affiche les messages du chat sélectionné
  private updateChatDisplay(chatData: ChatData): void {
    this.currentChat = [];
    for (let i = 1; i < chatData.chat_history.length; i++) {
      this.currentChat.push(chatData.chat_history[i].content);
    }
    this.title = chatData.title || '';
    this.scrollToBottom();
  }

  getArrowDirection(): string {
    return this.showChatNames ? "arrow-up" : "arrow-down";
  }

  // Démarre une nouvelle conversation
  async newChat():  Promise<void> {
    this.title = "UNTITLED";
    this.currentChat = [];
    // Détermine la position du chat sélectionné
    if (this.CV_interaction.length > 0 && this.CV_interaction[0].chats) {
      this.selectedChat = this.CV_interaction[0].chats.length;
    } else {
      this.selectedChat = 0;
    }

    try {
      const response: any = await this.cvIntercationService.startConversation(this.candidature_id);
      this.currentChat.push(response.question || 'No answer received');
    } catch (error) {
      console.error("Chat error:", error);
      this.currentChat.push('Error processing your message');
    } finally {
      this.isSendingMessage = false;
    }
  }
 // Détecte l'appui sur la touche "Entrée" pour envoyer le message
  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent): void {
    if (document.activeElement === this.userMsgElement?.nativeElement && !this.isSendingMessage) {
      event.preventDefault();
      this.sendMessage(this.userMsgElement.nativeElement);
    }
  }

  // Envoie le message utilisateur et récupère la réponse du chatbot
  async sendMessage(inputField: HTMLInputElement): Promise<void> {
    const question = inputField.value.trim();
    if (!question) return;

    this.isSendingMessage = true;
    this.currentChat.push(question); // Affiche la question de l'utilisateur
    this.currentChat.push("...");    // Placeholder pendant l'attente
    inputField.value = '';           // Réinitialise le champ de saisie
    this.messageControl.reset();

    try {
       const response: any = await this.cvIntercationService.handleAnswer(this.candidature_id,question);
      this.currentChat[this.currentChat.length - 1] = response.question || 'No answer received';
    } catch (error) {
      console.error("Chat error:", error);
      this.currentChat[this.currentChat.length - 1] = 'Error processing your message' ;
    } finally {
      this.isSendingMessage = false;
    }
  }
// Met en forme les messages pour affichage HTML
  formatMessage(message: string): string {
    if (!message) return '';
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(\d+)\.\s+/g, '<br><strong>$1.</strong> ')
      .replace(/\n/g, '<br>');
  }
  // Fait défiler le chat vers le bas
  scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.getElementById('chat-container');
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
  }
 // Réagit au redimensionnement de la fenêtre pour gérer l'affichage
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = (event.target as Window).innerWidth;
    this.isLeftSidebarOpen = width > 850;
    this.isRightSidebarOpen = width > 850;
  }

  toggleLeftSidebar(): void { this.isLeftSidebarOpen = !this.isLeftSidebarOpen; }
  toggleRightSidebar(): void { this.isRightSidebarOpen = !this.isRightSidebarOpen; }
}
