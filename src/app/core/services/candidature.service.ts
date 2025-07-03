import { Injectable } from "@angular/core";
import { CandidatureApi } from "../api/candidature.api";
import { Observable } from "rxjs";
import { Candidature } from "../models/candidature";

@Injectable({
  providedIn: "root",
})
export class CandidatureService {
  constructor(private candidatureApi: CandidatureApi) {}


  getAllCandidatures(userId?: string): Observable<Candidature[]> {
    return this.candidatureApi.findAll( userId);
  }
  getAllCandidaturesByOffer( jobId?: string): Observable<Candidature[]> {
    return this.candidatureApi.findAllByOffer(jobId);
  }

  applyToJob(candidature: any): Observable<any> {
    return this.candidatureApi.insert(candidature);
  }

  getCandidatureById(id: string): Observable<any> {
    return this.candidatureApi.findOne(id);
  }

  createCandidature(candidature: Candidature): Observable<Candidature> {
    return this.candidatureApi.insert(candidature);
  }

  deleteCandidature(id: string): Observable<void> {
    return this.candidatureApi.remove(id);
  }
  getReportpath(id: string): Observable<any> {
    return this.candidatureApi.getReportPath(id);
  }
}