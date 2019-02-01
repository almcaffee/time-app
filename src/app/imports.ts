import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatCheckboxModule,
  MatButtonModule,
  MatIconModule,
  MatGridListModule,
  MatToolbarModule,
  MatCardModule,
  MatStepperModule,
  MatDatepickerModule,
  MatRadioModule,
  MatListModule,
  MatChipsModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatTableModule,
  MatTooltipModule,
  MatMenuModule,
  MatSnackBarModule
} from '@angular/material';
import { MomentDateModule, MatMomentDateModule } from '@angular/material-moment-adapter';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { AppRoutes } from './routes';

export const AppImports: any[] = [
  HttpModule,
  HttpClientModule,
  BrowserModule,
  BrowserAnimationsModule,
  ReactiveFormsModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatCheckboxModule,
  MatButtonModule,
  MatIconModule,
  MatGridListModule,
  MatToolbarModule,
  MatCardModule,
  MatStepperModule,
  MatDatepickerModule,
  MatRadioModule,
  MatListModule,
  MatChipsModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatTableModule,
  MatTooltipModule,
  MatMenuModule,
  MomentDateModule,
  MatMomentDateModule,
  MatSnackBarModule,
  RouterModule.forRoot(AppRoutes),
  RecaptchaModule.forRoot(),
  RecaptchaFormsModule
];
