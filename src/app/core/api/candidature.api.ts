import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Candidature } from "../models/candidature";

@Injectable({
  providedIn: "root",
})
export class CandidatureApi {
  private candidatureUrl = "http://127.0.0.1:5000/applications";

  constructor(private http: HttpClient) {}


  findAll( userId?: string): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.candidatureUrl}/${userId}`);
  }

  findAllByOffer(jobId?:string): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.candidatureUrl}/job/${jobId}`);
  }


  findOne(id: string): Observable<any> {
    return this.http.get<Candidature>(`${this.candidatureUrl}/${id}`);
  }


  insert(candidature: any): Observable<Candidature> {
    return this.http.post<Candidature>(`http://127.0.0.1:5000/apply`, candidature);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.candidatureUrl}/${id}`);
  }
  getReportPath(id: string): Observable<any> {
    return this.http.get<any>(`http://127.0.0.1:5000/report-path/${id}`);
  }
}