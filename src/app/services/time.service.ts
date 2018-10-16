import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile, TimeEntry } from '@models';
import { Observable, Subscription, Subject, of } from 'rxjs';
import * as moment from 'moment';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private API_URL = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  getAllTime(employeeId: any): Observable<TimeEntry[]> {
    return this.http.get<TimeEntry[]>(this.API_URL+'time/id/'+employeeId);
  }

  getTimeByPeriod(id: any, startDate: any, endDate: any): Observable<TimeEntry[]> {
    let postBody = { id: id, startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD') };
    return this.http.post<TimeEntry[]>(this.API_URL+'time/period', postBody);
  }
}
