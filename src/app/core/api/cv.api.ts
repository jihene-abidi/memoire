import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Cv } from "../models/cv";
import {CacheApi} from "./cache";


@Injectable({
  providedIn: "root",
})
export class CvApi {
  public cvUrl = 'http://127.0.0.1:5000/cvs/';

  constructor(
    private http: HttpClient,
    public cacheApi: CacheApi,
  )
  {}

  findOne(id: string) {
    return this.http.get<any>(this.cvUrl + id);
  }
  findAll(limit?: number, page?: number, userId?: string, visibility?: string, query?: string) {
    let params = new HttpParams();
    if (limit) {
      params = params.append("limit", limit.toString());
    }
    if (page) {
      params = params.append("page", page.toString());
    }
    if (userId) {
      params = params.append("userId", userId);
    }
    if (visibility) {
      params = params.append("visibility", visibility);
    }
    if (query) {
      params = params.append("query", query);
    }
    return this.http.get<Cv[]>(`http://127.0.0.1:5000/users/${userId}/cvs`);
  }

  insert(userId: string, cv: FormData) {
    return this.http.post(`http://127.0.0.1:5000/users/${userId}/cvs`, cv);
  }
  getCvFilePath(fileId: any) {
  return this.http.get<{ source: string; name: string }>(`http://127.0.0.1:5000/cv-path/${fileId}`);
  }

  remove(id: string) {
    return this.http.delete(this.cvUrl + id);
  }

  update(cv: Cv) {
    return this.http.put(this.cvUrl, cv);
  }



}