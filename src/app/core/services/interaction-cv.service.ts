import { Injectable } from '@angular/core';
import { InteractionCvApi } from '../api/interaction-cv.api';

@Injectable({
  providedIn: 'root'
})
export class InteractionCVService {
  constructor(
    public interactionCvApi: InteractionCvApi
  ) {}

  update(id: string, question:string) {
    return this.interactionCvApi.updateModel(id, question);
  }
    startConversation(id: string) {
    return this.interactionCvApi.start(id );
  }
  handleAnswer(id: string, answer:string) {
    return this.interactionCvApi.handle(id, answer);
  }
}