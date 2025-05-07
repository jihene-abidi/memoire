import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import {CacheApi} from "./cache";
import {Observable} from "rxjs";
import {FileModel} from "../models/file";

@Injectable({
  providedIn: "root",
})

export class FileAPI{

  public fileUrl = "/files";

  constructor(
    private http: HttpClient,
    public cacheApi: CacheApi
  ) {}


  add(file: FileModel) {
    return this.http.post<FileModel>('/files', file);
  }
  findOne(id: string): Observable<FileModel> {
    return this.http.get<FileModel>('/files/' + id);
  }



}
