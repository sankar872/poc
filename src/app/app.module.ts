import { HttpModule } from '@angular/http';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { OnboardingService } from './services/onboarding.service';
import { CommonModule } from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations"

import { ReactiveFormsModule, FormsModule } from "@angular/forms";

//component
import { AppComponent } from './app.component';
import { OnboardingModalComponent } from './onboarding/modal/onboarding-modal/onboarding-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from "./shared/confirmation-dialog/confirmation-dialog.service";
import { ConfirmationDialogComponent } from "./shared/confirmation-dialog/confirmation-dialog.component";


import { DeskBookingModule } from "./desk-booking/desk-booking.module";
import { FloorplanModule } from "./floorplan/floorplan.module";

import {AppService} from "./app.service";
import {
  MatDialogModule,
  MatCardModule,
  MatCheckboxModule,
  MatOptionModule,
  MatSelectModule,
  MatButtonModule,
  MatRadioModule,
  MatInputModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatIconModule,
  MatTooltipModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDividerModule,
  MatChipsModule,
  MatPaginatorModule,
  MatAutocompleteModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatSliderModule,
} from "@angular/material";

@NgModule({
  declarations: [
    AppComponent,
    OnboardingModalComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    HttpModule,
    HttpClientModule,
    BrowserModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    DeskBookingModule,
    FloorplanModule,
    FormsModule,
    MatDialogModule,
  MatCardModule,
  MatCheckboxModule,
  MatOptionModule,
  MatSelectModule,
  MatButtonModule,
  MatRadioModule,
  MatInputModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatIconModule,
  MatTooltipModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDividerModule,
  MatChipsModule,
  MatPaginatorModule,
  MatAutocompleteModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatSliderModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: "BASE_URL", useFactory: getBaseUrl },
    OnboardingService,
    ConfirmationDialogService,
    AppService
  ],
  entryComponents: [ConfirmationDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function getBaseUrl() {
  return '';
}
