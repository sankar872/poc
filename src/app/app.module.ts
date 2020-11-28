import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations"

import { ReactiveFormsModule, FormsModule } from "@angular/forms";

//component
import { AppComponent } from './app.component';

//module
import { DeskBookingModule } from "./desk-booking/desk-booking.module";

import {AppService} from "./app.service";
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DeskBookingModule,
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
