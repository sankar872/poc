import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeskBookingComponent } from './desk-booking.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DeskBookingComponent],
  exports:[DeskBookingComponent]
})
export class DeskBookingModule { }
