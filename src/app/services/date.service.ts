import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as timezone from 'moment-timezone';
import { Month, Day } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  startDate: any;
  endDate: any;
  period: Day[];
  zone: string;

  constructor() {
    this.period = [];
    this.zone = timezone.tz.guess();
  }

  getWeek(startDate: Date, numWeeks?: number): Day[] {
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

  getMonth(startDate: Date): Month {
    let days: Day[] = [];
    let firstDayOfTheMonth = moment(startDate).startOf('month');
    let lastDayOfTheMonth = moment(startDate).endOf('month');
    let startDayOfMonth = firstDayOfTheMonth.day() > 0 ? firstDayOfTheMonth.subtract(firstDayOfTheMonth.day(), 'd') : firstDayOfTheMonth;
    let endDayOfTheMonth = lastDayOfTheMonth.day() < 6 ? lastDayOfTheMonth.add(6 - lastDayOfTheMonth.day(), 'd') : lastDayOfTheMonth;
    let numDates = endDayOfTheMonth.diff(startDayOfMonth, 'days');
    for(let i = 0; i <= numDates; i++) {
      if(i === 0) { days[i] = this.populateDay(startDayOfMonth); }
      else { days[i] = this.populateDay(days[i - 1].moment.add(1, 'd')); }
    };
    return { id: moment(startDate).month()+1, name: moment(startDate).format('MMMM'), days: days, year: moment(startDate).year()  };
  }

  populateDay(day: any): Day {
    return {
      id: day.day() + 1,
      month: day.month() + 1,
      name: day.format('dddd'),
      day: day.date(),
      moment: day,
      year: day.year()
    };
  }


}
