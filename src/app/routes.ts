import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from '@components/login/login.component';
import { CalendarComponent } from '@components/calendar/calendar.component';
import { LoginGuard } from '@guards/login.guard';
import { ProfileComponent } from '@components/profile/profile.component';
import { ReportComponent } from '@components/report/report.component';

export const AppRoutes: Routes = [
  {
    path: '*',
    component: LoginComponent
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'calendar/weeks/:startDate/:numWeeks',
    component: CalendarComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'calendar/week/:startDate',
    component: CalendarComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'calendar/month/:startDate',
    component: CalendarComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'report/week/:startDate',
    component: ReportComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'report/month/:startDate',
    component: ReportComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'report',
    component: ReportComponent,
    canActivate: [LoginGuard]
  },
  {
    path: '**',
    component: LoginComponent
  }
];
