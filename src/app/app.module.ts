import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

//module
import { DeskBookingModule } from "./desk-booking/desk-booking.module"


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DeskBookingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
