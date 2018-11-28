import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as timezone from 'moment-timezone';
import { Month, Day, Period, TimeEntry } from '../models';
import { TimeService } from './time.service';
import { AuthService } from './auth.service';
import { Observable, Subscription, timer } from 'rxjs';

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

  getTimeByPeriod(start: any, end: any) {
    if(this.as.getProfile()) {
      this.subs.push(this.ts.getTimeByPeriod(this.as.getProfile().employeeid, start, end)
      .subscribe(res=> { this.time = res; console.log(this.time) }, err=> { console.log(err); this.time =[] }));
    } else {
      this.time =[]
    }
  }

  getWeeks(startDate: any, numWeeks?: number): Day[] {
    let days: Day[] = [];
    let startDayOfWeek = moment(startDate).day();
    let firstDayOfWeek = startDayOfWeek > 0 ? moment(startDate).subtract(startDayOfWeek, 'd') : moment(startDate);
    let weeksDays = numWeeks ? numWeeks*7 : 7;
    for(let i = 0; i < weeksDays; i++) {
      if(i === 0) { days[i] = this.populateDay(firstDayOfWeek); }
      else { days[i] = this.populateDay(days[i - 1].moment.add(1, 'd')); }
    };
    return days;
  }

  getCalendarMonth(startDate: any): Month {
    let days: Day[] = [];
    let firstDayOfTheMonth =  moment.isMoment(startDate) ? startDate.startOf('month') : moment(startDate).startOf('month');
    let lastDayOfTheMonth = moment.isMoment(startDate) ? startDate.endOf('month') : moment(startDate).endOf('month');
    let startDayOfMonth = firstDayOfTheMonth.day() > 0 ? firstDayOfTheMonth.subtract(firstDayOfTheMonth.day(), 'd') : firstDayOfTheMonth;
    let endDayOfTheMonth = lastDayOfTheMonth.day() < 6 ? lastDayOfTheMonth.add(6 - lastDayOfTheMonth.day(), 'd') : lastDayOfTheMonth;
    this.getTimeByPeriod(startDayOfMonth, endDayOfTheMonth);
    let numDates = endDayOfTheMonth.diff(startDayOfMonth, 'days');
    for(let i = 0; i <= numDates; i++) {
      if(i === 0) { days[i] = this.populateDay(startDayOfMonth); }
      else {
        days[i] = this.populateDay(days[i - 1].moment.add(1, 'd'));
      }
    };
    return { id: moment(startDate).month()+1, name: moment(startDate).format('MMMM'), days: days, year: moment(startDate).year()  };
  }

  getMonth(startDate: any): Month {
    let days: Day[] = [];
    let firstDayOfTheMonth = moment.isMoment(startDate) ? startDate.startOf('month') : moment(startDate).startOf('month');
    let lastDayOfTheMonth = moment.isMoment(startDate) ? startDate.endOf('month') : moment(startDate).endOf('month');
    this.getTimeByPeriod(firstDayOfTheMonth, lastDayOfTheMonth);
    let numDates = lastDayOfTheMonth.diff(firstDayOfTheMonth, 'days');
    for(let i = 0; i <= numDates; i++) {
      if(i === 0) { days[i] = this.populateDay(firstDayOfTheMonth); }
      else {
        days[i] = this.populateDay(days[i - 1].moment.add(1, 'd'));
      }
    };
    return { id: moment(startDate).month()+1, name: moment(startDate).format('MMMM'), days: days, year: moment(startDate).year()  };
  }

  getPeriod(startDate: any, endDate: any): Period {
    let days: Day[] = [];
    let firstDay = moment.isMoment(startDate) ? startDate : moment(startDate);
    let lastDay = moment.isMoment(endDate) ? endDate : moment(endDate);
    this.getTimeByPeriod(firstDay, lastDay);
    let numDates = lastDay.diff(firstDay, 'days');
    for(let i = 0; i <= numDates; i++) {
      if(i === 0) { days[i] = this.populateDay(firstDay); }
      else {
        days[i] = this.populateDay(days[i - 1].moment.add(1, 'd'));
      }
    };
    return { startDate: firstDay, endDate: lastDay, days: days  };
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

    return {
      id: day.day() + 1,
      month: day.month() + 1,
      name: day.format('dddd'),
      day: day.date(),
      moment: moment(yr.toString()+'-'+mo.toString()+'-'+day.date().toString(), "YYYY-MM-DD"),
      year: day.year()
    };
  }

  today(): Day {
    return this.populateDay(moment(new Date()));
  }


}
