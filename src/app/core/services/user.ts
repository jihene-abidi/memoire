import { Injectable } from '@angular/core';
import { UserModel } from '../models/user';
import { UserApi } from '../api/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthentificationConstant } from '../../components/authentification/authentification.constants';
import { ResponseStatusModel } from '../models/response-status';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject: BehaviorSubject<UserModel | null>;
  public currentUser$: Observable<UserModel | null>;
  constructor(
    private userApi: UserApi,
  ) {
     const storedUser = localStorage.getItem(AuthentificationConstant.CURRENT_USER_LOCAL_STORAGE);
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    this.currentUserSubject = new BehaviorSubject<UserModel | null>(parsedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }



  create(user: UserModel): Observable<UserModel> {

    return this.userApi.create(user);

  }

  update(user: Partial<UserModel>) : Observable<ResponseStatusModel> {
    return this.userApi.update(user);
  }

  updateimage(user: Partial<UserModel>, image:File) : Observable<ResponseStatusModel> {
    return this.userApi.updateimage(user,image);
  }

  requestResetPassword(email: string): Observable<string>{
    return this.userApi.requestResetPassword(email);
  }

  resetPassword(email: string, reset_code: number, new_password:string): Observable<string>{
    return this.userApi.resetPassword(email,reset_code,new_password);
  }
  editPassword(oldPassword: string, newPassword: string,userId:string): Observable<string> {
  return this.userApi.editPassword(oldPassword, newPassword,userId);
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
    this.currentUserSubject.next(user);
  }

   getCurrentUser(): UserModel | null {
    return this.currentUserSubject.value;
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