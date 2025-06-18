import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClientImports } from '../../client-imports';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormControl } from '@angular/forms';
import { ChatConstants } from '../cv.constants';
import { MatDialog } from '@angular/material/dialog';
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { HttpClient } from '@angular/common/http';
import { InteractionCVService } from '../../../../core/services/interaction-cv.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserModel } from '../../../../core/models/user';
import { UserService } from '../../../../core/services/user';
import { CvService } from '../../../../core/services/cv.service';
import { Cv } from '../../../../core/models/cv';
import { InteractionCVModel } from '../../../../core/models/interaction-cv.model';
import { CacheService } from '../../../../core/services/cache';
import { DeleteChatComponent } from './delete-chat/delete-chat.component';

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
  messageControl = new FormControl('');
  constants = ChatConstants;
  isLeftSidebarOpen = window.innerWidth > 850;
  isRightSidebarOpen = window.innerWidth > 850;
  showChatNames = true;
  chats: ChatData[] = [];
  cv_id = '';
  id = '';
  CV_interaction: any[] = [];
  currentChat: string[] = [];
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

  @ViewChild('userMsg') userMsgElement!: ElementRef;

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    public cvIntercationService: InteractionCVService,
    private route: ActivatedRoute,
    private UserService: UserService,
    private cvChaliceService: CvService,
    private cacheService: CacheService

  ) {}

  ngOnInit(): void {
    this.currentUser = this.UserService.getCurrentUser()!;
    this.route.paramMap.subscribe(params => {
      this.cv_id = params.get("id") ?? '';

      if (this.cv_id) {
        this.cvChaliceService.findOne(this.cv_id).subscribe(
          (cvData: Cv) => {
            this.cv = cvData;
            this.refresh();
          },
          (error) => {
            console.error("Error loading CV:", error);
          }
        );
      } else {
        this.refresh();
      }
    });


    setTimeout(() => this.scrollToBottom(), 500);

    this.refreshInterval = window.setInterval(() => this.refreshChatData(), 15000);
    this.pageReloadInterval = window.setInterval(() => {
      if (!this.isSendingMessage) window.location.reload();
    }, 120000);
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.refreshInterval) window.clearInterval(this.refreshInterval);
    if (this.pageReloadInterval) window.clearInterval(this.pageReloadInterval);
  }

  forceRefresh(): void {
    window.location.reload();
  }

  async refreshChatData(): Promise<void> {
    if (!this.currentUser?._id || !this.CV_interaction[0] || this.isSendingMessage) return;

    try {
      const updatedInteraction = await this.cvIntercationService.getLatestInteraction(this.CV_interaction[0]._id);
      if (!updatedInteraction?.chats) return;

      this.CV_interaction[0] = updatedInteraction;
      this.chats = this.CV_interaction
        .filter(item => item.chats !== null)
        .map(item => item.chats)
        .flat();

      if (this.selectedChat >= 0 && this.chats[this.selectedChat]?.chat_history &&
        !this.isSendingMessage && this.currentChat.length % 2 === 0) {
        this.updateChatDisplay(this.chats[this.selectedChat]);
      }
    } catch (error) {
      console.error(this.constants.ERROR_REFRESHING_CHAT, error);
    }
  }

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

  async refresh(): Promise<void> {
    if (!this.currentUser?._id) return;

    this.CV_interaction = await this.cvIntercationService.findAll(
      this.limit, this.page, this.cv_id, this.currentUser._id
    );

    this.chats = this.CV_interaction
      .filter(item => item.chats !== null)
      .map(item => item.chats)
      .flat();

    if (this.chats.length > 0) {
      this.selectedChat = this.CV_interaction[0].prompt.chat_index;
      this.updateChatDisplay(this.chats[this.selectedChat]);
    }
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
  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent): void {
    if (document.activeElement === this.userMsgElement?.nativeElement && !this.isSendingMessage) {
      event.preventDefault();
      this.sendMessage(this.userMsgElement.nativeElement);
    }
  }

  async sendMessage(inputField: HTMLInputElement): Promise<void> {
    const message = inputField.value.trim();
    if (message.length <= 1) return;
    this.isSendingMessage = true;
    this.currentChat.push(message);
    this.scrollToBottom();
    inputField.value = '';
    this.messageControl.reset();
    this.currentChat.push(ChatConstants.THINKING);
    this.scrollToBottom();

    try {
      if (this.CV_interaction[0]) {
        const requestBody: any = { ...this.CV_interaction[0] };
        requestBody.prompt = { prompt: message, chat_index: this.selectedChat };



        const result: any = await this.cvIntercationService.update(requestBody);

        if (result && result.interractionId) {
          await this.waitForResponse(result.interractionId);
        }
      } else {
        if (!this.cv?._id) {
          this.currentChat.pop();
          this.currentChat.push(ChatConstants.SELECT_CV_FIRST);
          this.scrollToBottom();
          this.isSendingMessage = false;
          return;
        }

        const cvWithCorrectId: any = { ...this.cv };
        if (cvWithCorrectId._id !== undefined) {
          cvWithCorrectId.id = cvWithCorrectId._id;
          delete cvWithCorrectId._id;
        }

        const newInteraction: any = {
          user_id: this.currentUser._id || '',
          cv: cvWithCorrectId,
          prompt: { prompt: message, chat_index: 0 },
        };

        const result: any = await this.cvIntercationService.toPromise(
          this.cvIntercationService.insert(newInteraction)
        );

        if (result && result.interractionId) {
          await this.waitForResponse(result.interractionId);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      this.currentChat.pop();
      this.currentChat.push(ChatConstants.ERROR_PROCESSING);
      this.scrollToBottom();
      this.isSendingMessage = false;
    }
  }

  async waitForResponse(interactionId: string, maxWaitTime: number = 30000): Promise<void> {
    const loadingIndex = this.currentChat.length - 1;
    const startTime = Date.now();
    let waitTime = 2000;

    try {
      while (Date.now() - startTime < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, waitTime));

        const updatedInteraction = await this.cvIntercationService.getLatestInteraction(interactionId);
        if (!updatedInteraction?.chats?.length) {
          waitTime = Math.min(waitTime * 1.5, 5000);
          continue;
        }

        this.CV_interaction[0] = updatedInteraction;
        const chatIndex = updatedInteraction.prompt?.chat_index || this.selectedChat;
        const currentChatData = updatedInteraction.chats[chatIndex];

        if (currentChatData?.chat_history) {
          const userMessageIndex = currentChatData.chat_history.findIndex(
            (msg: ChatMessage) =>
              msg.type === 'human' &&
              msg.content.trim() === this.currentChat[this.currentChat.length - 2].trim()
          );

          if (userMessageIndex >= 0 && userMessageIndex + 1 < currentChatData.chat_history.length) {
            const aiMessage = currentChatData.chat_history[userMessageIndex + 1];

            if (aiMessage.type === 'ai') {
              this.currentChat[loadingIndex] = aiMessage.content;
              this.scrollToBottom();
              this.chats = this.CV_interaction
                .filter(item => item.chats !== null)
                .map(item => item.chats)
                .flat();
              this.isSendingMessage = false;
              return;
            }
          }

          const aiMessages = currentChatData.chat_history.filter((msg: ChatMessage) => msg.type === 'ai');
          const humanMessages = currentChatData.chat_history.filter((msg: ChatMessage) => msg.type === 'human');

          if (aiMessages.length > 0 && aiMessages.length === humanMessages.length - 1) {
            const latestAiMessage = aiMessages[aiMessages.length - 1];
            this.currentChat[loadingIndex] = latestAiMessage.content;
            this.scrollToBottom();
            this.chats = this.CV_interaction
              .filter(item => item.chats !== null)
              .map(item => item.chats)
              .flat();
            this.isSendingMessage = false;
            return;
          }
        }

        waitTime = Math.min(waitTime * 1.5, 5000);
      }
      this.currentChat[loadingIndex] = "No response received. Please try again later or refresh the page.";
      this.scrollToBottom();
      this.refreshChatData();
    } catch (error) {
      console.error("Error fetching chat data:", error);
      this.currentChat[loadingIndex] = "Error retrieving response. Please try again.";
      this.scrollToBottom();
      this.refreshChatData();
    } finally {
      this.isSendingMessage = false;
    }
  }

  formatMessage(message: string): string {
    if (!message) return '';
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(\d+)\.\s+/g, '<br><strong>$1.</strong> ')
      .replace(/\n/g, '<br>');
  }

  selectChat(index: number): void {
    this.selectedChat = index;
    if (this.chats[index]?.chat_history?.length > 1) {
      this.updateChatDisplay(this.chats[index]);
    } else {
      this.currentChat = [];
      this.title = this.chats[index]?.title || '';
    }
  }

  clearHistory(): void {
    if (!this.currentUser?._id) {
      console.warn(this.constants.USER_NOT_FOUND);
      return;
    }

    if (!this.CV_interaction[0]) {
      console.warn(this.constants.Interaction_Missing);
      return;
    }

    const dialogRef = this.dialog.open(DeleteChatComponent, {
      width: '400px',
      data: { 
        title: this.constants.Title, 
        message: this.constants.Message
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.isSendingMessage = true;

        const interactionCopy = { ...this.CV_interaction[0] };

        this.cvIntercationService.clearHistory(interactionCopy).subscribe({
          next: (response) => {
            this.CV_interaction = [];
            this.chats = [];
            this.currentChat = [];
            this.title = '';
            this.isSendingMessage = false;

            this.refresh();
          },
          error: (error) => {
            console.error(this.constants.ERROR_DELETING_HISTORY, error);
            console.error(this.constants.ERROR_DETAILS, error?.error);
            this.isSendingMessage = false;

          }
        });
      }
    });
  }



  async deleteChat(i: number) {
    const dialogRef = this.dialog.open(DeleteChatComponent, {
      width: '400px',
      data: { chatIndex: i }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'confirm') {
        this.CV_interaction[0].prompt.chat_index = i;
        await this.cvIntercationService
          .deleteChat(this.CV_interaction[0])
          .then(() => {
            this.selectedChat = 0;
          });

        this.cacheService.clearCache("/interactionCv");
        await this.refresh();
      }
    });
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