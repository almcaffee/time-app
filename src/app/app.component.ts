import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Router, NavigationExtras, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { WindowService } from '@services/window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  _auth: boolean;
  _authCheck: boolean;
  _subs: Subscription[];

  constructor(private as: AuthService, private rt: Router, private ws: WindowService) {
    this._subs = [];
    // if profile returned user is authenticted
    this._subs.push(this.as.authSub$.subscribe(profile=> {
      if(profile) { this._auth = true }
    }));
    // Grab and store previous route on navigation
    this._subs.push(this.rt.events.pipe(
     filter((event) => event instanceof NavigationEnd))
     .subscribe((event) => {
       localStorage.setItem('prvRt', this.rt.url);
     }));
     // Check for localStorage credentials
    this.checkAuth();
  }

  checkAuth() {
    if(!!localStorage.getItem('usr') && !this.as.isLoggedIn() && this.rt.url.length > 0) {
      let prvRt = localStorage.getItem('prvRt');
      this.as.login(JSON.parse(localStorage.getItem('usr')), prvRt);
      this._auth = true;
    } else {
      localStorage.clear();
    }
    // no view in tmeplate until auth checked
    this._authCheck = true;
  }

}
