import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HighchartsChartModule } from "highcharts-angular";
import { ChartModule } from "angular-highcharts";

import { AvailabilityViewComponent } from "./availability-view.component";
@NgModule({
    imports: [CommonModule, HighchartsChartModule, ChartModule],
    declarations: [AvailabilityViewComponent],
    exports: [AvailabilityViewComponent],
})
export class AvailabilityViewModule {}
