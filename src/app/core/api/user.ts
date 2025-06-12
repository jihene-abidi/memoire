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
    return this.http.get<UserModel>(`http://127.0.0.1:5000/users/${id}`);
  }
  remove(id: string) {
    return this.http.delete(`http://127.0.0.1:5000/update-profile/${id}`);
  }

  update(user: Partial<UserModel>): Observable<ResponseStatusModel> {
    return this.http.put<ResponseStatusModel>(`http://127.0.0.1:5000/update-profile/${user._id}`, user);
  }

  updateimage(user: Partial<UserModel>,image:File): Observable<ResponseStatusModel> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.post<ResponseStatusModel>(`http://127.0.0.1:5000/update-profile-image/${user._id}`, formData);
  }

  requestResetPassword(email: string): Observable<string>{
    const req = {email : email}
    return this.http.post<string>(`http://127.0.0.1:5000/request-reset-password`,req);
  }

  resetPassword(email: string, reset_code: number, new_password:string): Observable<string>{
    const req = {
      email : email,
      reset_code : reset_code,
      new_password : new_password
    }
    return this.http.post<string>(`http://127.0.0.1:5000/reset-password`,req);
  }

  private mapApiResponseToResponseStatus(apiResponse: {
    [key: string]: string;
  }): ResponseStatusModel {
    const key = Object.keys(apiResponse)[0];
    const value = apiResponse[key];

    return new ResponseStatusModel(key as ResponseStatusEnum, value);
  }
}
