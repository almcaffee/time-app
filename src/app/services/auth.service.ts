import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginCredentials, Profile } from '../models';
import { Router } from '@angular/router';
import { Observable, Subscription, Subject } from 'rxjs';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:8000/api/';
  private profile: Profile;
  authSub = new Subject<Profile>();
  authSub$ = this.authSub.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): boolean {
    return !!localStorage.getItem('usr');
  }

  getProfile(): Profile {
    return this.profile;
  }

  isLoggedIn(): boolean {
    return !!this.profile;
  }

  login(credentials: LoginCredentials, redirect?: string) {
    this.http.get<Profile>(this.API_URL+'login/user/'+credentials.user+'/lastname/'+credentials.lastname)
    .subscribe(profile=> {
      this.profile = profile;
      this.authSub.next(profile);
      localStorage.setItem('usr', JSON.stringify({ user: profile.employeeid, lastname: profile.lastname}));
      let location = redirect && redirect.length > 1 ? redirect : '/calendar';
      console.log('Location:' + location)
      this.router.navigate([location]);
    }, err=> {
      console.log(err);
      this.authSub.next(null);
    });
  }

  logout() {
    localStorage.clear();
    this.authSub.next(null);
  }
}
