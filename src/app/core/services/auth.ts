import { EventEmitter, Injectable, Output } from '@angular/core';
import {
  BehaviorSubject,
  from,
  mergeMap,
  Observable,
  of,
  ReplaySubject, Subscription,
  switchMap,
  throwError,
} from 'rxjs';
import { AuthentificationConstant } from '../../components/authentification/authentification.constants';
import { catchError, distinctUntilChanged, map, tap } from 'rxjs/operators';

import { UserService } from './user';
import { Router } from '@angular/router';
import { UserApi } from '../api/user';
import { UserModel } from '../models/user';
import { ToastrService } from 'ngx-toastr';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  attacchement: UserModel;
  public currentUserSubject = new BehaviorSubject<UserModel>({} as UserModel);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());


  public RoleSubject = new BehaviorSubject<string>('');

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  public isAuthenticatedd: boolean = false;

  private user: UserModel;
  public connection = localStorage.getItem('connection provider');
  @Output() outputToparrent = new EventEmitter<any>();

  private authConstant = AuthentificationConstant;
  constructor(
   // private amplifyService: AmplifyService,
    private userService: UserService,
    private userapi: UserApi,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient
  ) {

    this.user = <UserModel>{};
    this.attacchement = this.userService.getCurrentUser();
  }

  populate(result: any) {
   /* this.amplifyService.getCurrentUser().subscribe({
      next: (response) => {
        this.setAuth(response);
      },
      error: (error) => {
        console.log(error);
      },
    });*/
  }

  setAuth(user: any) {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.isAuthenticatedd = true;
  }

  async purgeAuth() {
   // this.amplifyService.signOut();
    this.currentUserSubject.next({} as UserModel);
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('UserObject');
    await this.purge();
  }

  purge() {
    console.log('are you in purge');

    const currentUser = JSON.parse(
      localStorage.getItem(AuthentificationConstant.CURRENT_USER_LOCAL_STORAGE) || '{}'
    );

    // Clear local user state
    localStorage.removeItem(
      AuthentificationConstant.CURRENT_USER_LOCAL_STORAGE
    );

/*
    return from(this.amplifyService.signOut()).pipe(
      tap(() => {
        console.log('User has been signed out');
      }),
      catchError((error) => {
        console.error('Error during sign-out:', error);
        return throwError(error);
      })
    );*/
  }

  setUser(user: UserModel) {
    localStorage.setItem(
      AuthentificationConstant.CURRENT_USER_LOCAL_STORAGE,
      JSON.stringify(user)
    );
  }

  async logout() {
    const BASE_URL = localStorage.getItem('BASE_URL')  || '';
    const CURRENT_PATH = localStorage.getItem('CURRENT_PATH') || '';
    // Also save candidature data before clearing
    const currentUser = this.userService.getCurrentUser();
    const userId = currentUser?._id;

    // Save candidature data for the current user
    let candidatureData = null;
    let candidatureTimestamp = null;

    if (userId) {
      const cacheKey = `user_candidatures_${userId}`;
      const timestampKey = `${cacheKey}_timestamp`;
      candidatureData = localStorage.getItem(cacheKey);
      candidatureTimestamp = localStorage.getItem(timestampKey);
    }
    await this.purgeAuth();
    localStorage.setItem('BASE_URL', BASE_URL);
    localStorage.setItem('CURRENT_PATH', CURRENT_PATH);

    // Restore candidature data if it existed
    if (userId && candidatureData) {
      const cacheKey = `user_candidatures_${userId}`;
      const timestampKey = `${cacheKey}_timestamp`;
      localStorage.setItem(cacheKey, candidatureData);
      if (candidatureTimestamp) {
        localStorage.setItem(timestampKey, candidatureTimestamp);
      }
    }
    this.router.navigateByUrl('/login').then(() => window.location.reload());
  }



  signUp(userName : string, password : string, email: string, role: string ): Observable<UserModel> {

    return this.http.post<any>('http://127.0.0.1:5000/signup',{userName, password, email, role}).pipe(
      switchMap((response) => {
        if (!response) {
          return throwError(() => new Error(AuthentificationConstant.ERROR_INVALID_COGNITO_RESPONSE));
        }


        const newUser = new UserModel(
          userName.trim(),
          email.trim()
        );
        newUser.sub = response.userSub;
        newUser.email_verified = false;



        return this.userService.create(newUser)
      }),
      catchError((error) => {
        this.toastr.error(error.message || this.authConstant.ERROR_SIGN_UP);
        return throwError(() => error);
      })
    );
  }
/*
  SignIn(email: string, password: string): Observable<UserModel> {
    return from(this.amplifyService.signIn(email, password)).pipe(
      switchMap((user: AmplifyUser) => {
        if (!user) {
          return throwError(() => new Error('Invalid Cognito user response'));
        }

        this.user = new UserModel(
          user.username.split('.')[0].trim() || '',
          user.attributes.email.trim().replace(/\s/g, ''),
        );
        this.user.email_verified = user.attributes.email_verified;
        this.user.sub = user.attributes.sub;
        this.user.clientId = user.pool.clientId;
        this.user.userPoolId = user.pool.userPoolId;

        // Set login timestamp
        localStorage.setItem('login_timestamp', Date.now().toString());

        return this.userService.create(this.user).pipe(
          tap(user => this.setUser(user)),
          map(user => user)
        );
      }),
      catchError((error) => {
        this.toastr.error(error.message || this.authConstant.ERROR_SIGN_IN);
        this.purgeAuth();
        return throwError(() => error);
      })
    );
  }



  resetPasswordRequest(userName: string): Observable<any> {
    return from(this.amplifyService.sendForgotPassword(userName)).pipe(
      map(() => {
        return { message: AuthentificationConstant.SENT_VERIFICATION_CODE };
      }),
      catchError((error: any) => {
        return throwError(
          () =>
            new Error(
              error.message || AuthentificationConstant.PASSWORD_REST_FAILED
            )
        );
      })
    );
  }

  resetPasswordSubmit(
    userName: string,
    code: string,
    newPassword: string
  ): Observable<any> {
    return from(
      this.amplifyService.forgotPasswordSubmit(userName, code, newPassword)
    ).pipe(
      map(() => {
        // this.toastr.success(AuthentificationConstant.PASSWORD_RESET_SUCCESS);
        return { message: AuthentificationConstant.PASSWORD_RESET_SUCCESSFUL };
      }),
      catchError((error: any) => {
        // this.toastr.error(
        //   error.message || AuthentificationConstant.PASSWORD_REST_FAILED
        // );
        return throwError(
          () =>
            new Error(
              error.message || AuthentificationConstant.PASSWORD_REST_FAILED
            )
        );
      })
    );
  }
    */
}
