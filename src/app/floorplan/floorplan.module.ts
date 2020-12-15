import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { FloorplanComponent } from './floorplan.component';


import { LeafletService } from "../services/onboard-leaflet.service";
import { OnboardingService } from '../services/onboarding.service';
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
  imports: [
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
    CommonModule,
    HttpClientModule
  ],
  providers: [
    LeafletService,
    OnboardingService
  ],
  exports:[FloorplanComponent],
  declarations: [FloorplanComponent]
})
export class FloorplanModule { }
