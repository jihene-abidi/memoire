import { Injectable } from '@angular/core';
import { UserModel } from '../models/user';
import { UserApi } from '../api/user';
import { Observable } from 'rxjs';
import { AuthentificationConstant } from '../../components/authentification/authentification.constants';
import { ResponseStatusModel } from '../models/response-status';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private userApi: UserApi,
  ) {}



  create(user: UserModel): Observable<UserModel> {

    return this.userApi.create(user);

  }

  update(user: UserModel) : Observable<ResponseStatusModel> {
    return this.userApi.update(user)
  }




  findOne(id: string) {
    return this.userApi.findOne(id);
  }

  remove(id: string) {
    return this.userApi.remove(id);
  }

  getUsernameFromEmail(str: any): string {
    return str.slice(0, str.indexOf('@'));
  }



  setCurrentUser(user : UserModel): void {
    const userJson = JSON.stringify(user)
    localStorage.setItem(AuthentificationConstant.CURRENT_USER_LOCAL_STORAGE,userJson);
  }

  getCurrentUser(): UserModel {
    const userJson = localStorage.getItem(AuthentificationConstant.CURRENT_USER_LOCAL_STORAGE);
    return userJson ? JSON.parse(userJson) : null;
  }

  /*******************************Mes changements************************************/
  /*loadUserFromToken(): void {
    this.AuthService.getUserByToken().subscribe({
      next: (user: UserModel) => {
        this.setCurrentUser(user); // 🔹 stocke dans le localStorage
        console.log('Utilisateur connecté récupéré :', user);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l’utilisateur :', err);
      }
    });
}*/

}
