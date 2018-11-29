import { Component, Input, Output, OnInit, AfterViewInit, OnChanges, OnDestroy, ViewChild, SimpleChanges, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { TimeService } from '@services/time.service';
import { DateService }  from '@services/date.service';
import { AuthService }  from '@services/auth.service';
import { WindowService } from '@services/window.service';
import { Observable, Subscription, timer } from 'rxjs';
import { Month, Day, Profile, TimeCode } from '@models';
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
export class TableComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input() startDate: any;
  @Input() endDate: any;
  @Input() actions: boolean;
  @Output() selectedDate = new EventEmitter<DateSelection>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  profile: Profile;
  timeForm: FormGroup;
  codes: TimeCode[];
  days: Day[];
  month: Month;
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

  ngAfterViewInit() {
    this.getPeriod(this.startDate, this.endDate);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes')
    if(changes['startDate'] || changes['endDate']) {
      this.getPeriod(this.startDate, this.endDate);
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
    console.log(sD)
    console.log(eD)
    if(sD && eD && moment.isMoment(sD) && moment.isMoment(eD) && sD.isValid() && eD.isValid() && sD != eD) {
      console.log(sD)
      console.log(eD)
      this.month = this.ds.getPeriod(sD, eD);
      this.cdr.detectChanges();
      this.dataSource = new MatTableDataSource(this.month.days);
      this.cdr.detectChanges();
      timer(200).subscribe(()=>  {
         this.dataSource.paginator = this.paginator;
      });
     }
  }

  getTimeCodes() {
    this.subs.push(this.ts.getTimeCodes()
    .subscribe(codes=> { this.codes = codes }, err => { console.log(err) }));
  }

  /** Gets the total cost of all transactions. */
  getTotalHours() {
    // return this.month.days.map(d => d.time).reduce((acc, value) => acc + value, 0);
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
