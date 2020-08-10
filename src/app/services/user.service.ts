import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, Subject } from 'rxjs';
import { LocationCriteria, User } from '@models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  API_URL = environment.api+'/api/users';

  constructor(private http: HttpClient) {}

  createUser(user: User) {
    return this.http.post<User>(this.API_URL, user);
  }

  getUserById(id: any): Observable<User> {
    return this.http.get<User>(this.API_URL+'/'+id);
  }

  getUsersByGroupId(id: any, userId?: any): Observable<User[]> {
    let url = this.API_URL+'/groupId/'+id;
    if(userId) url += '/userId/'+userId;
    return this.http.get<User[]>(url);
  }

  getUsersByOrganizationId(id: any, userId?: any): Observable<User[]> {
    let url = this.API_URL+'/organizationId/'+id;
    if(userId) url += '/userId/'+userId;
    return this.http.get<User[]>(url);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }

  setUserLocation(criteria: LocationCriteria): Observable<User> {
    return this.http.put<User>(this.API_URL+'/location', criteria);
  }

  handleError(err: any) {
    console.log(err)
  }
}
