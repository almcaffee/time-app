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

  findIndexes(dateString: string, times: TimeEntry[]): number[] {
    let idxArr = [];
    times.forEach((t, i)=> {
      if(t.date === dateString) idxArr.push(i);
    });
    return idxArr;
  }

  getTimeEntries(days: Day[], times: TimeEntry[]): Day[] {
    if(times.length) {
      days.forEach(dd=> {
        let idxArr = this.findIndexes(dd.dateString, times);
        idxArr.forEach(idx=> {
          if(dd.time.indexOf(times[idx]) === -1) {
            dd.time.push(times[idx]);
            dd.totalTime += times[idx].hours;
          }
        });
      });
      return days;
    } else {
      return days;
    }
  }

  getTimeByPeriod(start: any, end: any, days: Day[]): Observable<Day[]> {
    if(this.as.getProfile()) {
      this.subs.push(this.ts.getTimeByPeriod(this.as.getProfile().id, start, end)
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
    for(let i = 0; i < numDays; i++) {
      if(i === 0) { days[i] = this.populateDay(firstDayOfWeek); }
      else { days[i] = this.populateDay(days[i - 1].moment.add(1, 'd')); }
    };
    return days;
  }

  getCalendarMonth(startDate: any): Month {
    let ms = new Date(startDate).getTime();
    let days: Day[] = [];
    let firstDayOfTheMonth = moment(ms).startOf('month');
    let lastDayOfTheMonth = moment(ms).endOf('month');
    let startDayOfMonth = firstDayOfTheMonth.day() > 0 ? moment(ms).startOf('month').subtract(firstDayOfTheMonth.day(), 'd') : moment(ms).startOf('month');
    let endDayOfTheMonth = lastDayOfTheMonth.day() < 6 ? moment(ms).endOf('month').add(6 - lastDayOfTheMonth.day(), 'd') : moment(ms).endOf('month');
    let numDates = endDayOfTheMonth.diff(startDayOfMonth, 'days');
    for(let i = 0; i <= numDates; i++) {
      if(i === 0) { days[i] = this.populateDay(startDayOfMonth); }
      else {
        days[i] = this.populateDay(days[i - 1].moment.add(1, 'd'));
      }
    };
    return { id: firstDayOfTheMonth.month()+1, name: firstDayOfTheMonth.format('MMMM'), days: days, year: firstDayOfTheMonth.year() };
  }

  getMonth(startDate: any): Month {
    console.log(startDate)
    let days: Day[] = [];
    let firstDayOfTheMonth = moment.isMoment(startDate) ? startDate.startOf('month') : moment(startDate).startOf('month');
    let lastDayOfTheMonth = moment.isMoment(startDate) ? startDate.endOf('month') : moment(startDate).endOf('month');
    let numDates = lastDayOfTheMonth.diff(firstDayOfTheMonth, 'days');
    for(let i = 0; i <= numDates; i++) {
      if(i === 0) { days[i] = this.populateDay(firstDayOfTheMonth); }
      else {
        days[i] = this.populateDay(days[i - 1].moment.add(1, 'd'));
      }
    };
    return { id: firstDayOfTheMonth.month()+1, name: firstDayOfTheMonth.format('MMMM'), days: days, year: firstDayOfTheMonth.year() }
  }

  getPeriod(startDate: any, endDate: any): Period {
    let days: Day[] = [];
    let firstDay = moment.isMoment(startDate) ? startDate : moment(startDate);
    let lastDay = moment.isMoment(endDate) ? endDate : moment(endDate);
    let numDates = lastDay.diff(firstDay, 'days');
    for(let i = 0; i <= numDates; i++) {
      if(i === 0) { days[i] = this.populateDay(firstDay); }
      else {
        days[i] = this.populateDay(days[i - 1].moment.add(1, 'd'));
      }
    };
    return { startDate: firstDay, endDate: lastDay, days: days };
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
      dateString: day.format("YYYY-MM-DD"),
      moment: moment(ds, "YYYY-MM-DD"),
      year: day.year(),
      time: [],
      totalTime: 0
    };
  }

  today(): Day {
    return this.populateDay(moment(new Date()));
  }


}
