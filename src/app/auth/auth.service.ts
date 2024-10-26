import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  timer: any = null;
  //token:string=null;
  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDOEG1cY8bB7QqFDmAc7zQDxrxb3q6Lyb0',
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleErrors),
        tap((resData) => {
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleAuth(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    let expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    let user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    this.autoLogout(+expiresIn*1000);
  }
  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDOEG1cY8bB7QqFDmAc7zQDxrxb3q6Lyb0',
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleErrors),
        tap((resData) => {
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }
  private handleErrors(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    let error = 'an unKnown error';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(error);
    }
    if (errorRes.error.error.message == 'EMAIL_EXISTS') {
      error = 'the email is Already Exists!';
    } else if (
      errorRes.error.error.message == 'EMAIL_NOT_FOUND' ||
      errorRes.error.error.message == 'INVALID_LOGIN_CREDENTIALS'
    ) {
      error = 'the email is invalid or passwors ';
    } else {
      error = 'An error occurred';
    }
    return throwError(error);
  }
  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.timer){
      clearTimeout(this.timer);
    }
    this.timer=null;
  }
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpiratonDate: Date;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUSer = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpiratonDate)
    );
    if (loadedUSer.token) {
      const timeLogout=new Date(userData._tokenExpiratonDate).getTime()-new Date().getTime();
      this.user.next(loadedUSer);
      this.autoLogout(timeLogout);
    }
  }
  autoLogout(expDuration: number) {
    console.log(expDuration);
    this.timer = setTimeout(() => {
      this.logout();
    }, expDuration);
  }
}
