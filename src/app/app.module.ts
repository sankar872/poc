import { HttpModule } from '@angular/http';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonService } from "./services/common-service.service";
import { OnboardingService } from './services/onboarding.service';
import { AppComponent } from './app.component';
import { OnboardingModalComponent } from './onboarding/modal/onboarding-modal/onboarding-modal.component';
import { environment } from "../environments/environment";
import { ModuleidService } from "./services/moduleid-service";
import { LoaderComponent } from "./shared/modules/loader/loader.component";
import { LoaderService } from "./shared/modules/loader/loader.service";
import { CustomLoaderComponent } from "./shared/modules/custom-loader/custom-loader.component";
import { CustomLoaderService } from "./shared/modules/custom-loader/custom-loader.service";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService, ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ConfirmationDialogService } from "./shared/confirmation-dialog/confirmation-dialog.service";
import { ConfirmationDialogComponent } from "./shared/confirmation-dialog/confirmation-dialog.component";
import { LeafletService } from "./services/onboard-leaflet.service";

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
  MatSliderModule
} from "@angular/material";
import { OnboardAllocationModule } from '../app/onboarding/onboard-allocation/onboard-allocation.module';
import { OnboardSpaceModule } from '../app/onboarding/onboard-space/onboard-space.module';
//module
import { DeskBookingModule } from "./desk-booking/desk-booking.module"


@NgModule({
  declarations: [
    AppComponent,
    OnboardingModalComponent,
    LoaderComponent,
    CustomLoaderComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    HttpModule,
    HttpClientModule,
    BrowserModule,
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
    NgbModule.forRoot(),
    ToastrModule.forRoot(),
    OnboardAllocationModule,
    BrowserAnimationsModule,
    OnboardSpaceModule,
    DeskBookingModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: "BASE_URL", useFactory: getBaseUrl },
    CommonService,
    OnboardingService,
    ModuleidService,
    LoaderService,
    CustomLoaderService,
    ToastrService,
    ConfirmationDialogService,
    LeafletService
    
  ],
  entryComponents: [ConfirmationDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function getBaseUrl() {
  return environment.BASE_URL_SPACE;
}
