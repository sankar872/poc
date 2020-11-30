import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardAnalyticsRoutingModule } from './onboard-analytics-routing.module';
import { OnboardAnalyticsComponent } from './onboard-analytics.component';
import { MapActionIconsModule } from "../components/map-action-icons/map-action-icons.module";
import { UserSearchViewComponent } from "../components/user-search/user-search-view/user-search-view.component";
import { Ng5SliderModule } from "ng5-slider";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import {MatSelectModule} from '@angular/material';
import {MatRadioModule} from '@angular/material';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    OnboardAnalyticsRoutingModule,
    MapActionIconsModule,
    Ng5SliderModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    MatSelectModule,
    MatRadioModule,
    FormsModule
  ],
  declarations: [OnboardAnalyticsComponent,UserSearchViewComponent],
  exports:[OnboardAnalyticsComponent, UserSearchViewComponent],
})
export class OnboardAnalyticsModule { }
