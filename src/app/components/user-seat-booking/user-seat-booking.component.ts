import {
    Component,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Output,
    EventEmitter,
    Input,
} from "@angular/core";
import { ModuleidService } from "../../services/moduleid-service";
import * as L from "leaflet";
import * as $ from "jquery";
import { BehaviorSubject } from "rxjs";
import { catchError, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
    selector: "user-seat-booking",
    styleUrls: ["user-seat-booking.component.scss"],
    templateUrl: "user-seat-booking.component.html",
    animations: [
        trigger('slideInOut', [
          state('in', style({
            width: '25%',
            transform: 'translate3d(0,0,0)'
          })),
          state('out', style({
            width: '0px',
            transform: 'translate3d(100%, 0, 0)'
          })),
          transition('in <=> out', animate(300))
        ]),
        trigger('panelInOut', [
            state('open', style({
              width: '25%',
              transform: 'translate3d(0,0,0)'
            })),
            state('close', style({
              width: '0px',
              transform: 'translate3d(100%, 0, 0)'
            })),
            transition('open <=> close', animate(300))
          ]),
      ]
})
export class UserBookSeatComponent implements OnInit, OnDestroy, OnChanges {
    private unsubscribe$ = new Subject<void>();
    @Input()
    mapData;
    @Input()
    rowData;
    @Output()
    goBack = new EventEmitter();
    @Output()
    bookSeat = new EventEmitter();
    polygonArr = [];
    markerArr = [];
    circleObjArr = [];
    selectedSeatObs$ = new BehaviorSubject("");
    selectedWorkstaion = this.selectedSeatObs$.asObservable();
    selectedSeats = {};
    map;
    isCircleChecked: boolean = false;
    userZoomLevel: number = 11;
    myIconUrl: string = "";
    currentMarkerLayer;
    searchState:string = "out";
    rightPanelState:string = "close";
    userSearchVisibility:string = "hidden";
    rightPanelVisibility:string = "hidden";
    rightPanelDisplay:string = "none";
    pdfView:string = "FLOOR_PLAN";
    constructor(
        private leafletService: ModuleidService
    ) {}
    ngOnInit() {}
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    ngOnChanges(changes: SimpleChanges) {
    }

    drawCircle = (chkType) => {
        if (chkType) {
            this.isCircleChecked = true;
            if (this.circleObjArr.length && this.userZoomLevel >= 12) {
                this.circleObjArr.map((circleObj) => {
                    circleObj.addTo(this.map);
                });
            }
        } else {
            this.isCircleChecked = false;
            if (this.circleObjArr.length && this.userZoomLevel >= 12) {
                this.circleObjArr.map((circleObj) => {
                    this.map.removeLayer(circleObj);
                });
            }
        }
    };
    addSelectedSeat = (seatObj) => {
        this.selectedSeats = seatObj;
        this.selectedSeatObs$.next(seatObj["entityType"]["name"]);
    };
    removeSelectedSeat = () => {
        this.selectedSeats = {};
        this.selectedSeatObs$.next("");
    };
    onClickBackBtn() {
        this.goBack.emit("availabilityView");
    }
    bookSelectedSeat() {
        this.selectedSeatObs$.next("");
        this.bookSeat.emit(this.selectedSeats);
    }

    getTranslate(word) {
        let translatedWord = word;
        return translatedWord[word];
    }
     /**animation */
     toggleSearchPanel = () => {
        this.searchState = this.searchState === 'out' ? 'in' : 'out';
        if(this.searchState === 'in'){
            this.userSearchVisibility = "visible"
        }
    }
    hideUserSearch () {
        if(this.searchState === 'out') {
            this.userSearchVisibility = "hidden"
        }
    }
    hideRightPanel() {
        if(this.rightPanelState === 'close'){
            this.rightPanelVisibility = "hidden";
            this.rightPanelDisplay="none";
        }
    }
    closeSlide =() => {
        this.searchState = 'out';
    }
    toggleRightPanel = () => {
        this.rightPanelState = this.rightPanelState === 'close' ? 'open' : 'close';
        if(this.rightPanelState === 'open'){
            this.rightPanelVisibility = "visible";
            this.rightPanelDisplay="block";
        }
    }
    closeRightPanel =() => {
        this.rightPanelState = 'close';
    }
    /**animation */
}
