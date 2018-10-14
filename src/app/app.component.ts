import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  _auth: boolean;
  _subs: Subscription[];

  constructor(private auth: AuthService, private router: Router) {
    this._subs = [];
    if(!!localStorage.getItem('usr') && !this.auth.isLoggedIn() && this.router.url.length > 0) {
      this.auth.login(JSON.parse(localStorage.getItem('usr')), this.router.url);
    } else { localStorage.clear(); }
  }

}
