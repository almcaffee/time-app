import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { HttpRequestInterceptor } from './core/http/request-interceptors';
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { AuthService } from '@services/auth.service';
import { DateService } from '@services/date.service';
import { TimeService } from '@services/time.service';
import { WindowService } from '@services/window.service';

export const AppProviders: any[] = [
  AuthService,
  DateService,
  TimeService,
  WindowService,
  // {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: HttpRequestInterceptor,
  //   multi: true
  // },
  {
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: '6Lf5KmYUAAAAAIpRlOFWK9MbCYZO8jAV9sWY4RVd',
    } as RecaptchaSettings
}];
