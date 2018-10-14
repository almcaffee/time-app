import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimeService } from '@services/time.service';
import { DateService }  from '@services/date.service';
import { AuthService }  from '@services/auth.service';
import { WindowService } from '@services/window.service';
import { Observable, Subscription } from 'rxjs';
import { Month, Day, Profile } from '@models';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  profile: Profile;
  timeForm: FormGroup;
  days: Day[];
  month: Month;
  subs: Subscription[];

  constructor(private rt: Router,
    private ar: ActivatedRoute,
    private ts: TimeService,
    private ds: DateService,
    private as: AuthService,
    public ws: WindowService) {
    this.profile = this.as.getProfile();
    this.ar.params.subscribe(params => console.log('Got new value for params', params));
    this.month = this.ds.getMonth(new Date());
    console.log(this.month)
  }

  ngOnInit() {
    this.subs = [];
    if(!this.profile) { this.as.authSub$.subscribe(profile=> { this.profile = profile; this.setupForm() }) }
    else { this.setupForm() }
  }

  /* Clear memeory of subs on destroy */
  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  /* Reactive form */
  setupForm() {
    this.timeForm = new FormGroup({
      employeeid: new FormControl(this.profile.employeeid, [Validators.required, Validators.pattern(/^[0-9]+$/)])
    });
    this.subs.push(this.timeForm.valueChanges.subscribe(timeFormValue=> console.log(timeFormValue)));
  }

}
