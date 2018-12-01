import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimeService } from '@services/time.service';
import { DateService }  from '@services/date.service';
import { AuthService }  from '@services/auth.service';
import { WindowService } from '@services/window.service';
import { Observable, Subscription } from 'rxjs';
import { Month, Day, Profile } from '@models';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { filter, map } from 'rxjs/operators';

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
  selectedDate: any;
  today: any;
  subs: Subscription[];

  constructor(private rt: Router,
    private ar: ActivatedRoute,
    private ts: TimeService,
    private ds: DateService,
    private as: AuthService,
    public ws: WindowService) {
    this.today = this.ds.today();
    this.subs = [];
    this.profile = this.as.getProfile();
    if(!this.profile) {
      this.as.authSub$.subscribe(profile=> {
        this.profile = profile;
        this.setupForm();
        this.getThisMonth();
      })
    } else {
      this.setupForm();
      this.getThisMonth();   
    }
    this.ar.params.subscribe(params => console.log('Got new value for params', params));
  }

  ngOnInit() {}
  /* Test comment for jenkins build start */
  /* Clear memeory of subs on destroy */
  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  getLastMonth() {
    let lm = moment(this.month.days[15].dateString).subtract(1, 'M').format('YYYY-MM-DD');
    let month = this.ds.getCalendarMonth(lm);
    this.setMonth(month);
  }

  getNextMonth() {
    let nm = moment(this.month.days[15].dateString).add(1, 'M').format('YYYY-MM-DD');
    let month = this.ds.getCalendarMonth(nm);
    this.setMonth(month);
  }

  getThisMonth() {
    let month = this.ds.getCalendarMonth(moment().format('YYYY-MM-DD'));
    this.setMonth(month);
  }

  isToday(obj1: any, obj2: any): boolean {
    return obj1.day === obj2.day && obj1.year === obj2.year && obj1.month === obj2.month;
  }

  isThisMonth(): boolean {
    let today: Day = this.ds.populateDay(moment(new Date()));
    return this.month.year === today.year && this.month.id === today.month;
  }

  /* Reactive form */
  setupForm() {
    let id = this.profile.id || null;
    this.timeForm = new FormGroup({
      id: new FormControl(id, [Validators.required, Validators.pattern(/^[0-9]+$/)])
    });
    // if(this.profile) this.timeForm.controls['id'].patchValue(this.profile.id);
    this.subs.push(this.timeForm.valueChanges.subscribe(timeFormValue=> console.log(timeFormValue)));
  }

  setMonth(month: Month) {
    this.subs.push(this.ts.getTimeByPeriod(this.profile.id, month.days[0].moment, month.days[month.days.length-1].moment)
    .subscribe(res=> {
      let mm = month;
      mm.days = this.ds.getTimeEntries(mm.days, res);
      this.month = mm;
    }, err=> {
      this.month = month;
      console.log(err);
    }));
  }

  shiftMonth

}
