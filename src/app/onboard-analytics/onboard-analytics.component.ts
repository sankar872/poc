import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  LeafLetInit,
  TilesOption,
  PolygonOption,
  MarkerOption
} from "../onboard-space/leaflet.interface";
import { LeafletService } from "../services/onboard-leaflet.service";
import * as L from "leaflet";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Options } from "ng5-slider";
declare const $;


@Component({
  selector: 'app-onboard-analytics',
  templateUrl: './onboard-analytics.component.html',
  styleUrls: ['./onboard-analytics.component.scss'],
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
export class OnboardAnalyticsComponent implements OnInit {

  @Input() displayAnalysticMap:any;
  @Output()
  requestSearchSlide = new EventEmitter();
  
  timelineData:any = [];
  userZoomLevel: number = 11;
  map;
  UserMarkerObj: any;
  userList = [];

  dayTime = "0000";
  currentZone = 57;
  selectedDate = new Date();
  searchState:string = "out";
  rightPanelState:string = "open";
  userSearchVisibility:string = "none";
  rightPanelVisibility:string = "visible";
  rightPanelDisplay:string = "block";

  colorLengends;
  sliderColor: string = "#0F1F54";
  value: number = 1;
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

  constructor(public leafletService: LeafletService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(typeof changes['displayAnalysticMap'] != 'undefined' && typeof changes['displayAnalysticMap']['currentValue'] != 'undefined' && changes['displayAnalysticMap']['currentValue'].length>0) {
      this.timelineData = changes['displayAnalysticMap']['currentValue'][0];
      this.colorLengends = Object.entries(changes['displayAnalysticMap']['currentValue'][0]['colorLegend']);
      console.log(this.colorLengends);
      setTimeout(() => {
        this.setupMap();
        console.log(this.selectedDate);
      }, 2000);
      
    }
  }

  toggleSearchPanel = () => {
    this.searchState = this.searchState === 'out' ? 'in' : 'out';
    if(this.searchState === 'in'){
        this.userSearchVisibility = "block"
    }
  }
  hideUserSearch () {
      if(this.searchState === 'out') {
          this.userSearchVisibility = "none"
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


  setupMap() {

      let initMapOption: LeafLetInit = {
        mapId: "mapid",
        minZoom: 10,
        maxZoom: 14,
        attributionControl: false,
        setViewLatLng: [0.25, 0.5],
        zoomLeavel: this.userZoomLevel,
      };
      let mapTiles = this.timelineData["activeUrl"];
      console.log( this.timelineData);
      let tilesOption: TilesOption = {
          tileUrl: mapTiles,
          maxZoom: 14,
          attribution: "smartenspaces",
          id: "smartenspaces",
      };
      if (this.map) {
          this.leafletService.deleteMap(this.map);
      }
      this.map = L.map("mapid", {
          minZoom: initMapOption.minZoom,
          maxZoom: initMapOption.maxZoom,
          attributionControl: initMapOption.attributionControl,
      }).setView(
          [initMapOption.setViewLatLng[0], initMapOption.setViewLatLng[1]],
          initMapOption.zoomLeavel
      );
      this.map.on("zoomend", (res) => {
          this.userZoomLevel = this.map.getZoom();
          var newzoom = "" + 4 * this.map.getZoom() + "px";
          if (this.map.getZoom() <= 10) {
              $(".leaflet-marker-icon.my-labels").css({
                  "font-size": 0,
                  "font-weight":"bold",
                  "-webkit-text-stroke": "0.6px",
                  "letter-spacing": "0.8px"
              });
          } else if (this.map.getZoom() === 11) {
              $(".leaflet-marker-icon.my-labels").css({
                  "font-size": 8,
                  "font-weight":"bold",
                  "-webkit-text-stroke": "0.6px",
                  "letter-spacing": "0.8px"
              });
          } else if (this.map.getZoom() >= 14) {
              $(".leaflet-marker-icon.my-labels").css({
                  "font-size": 15,
                  "font-weight":"bold",
                  "-webkit-text-stroke": "0.6px",
                  "letter-spacing": "0.8px"
              });
          } else {
              $(".leaflet-marker-icon.my-labels").css({
                  "font-size": 13,
                  "font-weight":"bold",
                  "-webkit-text-stroke": "0.6px",
                  "letter-spacing": "0.8px"
              });
          }
          if(!!this.UserMarkerObj) {
              setTimeout(() => {
                  this.UserMarkerObj.addTo(this.map);
              }, 100);
          }
      });
      this.leafletService
          .addTiles(this.map, tilesOption)
          .subscribe(async (res) => {
              await this.drawSeatCoordinates();
          });
    }

    drawSeatCoordinates = async () => {
          this.userList=[];
          const markerObjVar = await this.leafletService.getMarkerVariables(
              this.userZoomLevel
          );
          let i = 0;
          this.map.eachLayer((layer) => {
              if (i !== 0) {
                  this.map.removeLayer(layer);
              }
              i++;
          });
          if (!!this.timelineData["value"]) {
              Object.values(this.timelineData["value"]).forEach(async (value) => {
                  let seatData = value;
                  if (
                      !!seatData["entityInfo"]["attributes"]["coordinates"] &&
                      seatData["entityInfo"]["attributes"]["coordinates"].length
                  ) {
                      let userName = "";
                      if (
                          seatData["user"] !== null &&
                          typeof seatData["user"] != "undefined"
                      ) {
                          if (seatData["user"]["name"] !== null) {
                              if (!!seatData["user"]["name"]) {
                                  userName = seatData["user"]["name"];
                                  this.userList = [...this.userList, seatData];
                              }
                              if(!!seatData["user"]["imageUrl"]) {
                                  try {
                                      let privImage = seatData["user"]["imageUrl"];
                                      seatData["user"]["imageUrl"]  = privImage;
                                  }catch (err) {
                                      seatData["user"]["imageUrl"] = seatData["user"]["imageUrl"];
                                  
                                  }
                              }
                          }
                      }

                      let polygonArray = [];
                      let biggerArray = [];
                      let vertices =
                          seatData["entityInfo"]["attributes"]["coordinates"];
                      for (let i = 0; i < vertices.length; i++) {
                          let objdata = [];
                          objdata.push(vertices[i]["yCoordinate"]);
                          objdata.push(vertices[i]["xCoordinate"]);
                          polygonArray.push(objdata);
                      }
                      biggerArray.push(polygonArray);
                      let polygonOption: PolygonOption = {
                          polygonArray: biggerArray,
                          color: "#686868",
                          fillColor: seatData["color"],
                          fillOpacity: 1,
                          weight: 1,
                          markerIcon: "",
                          showMarker: false,
                      };
                      /** */
                      let seatCoordinates = seatData["entityInfo"]["attributes"];
                      let seatCoordinatesX;
                      let seatCoordinatesY;
                      if (!!seatCoordinates.mb_tile_max_x) {
                          seatCoordinatesX =
                              (seatCoordinates.mb_tile_min_x +
                                  seatCoordinates.mb_tile_max_x) /
                              2;
                          seatCoordinatesY =
                              (seatCoordinates.mb_tile_min_y +
                                  seatCoordinates.mb_tile_max_y) /
                              2;
                      } else {
                          seatCoordinatesX =
                              (seatCoordinates.minX + seatCoordinates.maxX) / 2;
                          seatCoordinatesY =
                              (seatCoordinates.minY + seatCoordinates.maxY) / 2;
                      }
                      let markerObj: MarkerOption = {
                          // seatCoordinatesX: seatCoordinatesX,
                          // seatCoordinatesY: seatCoordinatesY,
                          seatCoordinatesX: seatCoordinatesY,
                          seatCoordinatesY: seatCoordinatesX,
                          draggable: false,
                          iconUrl: "./assets/images/checkbox.png",
                          iconSize: [32, 32],
                          zoomLeavel: this.userZoomLevel,
                      };
                      var marker2div = L.divIcon({
                          className: "my-labels",
                          iconSize: null,
                          html: `
                          <div style="${markerObjVar.polyLabelStyle}">${seatData["entityInfo"]["displayName"]} </div><div style="${markerObjVar.polyNameStyle}">${userName}</div>`,
                      });
                      if (this.map.getZoom() <= 10) {
                          $(".leaflet-marker-icon.my-labels").css({
                              "font-size": 0,
                              "font-weight":"bold",
                              "-webkit-text-stroke": "0.6px",
                              "letter-spacing": "0.8px"
                          });
                      } else if (this.map.getZoom() === 11) {
                          $(".leaflet-marker-icon.my-labels").css({
                              "font-size": 8,
                              "font-weight":"bold",
                              "-webkit-text-stroke": "0.6px",
                              "letter-spacing": "0.8px"
                          });
                      } else if (this.map.getZoom() >= 14) {
                          $(".leaflet-marker-icon.my-labels").css({
                              "font-size": 15,
                              "font-weight":"bold",
                              "-webkit-text-stroke": "0.6px",
                              "letter-spacing": "0.8px"
                          });
                      } else {
                          $(".leaflet-marker-icon.my-labels").css({
                              "font-size": 13,
                              "font-weight":"bold",
                              "-webkit-text-stroke": "0.6px",
                              "letter-spacing": "0.8px"
                          });
                      }
                      var marker2 = L.marker(
                          new L.LatLng(
                              markerObj.seatCoordinatesX,
                              markerObj.seatCoordinatesY
                          ),
                          { icon: marker2div }
                      );
                      this.map.addLayer(marker2);
                      /** */
                      this.leafletService
                          .drawPolygon(this.map, polygonOption)
                          .subscribe((polygonRes) => {});
                  }
              });
          }
    }

    onShiftTimeChange = (value: number) => {
      let selectedTime = this.sliderLabel[value["value"] - 1];
      let timeInt = selectedTime.replace(":", "").trim();
      this.dayTime = (timeInt.includes("hrs")) ? timeInt.replace("hrs", "")  : timeInt;
      this.callParentForMapView(); 
    };
    onDateChange = (selectedDate) => {
        this.callParentForMapView(); 
    };

    callParentForMapView() {
      let reqObj: any = {
        dayTime: +this.dayTime,
        viewType: "DEPARTMENT",
        timestamp: this.selectedDate,
      };
      this.requestSearchSlide.emit(reqObj); 
    }

    viewUserInMap(item) {
      if(!!this.UserMarkerObj) {
          this.leafletService.removeLayer(this.map, this.UserMarkerObj);
      }
      if(!!item) {
          let biggerArray = [];
          let userSeat = item['entityInfo']['displayName'];
          let vertices = item['entityInfo']['attributes']['coordinates'];
          let polyArray = vertices.map(v => {
              let newArr = [];
              newArr = [...newArr, v.yCoordinate, v.xCoordinate];
              return newArr;
          });
          biggerArray=[...biggerArray, polyArray];
          let reqObj = {
              polygonCoordinates: biggerArray,
              userData: item
          }
          this.leafletService.addUserInfoMarker(this.map, reqObj)
          .subscribe(res => {
              this.UserMarkerObj = res.marker;
          })
  
      }
    }
  }
