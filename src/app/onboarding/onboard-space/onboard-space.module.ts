import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, 
         MatPaginatorModule, 
         MatAutocompleteModule, 
         MatSort, 
         MatSlideToggleModule } from "@angular/material";
import { OnboardSpaceComponent } from './onboard-space.component';
import { OnboardingService } from '../../services/onboarding.service';
import { MapActionIconsModule } from "../../components/map-action-icons/map-action-icons.module"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
@NgModule({
  imports: [
    CommonModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatAutocompleteModule,
    MatSlideToggleModule,
    MapActionIconsModule,
    BrowserAnimationsModule
  ],
  declarations: [OnboardSpaceComponent],
  exports:[OnboardSpaceComponent],
  providers:[
    OnboardingService
  ]
})
export class OnboardSpaceModule { }