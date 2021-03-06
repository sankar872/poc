
  import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    OnDestroy,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Input,
    Output,
    EventEmitter,
    SimpleChanges,
    SimpleChange
  } from "@angular/core";
  import { OnboardingService } from '../services/onboarding.service';
  //import { Route, Router, ActivatedRoute } from "@angular/router";
  import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
  } from "@angular/material/dialog";
  
  import {forkJoin} from "rxjs/observable/forkJoin";
  
  import { catchError, tap, filter, switchMap, mergeMap, startWith, debounceTime, map, takeUntil, distinctUntilChanged } from "rxjs/operators";
  
  import { of } from "rxjs/observable/of";
  import { LeafletService } from "../services/onboard-leaflet.service";
  import {
    LeafLetInit,
    TilesOption,
    PolygonOption,
  } from "../onboard-space/leaflet.interface";
  import * as L from "leaflet";
  declare const $;
@Component({
  selector: 'app-floorplan',
  templateUrl: './floorplan.component.html',
  styleUrls: ['./floorplan.component.scss']
})
export class FloorplanComponent implements OnInit {

    @Output() downloadSuccess = new EventEmitter<any>();
    @Output() downloadError = new EventEmitter<any>();
    @Output() seatInfoCallBack = new EventEmitter<any>();
  
  //   @Input() uploadFloorInfo:any;
  //   @Output() uploadFloorSuccess = new EventEmitter<any>();
  //   @Output() uploadFloorError = new EventEmitter<any>();
  
    @Input() openFloorInfo:any;
    @Output() openFloorSuccess = new EventEmitter<any>();
    @Output() openFloorError = new EventEmitter<any>();
  
  
  
    @Output() viewList = new EventEmitter<String>();
    FloorData = [];
    fileInput:HTMLElement = document.getElementById('fileInput') as HTMLElement;
    spans = [];
    workstationColorArr = [];
    totalRecords = 0;
    isFileUploaded: boolean = false;
    showTableData:boolean = false;
    fileName: string = 'Upload File';
    workstationList = [];
    userMetaDataInfo = [];
    //floor-leaflet-data
    stepper = 'first';
    currentView = "";
  
  
  
  
    leaflet_url;
    leaflet_blockInfo;
    workstationListData;
    leaflet_seatsGeojson;
    leaflet_overlaydata;
    leaflet_scaleData;
  
    userZoomLevel:number = 11;
    map: L.Map;
  
    seatMetaDataInfo = [];
    constructor(
      public dialog: MatDialog,
      public onboardingService: OnboardingService,
      public leafletService: LeafletService
  ) {}
  
    ngAfterViewInit() {
      //this.uploadFloor.subscribe(data => this.FloorData = data);
      
    }
  
    ngOnChanges(changes: SimpleChanges) {
  
      if(typeof changes['openFloorInfo'] != 'undefined' && typeof changes['openFloorInfo']['currentValue'] != 'undefined' && changes['openFloorInfo']['currentValue'].length>0) {
        console.log(changes);
        this.currentView = 'mapView';
        this.seatMetaDataInfo = changes['openFloorInfo']['currentValue'][0]['seatMetaInfo'];
        if(typeof changes['openFloorInfo']['currentValue'][0]['userMetaInfo'] != 'undefined' && changes['openFloorInfo']['currentValue'][0]['userMetaInfo'].length>0) {
            this.userMetaDataInfo = changes['openFloorInfo']['currentValue'][0]['userMetaInfo'];
        } else {
            this.userMetaDataInfo = [];
        }
        this.openMap(changes['openFloorInfo']['currentValue']);
      }
      
    }
  
  
    /*
    "Buildings",
          "Floor",
          "Createdby",
          "Capacity",
          "Lease Start"*/
  
  
  
    ngOnInit() {
     
    }
  
    download(){
      let i = ((Math.random()* 10) + 1);
      if( i > 5){
          this.downloadSuccess.emit();
      } else{
          this.downloadError.emit();
      }
      
    }
  
  
  
    openMap(ele) {
      this.showFloor(ele);
    }
  
      showFloor(ele) {
          console.log(ele);
          this.onboardingService
          .getFloorPlanDetailsByFloorId(ele[0]['floorId'])
          .subscribe((res) => {
            console.log(res);
              let response = res["floorDetails"];
              let floorMetaData = JSON.parse(response['floorMetaData']['floorMetaData']);
              this.leaflet_url =  floorMetaData['tileUrl'].replace("http://localhost:8080","http:// 10.8.0.42:8080");
              this.leaflet_overlaydata = JSON.parse(response['floorMetaData']['entityAttributes'])['overlaydata'];
              this.leaflet_seatsGeojson = {};
              this.workstationListData = [];
              console.log(JSON.parse(response['floorMetaData']['entityAttributes'])['blockInfo']);
              console.log(this.leaflet_overlaydata);
              
  
              //this.formColorArray();
             
              
                  this.initLeafletMap(ele);
  
              this.openFloorSuccess.emit(res);
          }, err => {
              this.openFloorError.emit(err);
          });
      }
  
      formColorArray = () => {
        let currentContext = this;
        currentContext.workstationColorArr = [];
        
        for (const [key, value] of (<any>Object).entries(this.leaflet_blockInfo)) {
            let colrObj: any = {};
            colrObj.key = key;
            colrObj.value =
                "#" +
                (0x1000000 + Math.random() * 0xffffff)
                    .toString(16)
                    .substr(1, 6);
            currentContext.workstationColorArr.push(colrObj);
        }
      };
  
      getColorByWorkstation(workstation) {
        let colorData = this.workstationColorArr.find((clrData) => {
            if (clrData.key === workstation) {
                return clrData;
            }
        });
        if (!!colorData) {
            return colorData.value;
        }
        // return this.workstationColorArr[workstation];
    }
  
    initLeafletMap = (ele) => {
      let initMapOption: LeafLetInit = {
          mapId: "map",
          minZoom: 10,
          maxZoom: 14,
          attributionControl: false,
          setViewLatLng: [0.25, 0.5],
          zoomLeavel: this.userZoomLevel,
      };
      let tilesOption: TilesOption = {
          tileUrl: this.leaflet_url,
          maxZoom: 14,
          attribution: "smartenspaces",
          id: "smartenspaces",
      };
      if (this.map) {
          this.leafletService.deleteMap(this.map);
      }
      this.map = L.map(initMapOption.mapId, {
          minZoom: initMapOption.minZoom,
          maxZoom: initMapOption.maxZoom,
          attributionControl: initMapOption.attributionControl,
      }).setView(
          [initMapOption.setViewLatLng[0], initMapOption.setViewLatLng[1]],
          initMapOption.zoomLeavel
      );
  
      forkJoin(
          // this.leafletService.initMap(initMapOption),
          this.leafletService.addTiles(this.map, tilesOption),
          this.leafletService.initDrawMapControl(this.map)
      ).subscribe(([res2, drawControlObj]) => {
          // this.map = mapObj;
          // res2.addTo(this.map); // need to chk
          this.drawpolygon(ele);
          //this.drawnItems = drawControlObj.drawnItems;
          //this.drawControl = drawControlObj.controlObj;
      });
      
      

      this.map.on("zoomend", (res) => {
          this.userZoomLevel = this.map.getZoom();
          $(".leaflet-marker-pane").css({
              "z-index":700
          })
          if (this.map.getZoom() >= 14) {
  
              $(".leaflet-tooltip.my-labels").css({
                  "font-size": "18px",
                  "-webkit-text-stroke": "1px black",
                  // "margin-top": "26px",
                  "font-family": "OpenSans",
                  "letter-spacing": "1.5px",
                  "font-weight": "bold"
              });
          } else if (this.map.getZoom() === 11) {
              $(".leaflet-tooltip.my-labels").css({
                  "font-size": "0px",
                  "-webkit-text-stroke": "0.8px black",
                  // "margin-top": "2px",
                  "font-family": "OpenSans",
                  "letter-spacing": "1.5px",
                  "font-weight": "bold"
              });
          } else if (this.map.getZoom() === 12) {
              $(".leaflet-tooltip.my-labels").css({
                  "font-size": "0px",
                  "-webkit-text-stroke": "0.8px black",
                  // "margin-top": "2px",
                  "font-family": "OpenSans",
                  "letter-spacing": "1.5px",
                  "font-weight": "bold"
              });
          } else if (this.map.getZoom() === 13) {
              $(".leaflet-tooltip.my-labels").css({
                  "font-size": "0px",
                  "-webkit-text-stroke": "1px black",
                  // "margin-top": "15px",
                  "font-family": "OpenSans",
                  "letter-spacing": "1.5px",
                  "font-weight": "bold"
              });
          }else  {
              $(".leaflet-tooltip.my-labels").css({
                  "font-size": 0,
                  "-webkit-text-stroke": "1px black",
                  // "margin-top": "15px",
                  "font-family": "OpenSans",
                  "letter-spacing": "1.5px",
                  "font-weight": "bold"
              });
          }
      });
  };
  
  drawpolygon = (ele) => {
      console.log(ele);
        for (var a in this.leaflet_overlaydata) {
            let polygonArray = [];
            let biggerArray = [];
            let vertices = this.leaflet_overlaydata[a];
            for (let i = 0; i < vertices.length; i++) {
                let objdata = [];
                objdata.push(vertices[i]["Y"]);
                objdata.push(vertices[i]["X"]);
                polygonArray.push(objdata);
            }
            biggerArray.push(polygonArray);
            let polygonOption: PolygonOption = {
                polygonArray: biggerArray,
                color: "#686868",
                fillColor: this.getWorkstationColor(a),
                fillOpacity: 1,
                weight: 1,
                label: a,
            };
            

           
           


            let polygonObj = L.polygon(polygonOption.polygonArray, {
                color: polygonOption.color,
                fillColor: polygonOption.fillColor,
                fillOpacity: polygonOption.fillOpacity,
                weight: polygonOption.weight,
            });

            let leafIcon = L.Icon.extend({
                options: {
                  iconSize: [23,32]
                }
              });
          
            if (!!polygonOption.label) {
                polygonObj
                    .bindTooltip(`<span class="test">${polygonOption.label}</span>`, {
                        permanent: true,
                        direction: "center",
                        className: "my-labels",
                    })
                    .openTooltip().on("click",(e) => {
                        this.seatInfoCallBack.emit(polygonOption);
                        console.log(ele[0]['multiSelect']);
                        if(typeof(ele[0]['multiSelect']) != 'undefined' && ele[0]['multiSelect']) {
                            const greenIcon = new leafIcon({ iconUrl: '/assets/images/checked.svg' });
                            //var mp = new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
                           
                            const layer = L.marker([e.latlng.lat, e.latlng.lng], { icon: greenIcon });
                            if(this.map.hasLayer(layer)){
                                this.seatInfoCallBack.emit(polygonOption);
                                layer.remove();
                                this.map.removeLayer(layer)
                            }else{
                                this.map.addLayer(layer)
                                layer.addTo(this.map);
                                layer.on("click", () => {
                                    this.seatInfoCallBack.emit(polygonOption);
                                    layer.remove();
                                });
                            }
                        }
                        
                    });
            }
            polygonObj.addTo(this.map);



        }
        this.showUser()
    };
  
    showUser= ()=> {
        console.log(this.userMetaDataInfo);
        if(this.userMetaDataInfo.length>0) {
            let data = this.userMetaDataInfo[0];
            console.log(data);
            let biggerArray = [];
            let userSeat = data['seatId'];
            let vertices = this.leaflet_overlaydata[userSeat];
            let polyArray = vertices.map(v => {
                let newArr = [];
                newArr = [...newArr, v.Y, v.X];
                return newArr;
            });
            biggerArray=[...biggerArray, polyArray];
            let reqObj = {
                polygonCoordinates: biggerArray,
                userData: data
            }
            this.leafletService.addUserInfoMarker(this.map, reqObj).subscribe(res => {
                
                //this.UserMarkerObj = res.marker;
            })
    

        }
    }

    getWorkstationColor(seatId) {
      var colorData: any = {};
      if(this.seatMetaDataInfo.length>0){
        for (const key in this.seatMetaDataInfo) {
            if (this.seatMetaDataInfo[key]['seatId'].includes(seatId)) {
                return this.seatMetaDataInfo[key]['color'];
            }
        }
      }
      if (!!colorData) {
          return "green";
      }
    }
  
    backtoListPage (){
      this.viewList.emit("listPage");
      this.currentView = "";
    }
  
  
  }