import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'day'
})
export class DayPipe implements PipeTransform {

  transform(value: any, mobile: boolean): any {

    let dayRef: any = {
      Monday: 'Mon',
      Tuesday: 'Tue',
      Wednesday: 'Wed',
      Thursday: 'Thu',
      Friday: 'Fri',
      Saturday: 'Sat',
      Sunday: 'Sun'
    };

    if(mobile) {
      return dayRef[value];
    } else {
      return value;
    }
  }

}
