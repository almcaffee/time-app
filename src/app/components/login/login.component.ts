import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  subs: Subscription[];

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.subs = [];
    this.setupForm();
  }

  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  login() {
    this.auth.login(this.loginForm.value);
  }

  setupForm() {
    this.loginForm = new FormGroup({
      user: new FormControl(null, Validators.required),
      lastname: new FormControl(null, Validators.required)
    });
  }

  testLogin() {
    this.loginForm.patchValue({ user: '00001', lastname: 'Tinsley' });
    this.login();
  }

}
