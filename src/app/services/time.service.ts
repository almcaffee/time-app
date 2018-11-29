import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile, TimeEntry, TimeCode } from '@models';
import { Observable, Subscription, Subject, of } from 'rxjs';
import * as moment from 'moment';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private API_URL = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  getAllTime(id: any): Observable<TimeEntry[]> {
    return this.http.get<TimeEntry[]>(this.API_URL+'time/id/'+id);
  }

  getAllTimeByDate(date: string): Observable<TimeEntry[]> {
    return this.http.get<TimeEntry[]>(this.API_URL+'time/date/all/'+date);
  }

  getAllTimeByPeriod(startDate: string, endDate: string): Observable<TimeEntry[]> {
    return this.http.get<TimeEntry[]>(this.API_URL+'time/period/start/'+startDate+'/end/'+endDate);
  }

  getTimeByDate(id: any, date: string): Observable<TimeEntry[]> {
    return this.http.get<TimeEntry[]>(this.API_URL+'time/id/'+id+'/date/'+date);
  }

  getTimeByPeriod(id: any, startDate: string, endDate: string): Observable<TimeEntry[]> {
    return this.http.get<TimeEntry[]>(this.API_URL+'time/id/'+id+'/start/'+startDate+'/end/'+endDate);
  }

  getTimeCodes(): Observable<TimeCode[]> {
    return this.http.get<TimeCode[]>(this.API_URL+'time/codes');
  }

}
