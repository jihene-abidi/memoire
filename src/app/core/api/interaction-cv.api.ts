import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {Observable} from "rxjs";
import { InteractionCVModel } from "../models/interaction-cv.model";

@Injectable({
  providedIn: "root",
})
export class InteractionCvApi { 
  public interactionCvUrl = "/interactionCv";
  constructor(private http: HttpClient) {}
    
  getAllModels(limit?: number, page?: number, cvId?: string, user_id?: string) {
    let params = new HttpParams();
    if (limit) {
      params = params.append("limit", limit.toString());
    }
    if (page) {
      params = params.append("page", page.toString());
    }
    if (cvId) {
      params = params.append("cvId", cvId);
    }
    if (user_id) {
      params = params.append("user_id", user_id);
    }
    return this.http.get<any>(this.interactionCvUrl, { params }).toPromise();
  }

  getModel(id: string): Observable<InteractionCVModel> {
    return this.http.get<InteractionCVModel>(`${this.interactionCvUrl}/${id}`);
  }

  addModel(model: InteractionCVModel): Observable<InteractionCVModel> {
    return this.http.post<InteractionCVModel>(this.interactionCvUrl, model);
  }

  updateModel(interactionCV: InteractionCVModel) {
    return this.http.put(this.interactionCvUrl, interactionCV).toPromise();
  }

  deleteModel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.interactionCvUrl}/${id}`);
  }

  findByUserId(userId: string): Observable<InteractionCVModel[]> {
    return this.http.get<InteractionCVModel[]>(`${this.interactionCvUrl}/user/${userId}`);
  }

  deleteChat(interactionCV: InteractionCVModel) {
    return this.http
      .put(`${this.interactionCvUrl}/delete`, interactionCV)
      .toPromise();
  }

  clearHistory(interaction: any): Observable<any> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });    
    
    const payload = { ...interaction };
    
    
    if (!payload._id) {
      console.error("Payload missing _id property");
      throw new Error("Payload missing _id property");
    }
    
    const simplifiedPayload = {
      _id: payload._id,
      user_id: payload.user_id,
      cv: payload.cv,
      prompt: payload.prompt,
      chats: [] 
    };
    
    
    return this.http.put(`${this.interactionCvUrl}/delete/all`, simplifiedPayload, { headers });
  }
}