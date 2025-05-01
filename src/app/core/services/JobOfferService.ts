import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {JobOfferApi} from "../api/JobOfferApi";
import {JobOffer} from "../models/jobOffer";

@Injectable({
  providedIn: "root",
})
export class JobOfferService {
  constructor(
    private http: HttpClient,
    private jobOfferApi: JobOfferApi,
  ) {
  }

  findAll(limit?: number, page?: number) {
    return this.jobOfferApi.findAll(limit, page);
  }

  findOne(id: string) {
    return this.jobOfferApi.findOne(id);
  }

  insert(jobOffer: JobOffer) {
    return this.jobOfferApi.insert(jobOffer);
  }

  update(jobOffer: JobOffer) {
    return this.jobOfferApi.update(jobOffer);
  }

  remove(jobOfferId: string) {
    return this.jobOfferApi.remove(jobOfferId);
  }

  patch(jobOfferId: string, updateData: Partial<JobOffer>) {
    return this.jobOfferApi.patch(jobOfferId, updateData); // Pass the updateData to the API
  }

}
