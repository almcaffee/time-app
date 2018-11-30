import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as timezone from 'moment-timezone';
import { Month, Day, Period, TimeEntry } from '../models';
import { TimeService } from './time.service';
import { AuthService } from './auth.service';
import { Observable, Subscription, timer, of } from 'rxjs';
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

  constructor(private ts: TimeService, private as: AuthService) {
    this.period = [];
    this.time = [];
    this.subs = [];
    this.zone = timezone.tz.guess();
  }

  dateToMoment(value: Date): any {
    return moment(value);
  }

  getTimeEntries(days: Day[], times: TimeEntry[]): Day[] {
    if(times.length) {
      days.forEach(dd=> {
        let ddTime = times.find(te=> te.date === dd.moment.format('YYYY-MM-DD'));
        if(ddTime) {
          if(!dd.time) {
            dd['time'] = [ddTime];
            dd.totalTime = ddTime.hours;
          } else {
            dd.time.push(ddTime);
            dd.totalTime += ddTime.hours;
          }
        }
      });
      return days;
    } else {
      return days;
    }
  }

  getTimesByMonth(days: Day[], first: any, last: any) {
    // return this.getTimeByPeriod(first, last, days)
    // .subscribe(dds=> {
    //   return of({ id: moment(first).month()+1, name: moment(first).format('MMMM'), days: dds, year: moment(first).year() })
    // }, err=> {
    //   return of({ id: moment(first).month()+1, name: moment(first).format('MMMM'), days: days, year: moment(first).year() })
    // });
    return this.ts.getTimeByPeriod(this.as.getProfile().id, first, last)
    .subscribe(res=> {
      let dds = this.getTimeEntries(days, res);
      return { id: moment(first).month()+1, name: moment(first).format('MMMM'), days: dds, year: moment(first).year() };
    }, err=> {
      return { id: moment(first).month()+1, name: moment(first).format('MMMM'), days: days, year: moment(first).year() };
    });
  }

  getTimesByPeriod(days: Day[], first: any, last: any) {
    // return this.getTimeByPeriod(first, last, days)
    // .subscribe(dds=> {
    //    return of({ startDate: first, endDate: last, days: dds });
    // }, err=> {
    //    return of({ startDate: first, endDate: last, days: days });
    // });
    return this.ts.getTimeByPeriod(this.as.getProfile().id, first, last)
    .subscribe(res=> {
      let dds = this.getTimeEntries(days, res);
      return { startDate: first, endDate: last, days: dds };
    }, err=> {
      return { startDate: first, endDate: last, days: days };
    });
  }

  getTimeByPeriod(start: any, end: any, days: Day[]): Observable<Day[]> {
    if(this.as.getProfile()) {
      this.subs.push(this.ts.getTimeByPeriod(this.as.getProfile().id, start, end)
      .subscribe(res=> {
        return this.getTimeEntries(days, res);
      }, err=> {
        return of(days);
      }
     ));
   } else {
     return of(days);
   }
  }

  getWeeks(startDate: any, numWeeks?: number): Observable<Day[]> {
    let days: Day[] = [];
    let startDayOfWeek = moment(startDate).day();
    let firstDayOfWeek = startDayOfWeek > 0 ? moment(startDate).subtract(startDayOfWeek, 'd') : moment(startDate);
    let numDays = numWeeks ? numWeeks*7 : 7;
    for(let i = 0; i < numDays; i++) {
      if(i === 0) { days[i] = this.populateDay(firstDayOfWeek); }
      else { days[i] = this.populateDay(days[i - 1].moment.add(1, 'd')); }
    };
    return of(days);
  }

  getCalendarMonth(startDate: any): Observable<Month> {
    let days: Day[] = [];
    let firstDayOfTheMonth =  moment.isMoment(startDate) ? startDate.startOf('month') : moment(startDate).startOf('month');
    let lastDayOfTheMonth = moment.isMoment(startDate) ? startDate.endOf('month') : moment(startDate).endOf('month');
    let startDayOfMonth = firstDayOfTheMonth.day() > 0 ? firstDayOfTheMonth.subtract(firstDayOfTheMonth.day(), 'd') : firstDayOfTheMonth;
    let endDayOfTheMonth = lastDayOfTheMonth.day() < 6 ? lastDayOfTheMonth.add(6 - lastDayOfTheMonth.day(), 'd') : lastDayOfTheMonth;
    let numDates = endDayOfTheMonth.diff(startDayOfMonth, 'days');
    for(let i = 0; i <= numDates; i++) {
      if(i === 0) { days[i] = this.populateDay(startDayOfMonth); }
      else {
        days[i] = this.populateDay(days[i - 1].moment.add(1, 'd'));
      }
    };
    return this.getTimesByMonth(days, startDayOfMonth, endDayOfTheMonth);
  }

  getMonth(startDate: any): Observable<Month> {
    let days: Day[] = [];
    let firstDayOfTheMonth = moment.isMoment(startDate) ? startDate.startOf('month') : moment(startDate).startOf('month');
    let lastDayOfTheMonth = moment.isMoment(startDate) ? startDate.endOf('month') : moment(startDate).endOf('month');
    // this.getTimeByPeriod(firstDayOfTheMonth, lastDayOfTheMonth);
    let numDates = lastDayOfTheMonth.diff(firstDayOfTheMonth, 'days');
    for(let i = 0; i <= numDates; i++) {
      if(i === 0) { days[i] = this.populateDay(firstDayOfTheMonth); }
      else {
        days[i] = this.populateDay(days[i - 1].moment.add(1, 'd'));
      }
    };
    return this.getTimesByMonth(days, firstDayOfTheMonth, lastDayOfTheMonth);
  }

  getPeriod(startDate: any, endDate: any): Observable<Period> {
    let days: Day[] = [];
    let firstDay = moment.isMoment(startDate) ? startDate : moment(startDate);
    let lastDay = moment.isMoment(endDate) ? endDate : moment(endDate);
    // this.getTimeByPeriod(firstDay, lastDay);
    let numDates = lastDay.diff(firstDay, 'days');
    for(let i = 0; i <= numDates; i++) {
      if(i === 0) { days[i] = this.populateDay(firstDay); }
      else {
        days[i] = this.populateDay(days[i - 1].moment.add(1, 'd'));
      }
    };
    return this.getTimesByPeriod(days, firstDay, lastDay);
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

  populateDay(day: any): Day {
    let mo = day.month() + 1;
    let yr = day.year();
    let ds = yr.toString()+'-'+mo.toString()+'-'+day.date().toString();
    return {
      id: day.day() + 1,
      month: day.month() + 1,
      name: day.format('dddd'),
      day: day.date(),
      moment: moment(ds, "YYYY-MM-DD"),
      year: day.year()
    };
  }

  today(): Day {
    return this.populateDay(moment(new Date()));
  }


}
