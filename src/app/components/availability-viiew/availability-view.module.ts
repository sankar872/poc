import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartModule } from "angular-highcharts";

import { AvailabilityViewComponent } from "./availability-view.component";
@NgModule({
    imports: [CommonModule, ChartModule],
    declarations: [AvailabilityViewComponent],
    exports: [AvailabilityViewComponent],
})
export class AvailabilityViewModule {}
