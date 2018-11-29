import { Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { TimeService } from '@services/time.service';
import { DateService }  from '@services/date.service';
import { AuthService }  from '@services/auth.service';
import { WindowService } from '@services/window.service';
import { Observable, Subscription, timer } from 'rxjs';
import { Month, Day, Profile, DateSelection } from '@models';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: Profile;
  subs: Subscription[];

  constructor(private ts: TimeService,
    private ds: DateService,
    private as: AuthService,
    public ws: WindowService) {
      this.subs = [];
      this.profile = this.as.getProfile();
  }

  ngOnInit() {

  }

}
