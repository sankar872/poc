import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FloorplanComponent } from './floorplan.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports:[FloorplanComponent],
  declarations: [FloorplanComponent]
})
export class FloorplanModule { }
