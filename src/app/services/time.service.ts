import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from '@models';
import { Observable, Subscription, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private API_URL = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  getAllTime(employeeId: string): Observable<any> {
    return this.http.get<any>(this.API_URL+'time/'+employeeId);
  }

  getTimeByPeriod(startDate: Date, endDate: Date) {
    // this.
  }
}
