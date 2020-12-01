import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges
} from "@angular/core";

import { LoaderService } from "../../shared/modules/loader/loader.service";
import * as L from "leaflet";
import {
    LeafLetInit,
    TilesOption,
    PolygonOption,
} from "../../onboard-space/leaflet.interface";
import { LeafletService } from "../../services/onboard-leaflet.service";
declare const $;

@Component({
    selector: 'user-seat-view',
    styleUrls: ['user-seat-view.component.scss'],
    templateUrl: 'user-seat-view.component.html',
})
export class UserSeatViewComponent implements OnInit, OnChanges {
    
 
    @Input()
    data;
    @Input()
    userInfoMap;
    @Input()
    userInfoMapData;
    @Output()
    goBack = new EventEmitter();
    @Output()
    leafletMap = new EventEmitter();


    ///Leaflet start
    leaflet_url;
    leaflet_blockInfo;
    workstationColorArr = [];
    workstationListData;
    leaflet_seatsGeojson;
    leaflet_overlaydata;
    leaflet_scaleData;
    buildingList;
    map: L.Map;
    drawControl;
    drawnItems;
    markerWithBindPopup = {
        showMarker: false,
    };

    invalidEntires = [];

    masterSelected: boolean;
    checklist: any;
    checkedList: any;
    editAllocationData;
    stagestatus;
    newworkstation;
    newworkstationlocation;
    userDto;
    userZoomLevel:number = 14;
    UserMarkerObj: any;

    ///Leaflet end

    constructor(
        private loaderService: LoaderService,
        private leafletService: LeafletService,
    ) {}
    ngOnInit() {
    }
    ngOnChanges(change:SimpleChanges){
        if(!!this.data){
            //this.showMap()
        }

        if(!!this.userInfoMapData && typeof change['userInfoMapData']['currentValue'] != 'undefined') {
            this.loadMap()
        }
    }


    loadMap() {
       
        let response = this.userInfoMapData['response'];

                this.leaflet_url = response["tileUrl"];
                this.leaflet_scaleData = response["scaleAttributes"];
                this.leaflet_blockInfo = response["blockInfo"];
                //this.leaflet_overlaydata = response["overlaydata"];
                this.leaflet_overlaydata = response["overlaydata"];
                this.leaflet_seatsGeojson = {};
                this.workstationListData = [];
                
                

                this.formColorArray();
                const workStationOnboardingList =
                    response["entityInformation"]["workStationOnboardingList"];

                const unOnboardedListData = response["unonboardedEntities"];
                let newArr: any = [];
                workStationOnboardingList.forEach((entity) => {
                   
                    let coordinates_arr =
                        entity["entityChildType"]["attributes"]["coordinates"];
                    let workstationBlockName =
                        entity["entityChildType"]["name"];
                    let coordinates = [];
                    if (!!coordinates_arr && coordinates_arr != "") {
                        // coordinates = coordinates_arr.map(Object.values);
                        coordinates = coordinates_arr.map(
                            ({ seatName, x: lat, y: lng }) => ({ lat, lng })
                        );
                    }
                    
                    const seats = this.leaflet_blockInfo[
                        workstationBlockName
                    ];
                    let seatId;
                    let count;
                    if(typeof(seats) != 'undefined'){
                        seatId = seats[0];
                        count = seats.length;
                    } else {
                        seatId = '';
                        count = 0;
                    }
                    
                    let newObj = {
                        key: workstationBlockName,
                        seatId: seatId,
                        area: entity.area,
                        coordinates: coordinates,
                        workstationName:
                            entity.entityChildType.entityTypeId.name,
                        workstationId: entity.entityChildType.entityTypeId.id,
                        count: count,
                        drawType: "polygon",
                        originalArea: entity.originalArea,
                        color: this.getColorByWorkstation(workstationBlockName),
                    };
                    this.workstationListData = [
                        ...this.workstationListData,
                        newObj,
                    ];
                    entity["listOfSeat"].forEach((seatsData) => {
                        let seat_id = seatsData.displayName;
                        let attributes = seatsData.attributes;
                        this.leaflet_seatsGeojson[seat_id] = attributes;
                    });
                });
                if (
                    unOnboardedListData != "" &&
                    typeof unOnboardedListData != "undefined"
                ) {
                    for (const [key, entity] of Object.entries(
                        unOnboardedListData
                    )) {
                        let coordinates_arr =
                            entity["wrkStationObj"]["entityChildType"][
                                "attributes"
                            ]["coordinates"];
                        let workstationBlockName =
                            entity["wrkStationObj"]["entityChildType"]["name"];
                        let coordinates = [];
                        if (!!coordinates_arr && coordinates_arr != "") {
                            coordinates = coordinates_arr.map(Object.values);
                        }
                        const seats = this.leaflet_blockInfo[
                            workstationBlockName
                        ].sort();
                        let seatId = seats[0];
                        let count = seats.length;
                        let newObj = {
                            key: workstationBlockName,
                            seatId: seatId,
                            area: entity["wrkStationObj"]["area"],
                            coordinates: coordinates,
                            workstationName: "",
                            workstationId: "",
                            count: count,
                            drawType: "polygon",
                            originalArea: entity["originalArea"],
                            color: this.getColorByWorkstation(
                                workstationBlockName
                            ),
                        };
                        this.workstationListData = [
                            ...this.workstationListData,
                            newObj,
                        ];
                        entity["wrkStationObj"]["listOfSeat"].forEach(
                            (seatsData) => {
                                let seat_id = seatsData.displayName;
                                let attributes = seatsData.attributes;
                                this.leaflet_seatsGeojson[seat_id] = attributes;
                            }
                        );
                    }
                }
                setTimeout(()=> {
                    this.initLeafletMap();
                },600)
    }

    showMap() {
        this.loaderService.loadingOn();
        let reqObj = {
            zoneId: this.data['entityChildType']['zoneId'],
        };
        this.leafletMap.emit(reqObj);
    }
    
    initLeafletMap = () => { 

        let initMapOption: LeafLetInit = {
            mapId: "mapid",
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
        ).setZoom(0);

        var southWest = L.latLng(-0.1, -0.1),
        northEast = L.latLng(1.1, 1.1);
        var bounds = L.latLngBounds(southWest, northEast);


        this.map.setMaxBounds(bounds);


        this.leafletService.addTiles(this.map, tilesOption).subscribe((res2) => {
            this.drawpolygon();
        });

        this.map.on("zoomend", (res) => {
            this.userZoomLevel = this.map.getZoom();
            if (this.map.getZoom() >= 14) {
                $(".leaflet-tooltip.my-labels").css({
                    "font-size": "20px",
                    "-webkit-text-stroke": "1px black",
                    "margin-top": "26px",
                    "font-family": "OpenSans",
                    "letter-spacing": "1.5px",
                    "font-weight": "bold"
                });
            } else if (this.map.getZoom() === 10) {
                $(".leaflet-tooltip.my-labels").css({
                    "font-size": "5px",
                    "-webkit-text-stroke": "0.8px black",
                    "margin-top": "2px",
                    "font-family": "OpenSans",
                    "letter-spacing": "1.5px",
                    "font-weight": "bold"
                });
            } else if (this.map.getZoom() === 11) {
                $(".leaflet-tooltip.my-labels").css({
                    "font-size": "5px",
                    "-webkit-text-stroke": "0.8px black",
                    "margin-top": "2px",
                    "font-family": "OpenSans",
                    "letter-spacing": "1.5px",
                    "font-weight": "bold"
                });
            } else if (this.map.getZoom() === 12) {
                $(".leaflet-tooltip.my-labels").css({
                    "font-size": "10px",
                    "-webkit-text-stroke": "0.8px black",
                    "margin-top": "2px",
                    "font-family": "OpenSans",
                    "letter-spacing": "1.5px",
                    "font-weight": "bold"
                });
            } else if (this.map.getZoom() === 13) {
                $(".leaflet-tooltip.my-labels").css({
                    "font-size": "13px",
                    "-webkit-text-stroke": "1px black",
                    "margin-top": "15px",
                    "font-family": "OpenSans",
                    "letter-spacing": "1.5px",
                    "font-weight": "bold"
                });
            }else  {
                $(".leaflet-tooltip.my-labels").css({
                    "font-size": 0,
                    "-webkit-text-stroke": "1px black",
                    "margin-top": "15px",
                    "font-family": "OpenSans",
                    "letter-spacing": "1.5px",
                    "font-weight": "bold"
                });
            }
            if(this.userZoomLevel >=10){
                if(this.UserMarkerObj){
                    this.leafletService.removeLayer(this.map, this.UserMarkerObj);
                    this.UserMarkerObj.addTo(this.map);
                }
            }else {
                if(this.UserMarkerObj){
                    this.leafletService.removeLayer(this.map, this.UserMarkerObj);
                }
            }
        });
    
    };
    
    formColorArray = () => {
        let currentContext = this;
        currentContext.workstationColorArr = [];
     
        for (const [key, value] of Object.entries(this.leaflet_blockInfo)) {
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
    drawpolygon = () => {
       
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
            this.leafletService
                .drawPolygon(this.map, polygonOption, this.data)
                .subscribe((polygonRes) => {});
            
        }
        this.showUser(this.data)
    };
    showUser= (data)=> {
        if(!!data) {
            let biggerArray = [];
            let userSeat = data['entityInfo']['displayName'];
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
                
                this.UserMarkerObj = res.marker;
            })
    

        }
    }
    getWorkstationColor(seatId) {
        
        var colorData: any = {};
        for (const key in this.leaflet_blockInfo) {
            if (this.leaflet_blockInfo[key].includes(seatId)) {
                colorData = this.workstationColorArr.find((clrData) => {
                   
                    if (clrData.key === key) {
                      
                        return clrData;
                    }
                });
            }
        }
        if (!!colorData) {
            return colorData.value;
        }
    }
    hideMap() {
        this.goBack.emit()
    }
}