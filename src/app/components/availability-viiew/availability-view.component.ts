import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Output,
    EventEmitter,
} from "@angular/core";
//thirdparty component
import * as Highcharts from "highcharts";
import { Chart } from "angular-highcharts";
import * as $ from "jquery";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
    selector: "availability-view",
    styleUrls: ["availability-view.component.scss"],
    templateUrl: "availability-view.component.html",
})
export class AvailabilityViewComponent implements OnInit, OnDestroy, OnChanges {
    @Input()
    buildingArr;
    @Input()
    previousPage;
    @Output()
    showMapToBook = new EventEmitter();
    @Output()
    goBack = new EventEmitter();
    chart;
    highcharts = Highcharts;
    buildingName;
    floorObs$ = new BehaviorSubject<any>([]);
    floors: Observable<any[]> = this.floorObs$.asObservable();
    selectedBuildingObs$ = new BehaviorSubject<any>("");
    selectedBuildingId = this.selectedBuildingObs$.asObservable();
    constructor() {}
    ngOnInit() {}
    ngOnDestroy() {}
    ngOnChanges(changes: SimpleChanges) {
        if (this.buildingArr) {
            this.floorObs$.next([]);
            this.selectedBuildingObs$.next("");
            this.drawChart();
        }
    }
    drawChart = () => {
        const currentContext = this;
        this.chart = new Chart({
            chart: {
                type: "column",
            },
            title: {
                text: "Availability in buildings",
            },
            credits: {
                enabled: false,
            },
            accessibility: {
            },
            xAxis: {
                type: "category",
                title: {
                    text: "BUILDINGS",
                },
            },
            yAxis: {
                title: {
                    text: "AVAILABILITY (IN 100)",
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: "bold",
                        color: "#132e74",
                    },
                },
            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                column: {
                    pointWidth: 40,
                    //pointPadding: 5
                },
                series: {
                    dataLabels: {
                        enabled: true,
                        format: "{point.y}",
                    },
                    point: {
                        events: {
                        },
                    },
                },
            },

            tooltip: {
                headerFormat:
                    '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat:
                    '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>',
            },
            series: [
                {
                    name: "Browsers",
                    data: this.buildingArr,
                    type: undefined,
                },
            ],
        });
    };
    getFloorlist = (floorData, buildingId) => {
        this.selectedBuildingObs$.next(buildingId);
        this.floorObs$.next(floorData);
        this.floors.subscribe((res) => {
        });
    };
    onSelectFloor = (floorData) => {
        this.showMapToBook.emit(floorData);
    };
    onClickBackBtn() {
        this.goBack.emit(this.previousPage);
    }
    getTranslate(word) {
        let translatedWord = word;
        return translatedWord[word];
    }
}
