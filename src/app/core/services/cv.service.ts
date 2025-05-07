import { Injectable } from "@angular/core";
import { CvApi } from "../api/cv.api";
import { Cv } from "../models/cv";

@Injectable({
  providedIn: "root",
})
export class CvService {
  constructor(private CvChaliceApi: CvApi) {}





  insert(cv: Cv) {
    return this.CvChaliceApi.insert(cv);
  }

  findAll(limit?: number, page?: number, userId?: string, visibility?: string, query?: string) {
    return this.CvChaliceApi.findAll(limit, page, userId, visibility, query);
  }


  findOne(id: any) {
    return this.CvChaliceApi.findOne(id);
  }

  remove(id: string) {
    return this.CvChaliceApi.remove(id);
  }
  update(cv: Cv) {
    return this.CvChaliceApi.update(cv);
  }


}
