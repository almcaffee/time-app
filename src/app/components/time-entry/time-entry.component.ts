import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TimeService } from '@services/time.service';
import { DateService }  from '@services/date.service';
import { AuthService }  from '@services/auth.service';
import { WindowService } from '@services/window.service';
import { Observable, Subscription, timer } from 'rxjs';
import { Month, Day, Profile, DateSelection, TimeEntry } from '@models';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { DialogService } from '@services/dialog.service';

@Component({
  selector: 'app-time-entry',
  templateUrl: './time-entry.component.html',
  styleUrls: ['./time-entry.component.scss']
})
export class TimeEntryComponent implements OnInit, OnChanges, OnDestroy {

  @Input() date: any;
  timeForm: FormGroup;
  subs: Subscription[] = [];
  user: Profile;
  entry: TimeEntry;
  err: boolean;

  constructor(private _ts: TimeService,
    private _as: AuthService,
    private _ds: DateService,
    public ws: WindowService) { }

  ngOnInit() {
    this.user = this._as.getUser();
    this.setupForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['date'].currentValue && changes['date'].currentValue !== changes['date'].previousValue) {
      console.log(this.date)
      this.populateForm();
    }
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
    this.timeForm = null;
  }

  populateForm() {
    if (this.date && this.date.totalTime && this.timeForm) {
      const timeArr = this.date.totalTime.toString().split('.');
      const hhControl = this.timeForm.get('hh');
      hhControl.patchValue(parseInt(timeArr[0]));
      if (timeArr[1]) {
        const mmControl = this.timeForm.get('mm');
        mmControl.patchValue((parseInt(timeArr[1])*.6).toPrecision(2));
      }
    }
  }

  saveTime(entry: TimeEntry) {
    this._ts.setTimeByDate(entry).subscribe(res => {
      console.log(res)
    }, err => this.err = true);
  }

  setupForm() {
    this.timeForm = new FormGroup({
      hh: new FormControl(null, [Validators.minLength(1), Validators.maxLength(2), Validators.pattern(/[0-9]/)]),
      mm: new FormControl(null, [Validators.minLength(1), Validators.maxLength(2), Validators.pattern(/[0-9]/)]),
      timeCode: new FormControl(null, [Validators.required, Validators.maxLength(3), Validators.minLength(3)])
    });
    this.populateForm();
    this.subs.push(this.timeForm.valueChanges.subscribe(value => {
      if (this.timeForm.valid) {
        this.saveTime(this.setUpTimeEntry(value));
      } else {
        console.log(this.timeForm);
        console.log('invalid');
      }
    }));
  }

  setFormValue(res: any) {
    const timeString = res.hours.toString();
    const timeArr = timeString.split('.');
    const hh = timeArr[0].length ? parseInt(timeArr[0], 10) : 0;
    const mm = timeArr[1] ? parseInt(timeArr[1], 10) : 0;
    this.timeForm.patchValue({ hh: hh, mm: mm, timeCode: res.timeCode });
  }

  setUpTimeEntry(data: any): TimeEntry {
    return {
      date: this.date,
      timeCode: data.timeCode,
      hours: data.hh + (data.mm / 60),
      profileId: this.user.id,
      updaterId: this.user.id
    };
  }

}
