import { Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { TimeService } from '@services/time.service';
import { DateService }  from '@services/date.service';
import { AuthService }  from '@services/auth.service';
import { WindowService } from '@services/window.service';
import { Observable, Subscription, Subject, timer } from 'rxjs';
import { Month, Day, Profile, DateSelection } from '@models';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  startDate: any;
  endDate: any;
  reportForm: FormGroup;
  profile: Profile;
  subs: Subscription[];
  error: any;
  minDate: Date;
  maxDate: Date;
  getReport: boolean;
  canGetReport: boolean;
  previousFormValue: any;
  view = new Subject<any>();
  viewSub$ = this.view.asObservable();

  constructor(private ts: TimeService,
    private ds: DateService,
    private as: AuthService,
    public ws: WindowService) {
    this.subs = [];
    this.profile = this.as.getUser();
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

  /* Clear memeory of subs on destroy */
  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  /* Get input error message */
  getErrorMessage(control: string) {
    return this.reportForm.controls[control].hasError('required') ? 'Date required' : 'Invalid Date';
  }

  /* Get all time for current profile */
  getTime() {
    this.subs.push(this.ts.getAllTime(this.profile.id)
    .subscribe(res=> {console.log(res)}, err=> { console.log(err)}));
  }

  /* Call api get time */
  getTimeByPeriod() {
    this.subs.push(this.ts.getTimeByPeriod(this.profile.id, this.reportForm.controls['startDate'].value, this.reportForm.controls['endDate'].value)
    .subscribe(res=> {console.log(res)}, err=> { console.log(err)}));
  }

  /* Custome ValidatorFn to test if value required */
  isRequired(control: FormControl): ValidationErrors | null {
    // console.log(control)
    if(control.parent) {
      if(control === control.parent.controls['endDate']) {
        let valid = control.value && control.parent.controls['startDate'].value ? true : false;
        if(valid) {
          return null
        } else {
          return { required: 'End date required' };
        }
      } else {
        return null;
      }
    } else {
      return { invalid: 'Invalid FormGroup' };
    }
  }

  /* Custome ValidatorFn to double check date validity */
  isValidDate(control: FormControl): ValidationErrors | null {
    if(control.value) {
      if(moment.isMoment(control.value)) {
        return null;
      } else if(moment.isDate(control.value) && !isNaN(control.value.getTime())) {
        return null;
      } else if(moment(control.value).isValid()) {
        return null;
      } else {
        return { invalid: 'Invalid date' };
      }
    } else {
      return null;
    }
  }

  /* Create reactive formGroup */
  setupForm() {
    this.reportForm = new FormGroup({
      startDate: new FormControl(null, [this.isRequired, this.isValidDate]),
      endDate: new FormControl(null, [this.isRequired, this.isValidDate])
    });
    // Dont search if dates not changed
    this.reportForm.valueChanges.subscribe(value=> {
      if(this.reportForm.valid && value != this.previousFormValue) {
        this.canGetReport = true;
        this.previousFormValue = value;
      } else {
        this.canGetReport = false;
        this.getReport = false;
      }
      console.log(this.reportForm)
    });
  }

  /* Set min/max for datepickers */
  setDuration(date: any, controlName: string, before?: boolean) {
    if(!this.validateDate(this.reportForm.controls[controlName].value)) {
      let milliDate = parseInt(date.format('x'));
      let duration = 1000*60*60*24*90; // 90 days in milliseconds
      if(before) {
        this.minDate = new Date(milliDate - duration);
      } else {
        this.maxDate = new Date(milliDate + duration).getTime() < new Date().getTime() ? new Date(milliDate + duration) : new Date();
      }
    }
  }

  validateDate(dt: any): ValidationErrors | null {
    if(moment.isMoment(dt)) {
      return null;
    } else if(moment.isDate(dt) && !isNaN(dt.getTime())) {
      return null;
    } else if(moment(dt).isValid()) {
      return null;
    } else {
      return { invalid: 'Invalid date' };
    }
  }

  /* Testing input as subscription */
  // viewReport() {
  //   this.view.next();
  // }

  /* Testing input as boolean */
  viewReport() {
    this.getReport = true;
    this.canGetReport = false;
    timer(500).subscribe(()=> this.getReport = false);
  }

}
