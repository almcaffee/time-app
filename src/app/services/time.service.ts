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

  /* TODO: split non-ime crud operations to new service */

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

  getAllDepartments(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL+'departments');
  }

  getDepartment(id: string): Observable<any> {
    return this.http.get<any>(this.API_URL+'department/id/'+id);
  }

  setTimeByDate(entry: TimeEntry): Observable<any> {
    return this.http.post<any>(this.API_URL+'/time', entry);
  }

}
