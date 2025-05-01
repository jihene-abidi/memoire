import { Injectable } from "@angular/core";
import { CandidatureApi } from "../api/candidature.api";
import { Observable } from "rxjs";
import { Candidature } from "../models/candidature";

@Injectable({
  providedIn: "root",
})
export class CandidatureService {
  constructor(private candidatureApi: CandidatureApi) {}


  getAllCandidatures(limit: number, page: number, userId?: string, jobId?: string): Observable<Candidature[]> {
    return this.candidatureApi.findAll(limit, page, userId, jobId);
  }

  applyToJob(candidature: Candidature): Observable<any> {
    return this.candidatureApi.insert(candidature);
  }

  getCandidatureById(id: string): Observable<Candidature> {
    return this.candidatureApi.findOne(id);
  }

  createCandidature(candidature: Candidature): Observable<Candidature> {
    return this.candidatureApi.insert(candidature);
  }

  deleteCandidature(id: string): Observable<void> {
    return this.candidatureApi.remove(id);
  }
}
