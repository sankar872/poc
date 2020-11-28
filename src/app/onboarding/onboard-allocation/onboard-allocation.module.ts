import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatPaginatorModule, MatAutocompleteModule } from "@angular/material";
import { OnboardAllocationComponent } from './onboard-allocation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';


import { AvailabilityViewModule } from "../../components/availability-viiew/availability-view.module";
import { UserSeatBookingModule } from "../../components/user-seat-booking/user-seat-booking.module";
import { UserSeatViewComponent } from "../user-seat-view/user-seat-view.component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatAutocompleteModule,
    MatSelectModule,
    AvailabilityViewModule,
    UserSeatBookingModule
  ],
  declarations: [OnboardAllocationComponent, UserSeatViewComponent],
  exports:[OnboardAllocationComponent],
  providers: [],
  entryComponents: []
})
export class OnboardAllocationModule { }
