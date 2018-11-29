import { Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { TimeService } from '@services/time.service';
import { DateService }  from '@services/date.service';
import { AuthService }  from '@services/auth.service';
import { WindowService } from '@services/window.service';
import { Observable, Subscription, timer } from 'rxjs';
import { Month, Day, Profile, DateSelection } from '@models';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, AfterViewInit, OnDestroy {

  startDate: any;
  endDate: any;
  reportForm: FormGroup;
  profile: Profile;
  subs: Subscription[];
  error: any;

  constructor(private ts: TimeService,
    private ds: DateService,
    private as: AuthService,
    public ws: WindowService) {
    this.subs = [];
    this.profile = this.as.getProfile();
    if(!this.profile) {
      this.as.authSub$.subscribe(profile=> {
        this.profile = profile;
        this.getTime();
      });
    }
  }

  ngOnInit() {
    this.setupForm();
  }

  ngAfterViewInit() {
    /* Materials datepicker sets value of input as a datepicker instance (bug) on init, give time to push initial values*/
    // timer(500).subscribe(()=> {
    //   if(this.startDate && this.endDate) {
    //     this.reportForm.patchValue({ startDate: this.startDate, endDate: this.endDate });
    //   } else {
    //     let d = new Date();
    //     let td = moment(d);
    //     console.log('patch new date')
    //     console.log(td.daysInMonth())
    //     console.log(td.startOf('month'))
    //     console.log(td.endOf('month'))
    //     this.reportForm.patchValue({ startDate: td.startOf('month'), endDate: td.endOf('month') });
    //   }
    // });
  }

  /* Clear memeory of subs on destroy */
  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  doSomething(event: any) {
    console.log(event)
  }

  getErrorMessage(control: string) {
    return this.reportForm.controls[control].hasError('required') ? 'Date required' : 'Invalid Date';
  }

  getTime() {
    this.subs.push(this.ts.getAllTime(this.profile.id)
    .subscribe(res=> {console.log(res)}, err=> { console.log(err)}));
  }

  getTimeByPeriod() {
    this.subs.push(this.ts.getTimeByPeriod(this.profile.id, this.reportForm.controls['startDate'].value, this.reportForm.controls['endDate'].value)
    .subscribe(res=> {console.log(res)}, err=> { console.log(err)}));
  }

  isValidDate(control: FormControl): any {
    if(moment.isMoment(control.value)) {
      return true;
    } else if(moment.isDate(control.value) && !isNaN(control.value.getTime())) {
      return true;
    } else if(moment(control.value).isValid()) {
      return true;
    } else {
      return null;
    }
  }

  setupForm() {
    this.reportForm = new FormGroup({
      startDate: new FormControl(null, [Validators.required, this.isValidDate]),
      endDate: new FormControl(null, [Validators.required, this.isValidDate])
    });
    this.subs.push(this.reportForm.valueChanges.subscribe(value=> {
      console.log(value);
      // if(this.reportForm.valid) this.getTimeByPeriod();
    }));

  }


}
