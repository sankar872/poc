import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeskBookingComponent } from './desk-booking.component';
import {DeskBookingService} from "./desk-booking.service"
import {
  MatTableModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatInputModule, MatFormFieldModule,
  MatSelectModule, MatButtonModule,
  MatTabsModule, MatIconModule, MatRadioModule, MatAutocompleteModule, MatCardModule
} from "@angular/material";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { Ng5SliderModule } from "ng5-slider";

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatInputModule, MatFormFieldModule,
    MatSelectModule, MatButtonModule,
    MatTabsModule,
    MatIconModule, 
    MatRadioModule, 
    MatAutocompleteModule, 
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    Ng5SliderModule
  ],
  declarations: [DeskBookingComponent],
  exports:[DeskBookingComponent],
  providers:[DeskBookingService]
})
export class DeskBookingModule { }
