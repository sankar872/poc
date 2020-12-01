import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  FormArray,
  FormControl,
} from "@angular/forms";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

import {
  BookingRequestObject,
  departmentObj,
  userObj,
} from "./models/desk-booking.interface";
import { DeskBookingService } from "./desk-booking.service";
import { Options } from "ng5-slider";

declare const $;
import * as L from "leaflet";
import "leaflet-draw";
import {
  catchError,
  debounce,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  tap,
} from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { of } from "rxjs/observable/of";
import { getTimeStamp } from "./utils";

@Component({
  selector: "app-desk-booking",
  templateUrl: "./desk-booking.component.html",
  styleUrls: ["./desk-booking.component.scss"],
  animations: [
    trigger("panelInOut", [
      state(
        "open",
        style({
          width: "320px",
          transform: "translate3d(0,0,0)",
        })
      ),
      state(
        "close",
        style({
          width: "0px",
          transform: "translate3d(100%, 0, 0)",
        })
      ),
      transition("open <=> close", animate(300)),
    ]),
  ],
})
export class DeskBookingComponent implements OnInit, OnChanges {
  @Input()
  bookingType;
  @Input()
  mapData;
  @Input()
  bookingRequestObj: BookingRequestObject;
  @Input()
  depAutocompleteList: departmentObj;
  @Input()
  empAutocompleteList: userObj;
  @Output()
  onBookingEntityChange = new EventEmitter<BookingRequestObject>();
  @Output()
  onBookingError = new EventEmitter<any>();
  @Output()
  getUserAutocomplete = new EventEmitter<any>();
  @Output()
  onSubmit = new EventEmitter<any>();
  tilesData;
  userZoomLevel: number = 11;
  map: L.Map;
  selectedSeats: any[] = [];
  markerIcon = "./assets/images/checked.svg";
  objectKeys = Object.keys;
  currentFloorAddress = "";
  rightPanelState: string = "open";
  userSearchVisibility: string = "none";
  rightPanelVisibility: string = "visible";
  rightPanelDisplay: string = "block";
  bookingDate: any[] = [];

  employeeSearch: FormControl;
  sliderColor: string = "#0F1F54";
  sliderMinValue: number = 1;
  sliderMaxValue: number = 49;
  sliderLabel = [
    "00:00 hrs",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    "23:59 hrs",
  ];
  options: Options = {
    animate: true,
    showSelectionBar: true,
    getPointerColor: (value: number): string => {
      return "#0F1F54";
    },
    getSelectionBarColor: (minValue: number): string => {
      return "#0F1F54";
    },
    stepsArray: [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 6 },
      { value: 7 },
      { value: 8 },
      { value: 9 },
      { value: 10 },
      { value: 11 },
      { value: 12 },
      { value: 13 },
      { value: 14 },
      { value: 15 },
      { value: 16 },
      { value: 17 },
      { value: 18 },
      { value: 19 },
      { value: 20 },
      { value: 21 },
      { value: 22 },
      { value: 23 },
      { value: 24 },
      { value: 25 },
      { value: 26 },
      { value: 27 },
      { value: 28 },
      { value: 29 },
      { value: 30 },
      { value: 31 },
      { value: 32 },
      { value: 33 },
      { value: 34 },
      { value: 35 },
      { value: 36 },
      { value: 37 },
      { value: 38 },
      { value: 39 },
      { value: 40 },
      { value: 41 },
      { value: 42 },
      { value: 43 },
      { value: 44 },
      { value: 45 },
      { value: 46 },
      { value: 47 },
      { value: 48 },
      { value: 49 },
    ],
    translate: (value: number): string => {
      return this.sliderLabel[value - 1];
    },
  };

  empSearchTermSub$ = new BehaviorSubject("");
  empSearchTermAction$ = this.empSearchTermSub$.asObservable();
  selectedSeatMarkerLayer: any[] = [];
  seatCoordinatesArr: any[] = [];
  markerLayerMap = new Map();

  constructor(
    private formBuilder: FormBuilder,
    private bookingService: DeskBookingService
  ) {}

  ngOnInit() {
    this.employeeSearch = new FormControl();
    this.empSearchTermAction$
      .pipe(
        filter((res) => !!res),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        if (res.length > 2) {
          this.getUserAutocomplete.emit(res);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["bookingRequestObj"]) {
      console.log("change", changes["bookingRequestObj"])
      this.bookingRequestObj = changes["bookingRequestObj"]["currentValue"];
      if (!!this.bookingRequestObj) {
        let startDate = new Date(this.bookingRequestObj.startTime);
        let endDate = new Date(this.bookingRequestObj.endTime);
        this.bookingDate = [startDate, endDate];
      }
    }
    if (changes["bookingType"]) {
      this.bookingType = changes["bookingType"]["currentValue"];
    }
    if (changes["mapData"]) {
      this.mapData = changes["mapData"]["currentValue"];
      if (typeof this.mapData["value"] != "undefined") {
        this.getTilesData();
      }
    }
    if (changes["empAutocompleteList"]) {
      this.empAutocompleteList = changes["empAutocompleteList"]["currentValue"];
    }
  }
  getTilesData() {
    let request = {
      request: {
        requestDetails: {
          endTime: this.bookingRequestObj["endTime"],
          recurringEndTime: this.bookingRequestObj["recurringEndTime"],
          recurringStartTime: this.bookingRequestObj["recurringStartTime"],
          startTime: this.bookingRequestObj["startTime"],
          userId: this.bookingRequestObj["userId"],
          zoneId: this.bookingRequestObj["zoneId"],
        },
      },
      zoneId: 257,
    };
    this.bookingService.getMapData(request).subscribe(
      (res) => {
        this.tilesData = res;
        this.showMap();
      },
      (err) => {
        this.sendErrorReport(err);
      }
    );
  }

  showMap() {
    if (this.map) {
      this.map.remove();
    }
    this.map = L.map("map", {
      minZoom: 10,
      maxZoom: 14,
      attributionControl: false,
    }).setView([0.25, 0.5], this.userZoomLevel);
    /*Setting map not going out of the bounds*/
    var southWest = L.latLng(-0.1, -0.1),
      northEast = L.latLng(1.1, 1.1);
    var bounds = L.latLngBounds(southWest, northEast);

    this.map.setMaxBounds(bounds);
    /*Setting map not going out of the bounds*/
    let tileUrl = `${this.tilesData.tileUrl}{z}/{x}/{y}.png`;
    let tileObj = L.tileLayer(tileUrl, {
      maxZoom: 14,
      attribution: "",
      id: "",
    });
    tileObj.addTo(this.map);
    this.map.on("zoomend", async (res) => {
      this.userZoomLevel = this.map.getZoom();
      var newzoom = "" + 4 * this.map.getZoom() + "px";
      let iconSizeX = 32;
      let iconSizeY = 37;
      if (this.map.getZoom() <= 10) {
        iconSizeX = 10;
        iconSizeY = 15;
        $(".leaflet-marker-icon").css({
          width: newzoom,
          height: newzoom,
          "margin-left": "-10px",
          "margin-top": "-10px",
        });
        $(".leaflet-tooltip.my-labels").css("font-size", 0);
      } else {
        $(".leaflet-marker-icon").css({
          width: 32,
          height: 37,
          "margin-left": "-16px",
          "margin-top": "-17px",
        });
        if (this.map.getZoom() >= 14) {
          iconSizeX = 32;
          iconSizeY = 37;
          $(".leaflet-tooltip.my-labels").css({
            "font-size": 15,
            "-webkit-text-stroke": "1px black",
            "margin-top": "26px",
          });
        } else if (this.map.getZoom() === 11) {
          iconSizeX = 16;
          iconSizeY = 19;
          $(".leaflet-tooltip.my-labels").css({
            "font-size": "5px",
            "-webkit-text-stroke": "0.8px black",
            "margin-top": "2px",
          });
        } else if (this.map.getZoom() === 12) {
          iconSizeX = 19;
          iconSizeY = 22;
          $(".leaflet-tooltip.my-labels").css({
            "font-size": "8px",
            "-webkit-text-stroke": "0.8px black",
            "margin-top": "2px",
          });
        } else {
          iconSizeX = 22;
          iconSizeY = 27;
          $(".leaflet-tooltip.my-labels").css({
            "font-size": 13,
            "-webkit-text-stroke": "1px black",
            "margin-top": "15px",
          });
        }
      }
      let myIcon = L.icon({
        iconUrl: this.markerIcon,
        iconSize: [iconSizeX, iconSizeY],
        iconAnchor: [iconSizeY, iconSizeY],
        popupAnchor: [0, -28],
      });
      if (this.selectedSeatMarkerLayer.length > 0) {
        this.selectedSeatMarkerLayer.forEach((ele) => {
          console.log(ele);

          ele.marker.setIcon(myIcon);
        });
      }

      //   if(this.userZoomLevel >= 13){
      // await this.drawSeatsOnMap(this.map);
      //   }
    });
    this.drawpolygon(this.map);
    if (this.bookingType !== "employee") {
      var drawnItems = new L.FeatureGroup();
      this.map.addLayer(drawnItems);
      var drawControl = new L.Control.Draw({
        draw: {
          rectangle: {
            shapeOptions: {
              stroke: true,
              weight: 4,
              opacity: 0.5,
              fill: false,
              fillColor: null,
              fillOpacity: 0.2,
              color: "#3388ff",
            },
            metric: false,
          },
          polygon: false,
          polyline: false,
          circle: false,
          marker: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawnItems,
          edit: false,
        },
      });
      this.map.addControl(drawControl);
      this.map.on("draw:created", (e) => {
        var type = e["layerType"];
        var layer = e["layer"];
        drawnItems.addLayer(layer);
        if (type === "rectangle") {
          let coordinates = layer.getLatLngs();
          var bounds = layer.getBounds();
          var diagonal = [bounds.getNorthWest(), bounds.getSouthEast()];
          var diagonalObj = diagonal.map(
            ({ lat: yCoordinate, lng: xCoordinate }) => ({
              yCoordinate,
              xCoordinate,
            })
          );
          this.availableEntitiesInArea(diagonalObj);
        }
      });
    }
  }
  availableEntitiesInArea(diagonal) {
    let reqObj = {
      pointA: diagonal[0],
      pointB: diagonal[1],
      request: {
        requestDetails: {
          startTime: this.bookingRequestObj.startTime,
          endTime: this.bookingRequestObj.endTime,
        },
      },
      floorId: 257,
    };
    this.bookingService
      .availableEntitiesInArea(reqObj, 5)
      .pipe(
        catchError((err) => {
          return of([]);
        })
      )
      .subscribe((res) => {
        if (res.length) {
          console.log(res);
          res.forEach((element) => {
            let seatObj = this.markerLayerMap.get(element.id);
            console.log("seatObj", seatObj);
            if (!!seatObj) {
              this.addSelectedSeat(seatObj.element, seatObj.marker);
              this.map.addLayer(seatObj.marker);
            }
          });
        }
      });
  }
  drawpolygon(map) {
    this.markerLayerMap = new Map();
    let i = 0;
    const circleRadius = this.mapData["circleRadius"];
    const availableColor = this.mapData["colorLegend"]["availableEntities"];
    const occupiedColor = this.mapData["colorLegend"]["occupiedEntities"];
    const reservedColor = this.mapData["colorLegend"][
      "departmentReservedEntities"
    ];
    const socialDistancedColor = this.mapData["colorLegend"][
      "socialDistancedEntities"
    ];

    let myIcon = L.icon({
      iconUrl: this.markerIcon,
      iconSize: [16, 19],
      iconAnchor: [16, 17],
      popupAnchor: [0, -28],
    });
    map.eachLayer(function (layer) {
      if (i !== 0) {
        map.removeLayer(layer);
      }
      i++;
    });
    this.seatCoordinatesArr = [];
    if (
      typeof this.tilesData["value"]["availableEntities"] !== "undefined" &&
      !!this.tilesData["value"]["availableEntities"]
    ) {
      this.seatCoordinatesArr = [
        ...this.seatCoordinatesArr,
        ...this.tilesData["value"]["availableEntities"],
      ];
    }
    if (
      typeof this.tilesData["value"]["occupiedEntities"] !== "undefined" &&
      !!this.tilesData["value"]["occupiedEntities"]
    ) {
      this.seatCoordinatesArr = [
        ...this.seatCoordinatesArr,
        ...this.tilesData["value"]["occupiedEntities"],
      ];
    }
    if (
      typeof this.tilesData["value"]["socialDistancedEntities"] !==
        "undefined" &&
      !!this.tilesData["value"]["socialDistancedEntities"]
    ) {
      this.seatCoordinatesArr = [
        ...this.seatCoordinatesArr,
        ...this.tilesData["value"]["socialDistancedEntities"],
      ];
    }
    if (
      typeof this.tilesData["value"]["departmentReservedEntities"] !==
        "undefined" &&
      !!this.tilesData["value"]["departmentReservedEntities"]
    ) {
      this.seatCoordinatesArr = [
        ...this.seatCoordinatesArr,
        ...this.tilesData["value"]["departmentReservedEntities"],
      ];
    }
    if (!!this.seatCoordinatesArr && this.seatCoordinatesArr.length) {
      this.seatCoordinatesArr.forEach((seatData) => {
        /** */
        let polygonColor = "#008000";
        let isSeatColorset = false;
        let currentSeat;
        let isSeatAvailorReserved = "";
        if (
          typeof this.mapData["value"]["availableEntities"] !== "undefined" &&
          !!this.mapData["value"]["availableEntities"]
        ) {
          currentSeat = this.mapData["value"]["availableEntities"].filter(
            (seat) => {
              if (seat.displayName === seatData.displayName) {
                polygonColor = "#008000";
                isSeatAvailorReserved = "avail";
                isSeatColorset = true;
                return seatObj;
              }
            }
          );
        }
        if (
          typeof this.mapData["value"]["occupiedEntities"] !== "undefined" &&
          !!this.mapData["value"]["occupiedEntities"] &&
          !isSeatColorset
        ) {
          currentSeat = this.mapData["value"]["occupiedEntities"].filter(
            (seat) => {
              if (seat.displayName === seatData.displayName) {
                polygonColor = "#d24848";
                isSeatColorset = true;
                return seatObj;
              }
            }
          );
        }
        if (
          typeof this.mapData["value"]["socialDistancedEntities"] !==
            "undefined" &&
          !!this.mapData["value"]["socialDistancedEntities"] &&
          !isSeatColorset
        ) {
          currentSeat = this.mapData["value"]["socialDistancedEntities"].filter(
            (seat) => {
              if (seat.displayName === seatData.displayName) {
                polygonColor = "#cccccc";
                isSeatColorset = true;
                return seatObj;
              }
            }
          );
        }
        if (
          typeof this.mapData["value"]["departmentReservedEntities"] !==
            "undefined" &&
          !!this.mapData["value"]["departmentReservedEntities"] &&
          !isSeatColorset
        ) {
          currentSeat = this.mapData["value"][
            "departmentReservedEntities"
          ].filter((seat) => {
            if (seat.displayName === seatData.displayName) {
              isSeatAvailorReserved = "reserved";
              polygonColor = "#008000";
              isSeatColorset = true;
              return seatObj;
            }
          });
        }
        let seatObj = this.mapData.values;
        /** */
        if (
          !!seatData["attributes"]["coordinates"] &&
          seatData["attributes"]["coordinates"].length
        ) {
          let polygonArray = [];
          let biggerArray = [];
          let vertices = seatData["attributes"]["coordinates"];
          for (let i = 0; i < vertices.length; i++) {
            let objdata = [];
            objdata.push(vertices[i]["yCoordinate"]);
            objdata.push(vertices[i]["xCoordinate"]);
            polygonArray.push(objdata);
          }
          biggerArray.push(polygonArray);
          let polygonOption = {
            polygonArray: biggerArray,
            color: "#686868",
            fillColor: polygonColor,
            fillOpacity: 1,
            weight: 1,
            markerIcon: "",
          };
          let seatCoordinates = seatData["attributes"];
          let seatCoordinatesX;
          let seatCoordinatesY;
          if (!!seatCoordinates.mb_tile_max_x) {
            seatCoordinatesX =
              (seatCoordinates.mb_tile_min_x + seatCoordinates.mb_tile_max_x) /
              2;
            seatCoordinatesY =
              (seatCoordinates.mb_tile_min_y + seatCoordinates.mb_tile_max_y) /
              2;
          } else {
            seatCoordinatesX =
              (seatCoordinates.minX + seatCoordinates.maxX) / 2;
            seatCoordinatesY =
              (seatCoordinates.minY + seatCoordinates.maxY) / 2;
          }
          let markerObj = {
            seatCoordinatesX: seatCoordinatesY,
            seatCoordinatesY: seatCoordinatesX,
            draggable: false,
            iconUrl: "./assets/images/checkbox.png",
            iconSize: [32, 32],
            zoomLeavel: this.userZoomLevel,
          };
          var marker = L.marker(
            new L.LatLng(
              markerObj.seatCoordinatesX,
              markerObj.seatCoordinatesY
            ),
            {
              draggable: markerObj.draggable,
              icon: myIcon,
            }
          );
          this.markerLayerMap.set(seatData.id, {
            element: seatData,
            marker: marker,
          });

          if (
            isSeatAvailorReserved == "avail" ||
            isSeatAvailorReserved == "reserved"
          ) {
            marker.on("click", () => {
              if (this.map.hasLayer(marker)) {
                this.map.removeLayer(marker);
              }
              this.removeSelectedSeat(seatData);
            });
          }
          /** need to check */
          // if (this.selectedSeats.length) {
          //   this.selectedSeats.map((seats) => {
          //     if (seats["id"] === seatData.id) {
          //       this.map.addLayer(marker);
          //     }
          //   });
          // }
          /** need to check */
          let polygonObj = L.polygon(polygonArray, {
            color: polygonOption.color,
            fillColor: polygonOption.fillColor,
            fillOpacity: polygonOption.fillOpacity,
            weight: polygonOption.weight,
          });
          /** */
          // need to add in polygon lable
          /*var marker2div = L.divIcon({
                    className: "my-labels",
                    iconSize: null,
                    html: `
                    <div style="${markerObjVar.polyLabelStyle}">${seatData["displayName"]} </div><div style="${markerObjVar.polyNameStyle}">${userName}</div>`,
                });

                var marker2 = L.marker(
                    new L.LatLng(
                        markerObj.seatCoordinatesX,
                        markerObj.seatCoordinatesY
                    ),
                    { icon: marker2div }
                );
                map.addLayer(marker2); */
          /** */
          polygonObj.addTo(map);
          if (
            isSeatAvailorReserved == "avail" ||
            isSeatAvailorReserved == "reserved"
          ) {
            polygonObj.on("click", async (e) => {
              if (this.map.hasLayer(marker)) {
                this.map.removeLayer(marker);
                await this.removeSelectedSeat(seatData);
              } else {
                if (this.bookingType === "employee") {
                  this.map.removeLayer(marker);
                  await this.removeSelectedSeat(seatData);
                }
                this.map.addLayer(marker);
                await this.addSelectedSeat(seatData, marker);
              }
            });
          }
        }
      });
    }
  }
  addSelectedSeat(seatData, marker) {
    if (this.bookingType === "employee") {
      this.selectedSeatMarkerLayer = [];
      this.selectedSeats = [];
    }
    this.selectedSeatMarkerLayer = [
      ...this.selectedSeatMarkerLayer,
      { seatId: seatData.id, marker: marker },
    ];
    const selectedSeatObj = {
      id: seatData.id,
      displayName: seatData.displayName,
    };
    this.selectedSeats = [...this.selectedSeats, selectedSeatObj];
  }
  removeSelectedSeat(seatData) {
    if (this.bookingType === "employee") {
      if (this.selectedSeatMarkerLayer.length) {
        this.selectedSeatMarkerLayer.forEach((seats) => {
          let mlayer = seats.marker;
          this.map.removeLayer(mlayer);
        });

        this.selectedSeatMarkerLayer = [];
      }
      this.selectedSeats = [];
    } else {
      //department case
      /*click on  marker or polygon-marker */
      let fSeats = this.selectedSeats.filter(
        (seats) => seats.id !== seatData.id
      );
      this.selectedSeats = fSeats;
      if (this.selectedSeatMarkerLayer.length) {
        let fMarker = this.selectedSeatMarkerLayer.filter((seats) => {
          if (seats.seatId == seatData.id) {
            let mlayer = seats.marker;
            this.map.removeLayer(mlayer);
          } else {
            return seats;
          }
        });
        this.selectedSeatMarkerLayer = fMarker;
      }
      var foundIndex = this.seatCoordinatesArr.findIndex(
        (x) => x.id == seatData.id
      );
    }
  }
  getUserLegend = () => {
    if (!!this.bookingRequestObj.user.firstName) {
      const fName = this.bookingRequestObj.user.firstName.length
        ? this.bookingRequestObj.user.firstName.charAt(0)
        : "";
      const lName = this.bookingRequestObj.user.lastName.length
        ? this.bookingRequestObj.user.lastName.charAt(0)
        : "";
      return `${fName}${lName}`;
    }
    return "";
  };
  get getSelectedSeats(){
    if (this.selectedSeats.length) {
      let seatIds = this.selectedSeats.map((seats) => seats.displayName);
      return seatIds.toString().replace(/,/g, ", ");
    }
    return "";
  }
  /**animation */
  async hideRightPanel() {
    if (this.rightPanelState === "close") {
      this.rightPanelVisibility = "hidden";
      this.rightPanelDisplay = "none";
    }
  }
  toggleRightPanel = () => {
    this.rightPanelState = this.rightPanelState === "close" ? "open" : "close";
    if (this.rightPanelState === "open") {
      this.rightPanelVisibility = "visible";
      this.rightPanelDisplay = "block";
    }
  };
  closeRightPanel = () => {
    this.rightPanelState = "close";
  };
  /**animation */

  onEntityObjChange(reqObj) {
    this.onBookingEntityChange.emit(reqObj);
  }
  sendErrorReport(err) {}
  onSelectEmp(userObj) {
    this.employeeSearch.setValue(userObj.name);
    this.bookingRequestObj["user"] = userObj;
    this.bookingRequestObj["userId"] = userObj.id;
    this.selectedSeats = [];
    this.onEntityObjChange(this.bookingRequestObj);
  }
  get getMinDate() {
    return new Date(new Date(this.bookingDate[0]).setHours(0, 0, 0, 0));
  }
  get getMaxDate() {
    var maxDate = new Date(this.bookingDate[1]);
    maxDate.setDate(maxDate.getDate() + 730);
    return new Date(new Date(maxDate).setHours(23, 59, 59, 59));
  }
  setBookingDate(selectedDate) {
    // need to set booking start and end time and call map fun
    this.selectedSeats = [];
    this.bookingRequestObj["startTime"] = getTimeStamp(
      new Date(selectedDate[0]).getTime(),
      "start"
    );
    this.bookingRequestObj["endTime"] = getTimeStamp(
      new Date(selectedDate[1]).getTime(),
      "end"
    );
    this.onEntityObjChange(this.bookingRequestObj);
  }
  onShiftTimeChange(event, type) {
    let selectedTime = this.sliderLabel[event - 1];
    selectedTime = selectedTime.replace("hrs", "");
    if (type === "startTime") {
      this.sliderMinValue = event;
      this.bookingRequestObj["recurringStartTime"] = parseInt(
        selectedTime.replace(":", "")
      );
    } else {
      this.sliderMaxValue = event;
      this.bookingRequestObj["recurringEndTime"] = parseInt(
        selectedTime.replace(":", "")
      );
    }
    this.onEntityObjChange(this.bookingRequestObj);
  }
  getUserAutoCompleteList(val) {
    if (!!val.trim()) {
      this.empSearchTermSub$.next(val);
    }
  }
  saveBooking() {
    console.log("this.bookingRequestObj", this.bookingRequestObj);
    if (!this.selectedSeats.length) {
      alert("Please select the seat to book");
      return;
    }
    let reqObj: any = {};
    if (this.bookingType !== "employee") {
      reqObj = {
        requestDetails: {
          entityInfos: this.selectedSeats,
          startTime: this.bookingRequestObj.startTime,
          endTime: this.bookingRequestObj.endTime,
          demandType: "DEPARTMENT",
          demandId: this.bookingRequestObj["department"]["id"],
          recurringStartTime: this.bookingRequestObj.recurringStartTime,
          recurringEndTime: this.bookingRequestObj.recurringEndTime,
        },
      };
    } else {
      reqObj = {
        requestDetails: {
          entityInfos: this.selectedSeats,
          startTime: this.bookingRequestObj.startTime,
          endTime: this.bookingRequestObj.endTime,
          demandType: "USER_DEPARTMENT",
          userId: this.bookingRequestObj["user"].id,
          recurringStartTime: this.bookingRequestObj.recurringStartTime,
          recurringEndTime: this.bookingRequestObj.recurringEndTime,
        },
      };
    }
    this.onSubmit.emit(reqObj);
  }
}
