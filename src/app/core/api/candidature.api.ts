import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Candidature } from "../models/candidature";

@Injectable({
  providedIn: "root",
})
export class CandidatureApi {
  private candidatureUrl = "/candidature";

  constructor(private http: HttpClient) {}


  findAll(limit: number, page: number , userId?: string,jobId?:string): Observable<Candidature[]> {
    let params = new HttpParams()
      .set("limit", limit)
      .set("page", page);
    // Add userId parameter if provided
    if (userId) {
      params = params.set("userId", userId);
    }
    if (jobId) {
      params = params.set("jobId", jobId);
    }
    return this.http.get<Candidature[]>(this.candidatureUrl, { params });
  }


  findOne(id: string): Observable<Candidature> {
    return this.http.get<Candidature>(`${this.candidatureUrl}/${id}`);
  }


  insert(candidature: Candidature): Observable<Candidature> {
    return this.http.post<Candidature>(this.candidatureUrl, candidature);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.candidatureUrl}/${id}`);
  }
}
