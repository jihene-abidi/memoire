import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ChatCamConstants } from './chatbot-webcam.constants';
import {TranslatePipe} from "@ngx-translate/core";


@Component({
  selector: 'app-chatbot-webcam',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatIconModule,TranslatePipe],
  templateUrl: './chatbot-webcam.component.html',
  styleUrls: ['./chatbot-webcam.component.css'],
})
export class ChatbotWebcamComponent implements OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  
  stream: MediaStream | null = null;
  isStreamActive = false;
  chatCamConstants = ChatCamConstants;
  constructor(public dialogRef: MatDialogRef<ChatbotWebcamComponent>) {}

  ngOnDestroy() {
    this.stopCamera();
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
        this.isStreamActive = true;
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      this.isStreamActive = false;
    }
  }

  closeDialog(): void {
    this.stopCamera();
    this.dialogRef.close();
  }
}