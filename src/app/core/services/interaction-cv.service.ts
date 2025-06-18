import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { InteractionCVModel } from '../models/interaction-cv.model';
import { InteractionCvApi } from '../api/interaction-cv.api';

@Injectable({
  providedIn: 'root'
})
export class InteractionCVService {
  constructor(
    private http: HttpClient,
    public interactionCvApi: InteractionCvApi
  ) {}
  findAll(limit: number, page: number, cvId: string, user_id: string) {
    return this.interactionCvApi.getAllModels(limit, page, cvId, user_id);
  }



  findOne(id: string): Observable<InteractionCVModel> {
    return this.interactionCvApi.getModel(id);
  }

  insert(interactionCV: InteractionCVModel): Observable<InteractionCVModel> {
    return this.interactionCvApi.addModel(interactionCV);
  }

  async toPromise<T>(observable: Observable<T>): Promise<T> {
    return lastValueFrom(observable);
  }

  update(cvChalice: InteractionCVModel) {
    return this.interactionCvApi.updateModel(cvChalice);
  }


  remove(id: string): Observable<void> {
    return this.interactionCvApi.deleteModel(id);
  }


  findByUserId(userId: string): Observable<InteractionCVModel[]> {
    return this.interactionCvApi.findByUserId(userId);
  }


  
  deleteChat(cvChalice: InteractionCVModel) {
    return this.interactionCvApi.deleteChat(cvChalice);
  }

  getLatestInteraction(interactionId: string): Promise<any> {
    const timestamp = new Date().getTime();
    return this.http.get(
      `${this.interactionCvApi.interactionCvUrl}/${interactionId}?_=${timestamp}`
    ).toPromise().then((response: any) => {
      if (response && response.id !== undefined) {
        response._id = response.id;
      }
      return response;
    });
  }

  clearHistory(interaction: any): Observable<any> {
    return this.interactionCvApi.clearHistory(interaction); 
  }
  

}