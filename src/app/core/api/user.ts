import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserModel } from '../models/user';
import { CacheApi } from './cache';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResponseStatusModel } from '../models/response-status';
import { ResponseStatusEnum } from '../enums/response-status';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  token: string | undefined;
  user: UserModel = new UserModel();
  public URL = '/users/:id';
  public userURL = '/users/';

  constructor(private http: HttpClient, private cacheApi: CacheApi) {}



  create(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.userURL, user);
  }

  findOne(id: string) {
    return this.http.get<UserModel>(this.userURL + id);
  }
  remove(id: string) {
    return this.http.delete(this.userURL + id);
  }

  update(user: UserModel): Observable<ResponseStatusModel> {
    return this.http.put<ResponseStatusModel>(this.userURL, user);
  }

  private mapApiResponseToResponseStatus(apiResponse: {
    [key: string]: string;
  }): ResponseStatusModel {
    const key = Object.keys(apiResponse)[0];
    const value = apiResponse[key];

    return new ResponseStatusModel(key as ResponseStatusEnum, value);
  }
}
