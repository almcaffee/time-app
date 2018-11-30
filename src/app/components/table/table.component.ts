import { Component, Input, Output, OnInit, AfterViewInit, OnChanges, OnDestroy, ViewChild, SimpleChanges, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { TimeService } from '@services/time.service';
import { DateService }  from '@services/date.service';
import { AuthService }  from '@services/auth.service';
import { WindowService } from '@services/window.service';
import { Observable, Subscription, timer } from 'rxjs';
import { Month, Day, Profile, TimeCode, Period } from '@models';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { DateSelection } from '@models';
import * as moment from 'moment';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() startDate: any;
  @Input() endDate: any;
  @Input() actions: boolean;
  @Input() card: boolean;
  @Input() view: boolean;
  @Input() search: Subscription;
  @Output() selectedDate = new EventEmitter<DateSelection>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  profile: Profile;
  timeForm: FormGroup;
  codes: TimeCode[];
  days: Day[];
  period: Period;
  subs: Subscription[];
  dataSource: MatTableDataSource<object>;
  displayedColumns: string[] = ['weekDay', 'date', 'code', 'time'];

  constructor(private rt: Router,
    private ar: ActivatedRoute,
    private ts: TimeService,
    private ds: DateService,
    private as: AuthService,
    public ws: WindowService,
    private cdr: ChangeDetectorRef) {
    this.codes = [];
    this.subs = [];
    this.profile = this.as.getProfile();
    this.getTimeCodes();
    if(!this.profile) { this.as.authSub$.subscribe(profile=> this.profile = profile) }
  }

  ngOnInit() {
    if(this.actions) {
      this.pushActions();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['view'] && changes['view'].currentValue) {
      if(this.startDate && this.endDate) {
        this.getPeriod(this.startDate, this.endDate);
      }
    }
    if(changes['actions']) {
      if(changes['actions'].currentValue) {
        this.pushActions();
      } else {
        this.removeActions();
      }
    }
  }

  /* Clear memeory of subs on destroy */
  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  emit(action: string, dt: any) {
    this.selectedDate.emit({action: action, date: dt, type: 'moment'});
  }

  getPeriod(sD: any, eD: any) {
    if(sD && eD && moment.isMoment(sD) && moment.isMoment(eD) && sD.isValid() && eD.isValid() && sD != eD) {
      this.subs.push(this.ts.getTimeByPeriod(this.as.getProfile().id, sD.format('x'), eD.format('x'))
      .subscribe(res=> {
        let period = this.ds.getPeriod(sD, eD);
        period.days = this.ds.getTimeEntries(period.days, res);
        this.period = period;
        this.dataSource = new MatTableDataSource(this.period.days);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
      }, err=> {
        console.log(err)
      }));
     }
  }

  getTimeCodes() {
    this.subs.push(this.ts.getTimeCodes()
    .subscribe(codes=> { this.codes = codes }, err => { console.log(err) }));
  }

  /** Gets the total cost of all transactions. */
  getTotalHours() {
    return this.period.days.map(d => d.totalTime).reduce((acc, value) => acc + value, 0);
  }

  pushActions() {
    let aIdx = this.displayedColumns.indexOf('actions');
    if(aIdx === -1) this.displayedColumns.push('actions');
  }

  removeActions() {
    let aIdx = this.displayedColumns.indexOf('actions');
    if(aIdx > -1) this.displayedColumns.splice(aIdx, 1);
  }
}
