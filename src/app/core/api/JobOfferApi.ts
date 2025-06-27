import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import {JobOffer} from "../models/jobOffer";
import {Observable} from "rxjs";



@Injectable({
  providedIn: "root",
})
export class JobOfferApi {
  public jobOfferUrl = "http://127.0.0.1:5000";


  constructor(
    private http: HttpClient) {}

  findAll(limit: any, page: any) {
    let params = new HttpParams();
    if (limit) {
      params = params.append("limit", limit);
    }
    if (page) {
      params = params.append("page", page);
    }
    return this.http.get<any>(`${this.jobOfferUrl}/job-offers`, { params }).toPromise();
  }

  findOne(id: any) {
    return this.http.get<any>(`${this.jobOfferUrl}/job-offers/${id}`).toPromise();
  }


  insert(jobOffer: any): Observable<any> {
    return this.http.post<any>(`${this.jobOfferUrl}/create-job-offer`, jobOffer);
  }

  update(jobOfferId: string, jobOffer: Partial<JobOffer>): Observable<any> {
    return this.http.put(`${this.jobOfferUrl}/job-offers/${jobOfferId}`, jobOffer);
  }

  remove(jobOfferId: string): Observable<any> {
    const url = `${this.jobOfferUrl}/job-offers/${jobOfferId}`;
    return this.http.delete<any>(url);
  }
  patch(jobOfferId: string, updateData: Partial<JobOffer>): Observable<any> {
    const url = `${this.jobOfferUrl}/job-offers/${jobOfferId}`;
    return this.http.patch<any>(url, updateData);
  }


}