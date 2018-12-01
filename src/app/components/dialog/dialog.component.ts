import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TimeService } from '@services/time.service';
import { DateService }  from '@services/date.service';
import { AuthService }  from '@services/auth.service';
import { WindowService } from '@services/window.service';
import { Observable, Subscription, timer } from 'rxjs';
import { Month, Day, Profile, DateSelection, TimeEntry } from '@models';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {

  data: any;
  changed: boolean;
  payCodes: any[] = [];
  subs: Subscription[] = [];
  timeForm: FormGroup;
  photoForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private ts: TimeService,
    private ds: DateService,
    private as: AuthService,
    public ws: WindowService) {
      this.data = data;
      console.log(this.data)
  }

  ngOnInit() {
    switch(this.data.dialogType) {
      case 'photo': this.setupPhotoForm();
        break;
      case 'time': this.setupTimeForm();
        break;
    }
  }

  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  continue(continueAction: boolean, args?: any) {
    let data: any = args ? Object.assign({}, { continue: continueAction }, args) : { continue: continueAction };
    this.dialogRef.close(data);
  }

  objectChanged(obj1: any, obj2: any) {
    let changed: boolean = false;
    Object.keys(obj1).forEach(k=> {
      if(!obj2[k] || obj1[k] != obj2[k]) {
        changed = true;
      }
    });
    this.changed = changed;
  }

  savePhoto() {
    this.continue(true, { photo: this.photoForm.value });
  }

  saveTime() {
    this.continue(true, { photo: this.photoForm.value });
  }

  setupPhotoForm() {

  }

  setupTimeForm() {

  }

   print() {
     window.print();
   }

}
