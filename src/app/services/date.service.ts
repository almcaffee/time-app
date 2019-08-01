import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as timezone from 'moment-timezone';
import { Month, Day, Period, TimeEntry } from '../models';
import { TimeService } from './time.service';
import { AuthService } from './auth.service';
import { Observable, Subject, Subscription, timer, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  startDate: any;
  endDate: any;
  period: Day[];
  time: TimeEntry[];
  zone: string;
  subs: Subscription[];
  day: any;

  dateClickedSub = new Subject<any>();
  dateClickedSub$ = this.dateClickedSub.asObservable();

  constructor(private ts: TimeService, private as: AuthService) {
    this.period = [];
    this.time = [];
    this.subs = [];
    this.zone = timezone.tz.guess();
  }

  dateToMoment(value: Date): any {
    return moment(value);
  }

  findIndexes(key: any, val: any, arr: any[]): any[] {
    let idxArr = [];
    arr.forEach((item, i)=> {
      if(item[key] === val) idxArr.push(i);
    });
    return idxArr;
  }

  getTimeEntries(days: Day[], times: TimeEntry[]): Day[] {
    if(times.length) {
      days.forEach((dd,i)=> {
        let idxArr = this.findIndexes('date', dd.dateString, times);
        idxArr.forEach(idx=> {
          if(dd.time.indexOf(times[idx]) === -1) {
            dd.time.push(times[idx]);
            dd.totalTime += times[idx].hours;
          }
          if(this.findIndexes('editable', false, dd.time).length) {
            dd.editable = false;
            /* TODO: move editable to backend process */
            // If non-ediable this means previous days are also
            // traverse array up to day before make sure are are set to false
            // for days wih no time
            // for(let idx = 0; idx < i; i++) {
            //   if(!days[i].time.length) days[i].editable = false;
            // }
          }
        });
      });
      return days;
    } else {
      return days;
    }
  }

  getTimeByPeriod(start: any, end: any, days: Day[]): Observable<Day[]> {
    if(this.as.getUser()) {
      this.subs.push(this.ts.getTimeByPeriod(this.as.getUser().id, start, end)
      .subscribe(res=> {
        return of(this.getTimeEntries(days, res));
      }, err=> {
        return of(days);
      }
     ));
   } else {
     return of(days);
   }
  }

  getWeeks(startDate: any, numWeeks?: number): Day[] {
    let days: Day[] = [];
    let startDayOfWeek = moment(startDate).day();
    let firstDayOfWeek = startDayOfWeek > 0 ? moment(startDate).subtract(startDayOfWeek, 'd') : moment(startDate);
    let numDays = numWeeks ? numWeeks*7 : 7;
    return this.populateDays(firstDayOfWeek, numDays);
  }

  getCalendarMonth(startDate: any): Month {
    let ms = new Date(startDate).getTime();
    let firstDayOfTheMonth = moment(ms).startOf('month');
    let lastDayOfTheMonth = moment(ms).endOf('month');
    let startDayOfMonth = firstDayOfTheMonth.day() > 0 ? moment(ms).startOf('month').subtract(firstDayOfTheMonth.day(), 'd') : moment(ms).startOf('month');
    let endDayOfTheMonth = lastDayOfTheMonth.day() < 6 ? moment(ms).endOf('month').add(6 - lastDayOfTheMonth.day(), 'd') : moment(ms).endOf('month');
    let numDates = endDayOfTheMonth.diff(startDayOfMonth, 'days') + 1;
    let thisMonth = {
      id: firstDayOfTheMonth.month()+1,
      name: firstDayOfTheMonth.format('MMMM'),
      days: this.populateDays(startDayOfMonth, numDates),
      year: firstDayOfTheMonth.year()
    };
    thisMonth.days.map(d=> {
      if(d.month !== thisMonth.id) d.editable = false;
    });
    return thisMonth;
  }

  getMonth(startDate: any): Month {
    let firstDayOfTheMonth = moment.isMoment(startDate) ? startDate.startOf('month') : moment(startDate).startOf('month');
    let lastDayOfTheMonth = moment.isMoment(startDate) ? startDate.endOf('month') : moment(startDate).endOf('month');
    let numDates = lastDayOfTheMonth.diff(firstDayOfTheMonth, 'days') + 1;
    return {
      id: firstDayOfTheMonth.month()+1,
      name: firstDayOfTheMonth.format('MMMM'),
      days: this.populateDays(firstDayOfTheMonth, numDates),
      year: firstDayOfTheMonth.year()
    }
  }

  getPeriod(startDate: any, endDate: any): Period {
    let firstDay = moment.isMoment(startDate) ? startDate : moment(startDate);
    let lastDay = moment.isMoment(endDate) ? endDate : moment(endDate);
    let numDates = lastDay.diff(firstDay, 'days') + 1;
    return { startDate: firstDay, endDate: lastDay, days: this.populateDays(firstDay, numDates) };
  }

  isValid(value: any): boolean {
    if(moment.isMoment(value)) {
      return value.isValid();
    } else if(moment.isDate(value)) {
      return !isNaN(value.getTime());
    } else {
      return false;
    }
  }

  momentToDate(value: any): Date {
    return new Date(value.milliseconds());
  }

  populateDay(day: any, editable?: boolean): Day {
    return {
      id: day.day() + 1,
      month: day.month() + 1,
      name: day.format('dddd'),
      day: day.date(),
      dateString: day.format("YYYY-MM-DD"),
      moment: day,
      year: day.year(),
      time: [],
      totalTime: 0,
      editable: editable ? editable : true
    };
  }

  populateDays(first: any, numDays: number): Day[] {
    let days: Day[] = [];
    for(let i = 0; i < numDays; i++) {
      if(i === 0) {
        days[i] = this.populateDay(first);
      } else {
        let dd = first.valueOf() + (1000 * 60 * 60 * 24 * i);
        // Take into account daylight savings time
        days[i] = moment(dd).isDST() ? this.populateDay(moment(dd - (1000 * 60 * 60 * 24))) : this.populateDay(moment(dd));
      }
    };
    return days;
  }

  setActiveDay(day: Day) {
    console.log(day);
    this.day = day;
    this.dateClickedSub.next(this.day);
  }

  today(): Day {
    return this.populateDay(moment(new Date()));
  }


}
