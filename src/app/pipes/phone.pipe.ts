import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(value: any, args?: any): any {

    let ac = value.substr(0,3),
    pf = value.substr(3,3),
    ld = value.substr(6,4);

    return '('+ac+') ' + pf + '-' +ld;
  }

}
