import { Injectable } from "@angular/core";
import { CvApi } from "../api/cv.api";
import { Cv } from "../models/cv";

@Injectable({
  providedIn: "root",
})
export class CvService {
  constructor(private CvUserApi: CvApi) {}





  insert(cv: Cv) {
    return this.CvUserApi.insert(cv);
  }

  findAll(limit?: number, page?: number, userId?: string, visibility?: string, query?: string) {
    return this.CvUserApi.findAll(limit, page, userId, visibility, query);
  }


  findOne(id: any) {
    return this.CvUserApi.findOne(id);
  }

  remove(id: string) {
    return this.CvUserApi.remove(id);
  }
  update(cv: Cv) {
    return this.CvUserApi.update(cv);
  }


}