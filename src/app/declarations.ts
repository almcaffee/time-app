import { AppComponent } from './app.component';
import { LoginComponent } from '@components/login/login.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { CalendarComponent } from '@components/calendar/calendar.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { ReportComponent } from '@components/report/report.component';
import { DayPipe } from '@pipes/day.pipe';

export const AppDeclarations: any[] = [
  AppComponent,
  LoginComponent,
  NavigationComponent,
  CalendarComponent,
  ProfileComponent,
  ReportComponent,
  DayPipe
];

export const EntryComponents: any[] = [

];
