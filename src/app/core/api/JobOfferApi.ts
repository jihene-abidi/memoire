import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import {JobOffer} from "../models/jobOffer";
import {Observable} from "rxjs";



@Injectable({
  providedIn: "root",
})
export class JobOfferApi {
  public jobOfferUrl = "/offre";


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
    return this.http.get<any>(this.jobOfferUrl, { params }).toPromise();
  }

  findOne(id: any) {
    return this.http.get<any>(`${this.jobOfferUrl}/${id}`).toPromise();
  }


  insert(jobOffer: any): Observable<any> {
    return this.http.post<any>(`${this.jobOfferUrl}`, jobOffer);
  }

  update(jobOffer: JobOffer): Observable<any> {
    return this.http.put(this.jobOfferUrl, jobOffer);
  }

  //
  // remove(jobOfferId: string) {
  //   const url = `${this.jobOfferUrl}/${jobOfferId}`;
  //   return this.http.delete(url).toPromise()
  // }
  remove(jobOfferId: string): Observable<any> {
    const url = `${this.jobOfferUrl}/${jobOfferId}`;
    return this.http.delete<any>(url);
  }
  patch(jobOfferId: string, updateData: Partial<JobOffer>): Observable<any> {
    const url = `${this.jobOfferUrl}/${jobOfferId}`;
    return this.http.patch<any>(url, updateData);
  }


}
