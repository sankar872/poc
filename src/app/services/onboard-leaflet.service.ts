import { Injectable } from "@angular/core";
import * as L from "leaflet";
import "leaflet-draw";
import { Observable } from "rxjs";
import { of } from "rxjs/observable/of";
@Injectable()
export class LeafletService {
    constructor() {}
    initMap(): Observable<any> {
        // if (this.map) {
        //     this.deleteMap();
        // }
        // this.map = L.map(initMapOption.mapId, {
        //     minZoom: initMapOption.minZoom,
        //     maxZoom: initMapOption.maxZoom,
        //     attributionControl: initMapOption.attributionControl
        // }).setView(initMapOption.setViewLatLng, initMapOption.zoomLeavel);
        return of();
    }
    deleteMap(map: L.Map) {
        map.remove();
    }
    clearAllEvents(map: L.Map) {
        map.clearAllEventListeners();
    }
    addTiles(map: L.Map, tilesOption): Observable<any> {
        let tileUrl = `${tilesOption.tileUrl}{z}/{x}/{y}.png`;
        let newUrl = tileUrl.replace("localhost", "20.191.142.98");
        // tilesOption.tileUrl  = tilesOption.tileUrl=tilesOption.tileUrl+ "{z}/{x}/{y}.png";
        let tileObj = L.tileLayer(newUrl, {
            maxZoom: tilesOption.maxZoom,
            attribution: tilesOption.attribution,
            id: tilesOption.id,
        });
        tileObj.addTo(map);
        return of(map); //for now sending back map object
    }

    getCentroid = function (arr) {
        return arr.reduce(
            function (x, y) {
                return [x[0] + y[0] / arr.length, x[1] + y[1] / arr.length];
            },
            [0, 0]
        );
    };

    drawPolygon(map: L.Map, polygonOption, userData = ""): Observable<any> {
        let polygonObj = L.polygon(polygonOption.polygonArray, {
            color: polygonOption.color,
            fillColor: polygonOption.fillColor,
            fillOpacity: polygonOption.fillOpacity,
            weight: polygonOption.weight,
        });
        if (!!polygonOption.label) {
            polygonObj
                .bindTooltip(`<span class="test">${polygonOption.label}</span>`, {
                    permanent: true,
                    direction: "center",
                    className: "my-labels",
                })
                .openTooltip();
        }
        polygonObj.addTo(map);
        let returnObj = { map, polygonObj };
        return of(returnObj);
    }
    initDrawMapControl(map: L.Map): Observable<any> {
        let drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);
        let drawControl = new L.Control.Draw({
            draw: {
                // position: 'right',
                polygon: false,
                polyline: false,
                circle: false,
                rectangle: false,
                marker: false,
                circlemarker: false,
            },
        });
        let returnObj = {
            drawnItems,
            controlObj: drawControl,
        };
        this.addMapControl(map, drawControl);
        return of(returnObj);
    }

    drawMarker(map: L.Map, markerObj): Observable<any> {
        var marker = L.marker(
            new L.LatLng(
                markerObj.seatCoordinatesX,
                markerObj.seatCoordinatesY
            ),
            {
                draggable: markerObj.draggable,
                icon: L.icon({
                    iconUrl: markerObj.iconUrl,
                    iconSize: markerObj.iconSize,
                }),
            }
        )
            // .bindPopup(null)
            .addTo(map);
        // .bindPopup(this.bindPopupContent()) // need to work on this
        // .on("click", this.markerClick(map:L.Map)) // need to work on this

        this.addMapLayer(map, marker);
        this.setMapView(
            map,
            [markerObj.seatCoordinatesX, markerObj.seatCoordinatesY],
            markerObj.zoomLeavel
        );
        let returnObj: any = {
            map,
            marker,
        };
        return of(returnObj);
    }
    markerClick(map: L.Map) {}
    bindPopupContent(map: L.Map) {}
    addMapLayer(map: L.Map, layer) {
        map.addLayer(layer);
    }
    addMapControl(map: L.Map, controls) {
        map.addControl(controls);
    }
    removeMapControl(map: L.Map, controls) {
        map.removeControl(controls);
    }
    setMapView(map: L.Map, latlngArr, zoomLeavel) {
        map.setView(latlngArr, zoomLeavel);
    }
    removeLayer(map: L.Map, layer) {
        map.removeLayer(layer);
    }

    enableDrawPolygon(map: L.Map, polygonOption, drawnItems): Observable<any> {
        let drawControl = new L.Control.Draw({
            draw: {
                // position: 'right',
                polygon: {
                    allowIntersection: polygonOption.allowIntersection,
                    drawError: {
                        color: polygonOption.drawErrorColor,
                        timeout: polygonOption.drawErrorTimeOut,
                    },
                    shapeOptions: {
                        color: polygonOption.shapeOptionsColor,
                    },
                },
                polyline: false,
                circle: false,
                rectangle: false,
                marker: false,
                circlemarker: false,
            },
            edit: {
                featureGroup: drawnItems,
                edit: false,
            },
        });
        this.addMapControl(map, drawControl);

        let resObj = {
            drawControl: drawControl,
            map: map,
        };
        return of(resObj);
    }

    getMarkerVariables(userZoomLevel) {
        
        let iconSizeX = 32;
        let iconSizeY = 37;
        let fontSize = 15;
        let polyLabelWidth = 100;
        let polyTextMargin = 8;
        let polyLineHight = 1.5;
        // let textColor= "#FFF";
        if (userZoomLevel <= 10) {
            iconSizeX = 10;
            iconSizeY = 15;
            fontSize = 0;
            polyLabelWidth = 30;
            polyTextMargin = 0;
            polyLineHight = 0.75;
        } else if (userZoomLevel === 11) {
            iconSizeX = 16;
            iconSizeY = 19;
            fontSize = 0;
            polyLabelWidth = 40;
            polyTextMargin = 0;
            polyLineHight = 0.75;
        } else if (userZoomLevel === 12) {
            iconSizeX = 19;
            iconSizeY = 22;
            fontSize = 7;
            polyLabelWidth = 50;
            polyTextMargin = 0;
            polyLineHight = 1;
        } else if (userZoomLevel === 13) {
            iconSizeX = 22;
            iconSizeY = 27;
            fontSize = 11;
            polyLabelWidth = 80;
            polyTextMargin = 0;
            polyLineHight = 1;
        }

        const polyLabelStyle = `font-size: ${fontSize}px;font-family: OpenSans; letter-spacing:1.5px; font-weight: bold;line-height: ${polyLineHight}; width:${polyLabelWidth}px; margin-top:${polyTextMargin}px;`;
        const polyNameStyle = `font-size: ${fontSize}px;font-family: OpenSans; letter-spacing:1.5px; font-weight: bold;line-height: ${polyLineHight}; width:${polyLabelWidth}px; margin-top:0px;`;
        const returnObj = {
            polyLabelStyle,
            iconSizeX,
            iconSizeY,
            polyNameStyle,
        };
        return returnObj;
    }

    addUserInfoMarker(map:L.Map, data, from=""):Observable<any> {
        let userInfo:any;
        let entityInfo:any;
        if(!!from && from === "people") {
             userInfo = data["userData"]["user"];
             entityInfo = data["userData"]['currentRoster']["deskName"];
        }else {
             userInfo = data['userData']["user"];
             entityInfo = data['userData']["entityInfo"];
        }
        if(userInfo != null && !!userInfo.imageUrl && userInfo.imageUrl != "" || userInfo != null && userInfo.firstName != null ){
        const markerHtmlStyles = `
        background-color: #132e74;
        display: block;
        border-radius: 50%;
        padding: 4px;
        width: 22px;
        height: 18px;`;
        let userImgStr = ``;
        let userImg = "";
        // https://uxpowered.com/products/appwork/v152/assets_/img/avatars/1.png
            if(!!userInfo.imageUrl && userInfo.imageUrl != "") {
                // try {
                //     let privImage = this.commonService.getPrivatePublicImage(userInfo.imageUrl);
                //     userInfo.imageUrl  = privImage;
                //     privImage.then(res => {
                //         userImg = res;
                //     });
                // }catch (err) {
                //     userInfo.imageUrl = userInfo.imageUrl;
                //     userImg = userInfo.imageUrl;
                // }
                userImgStr += `<div class="map-label-img-container">
                <img class="d-block ui-w-30 rounded-circle w-100 h-100" src="${userInfo.imageUrl}">
                </div>`
            }else {
                if(userInfo.firstName != null){
                    const fName = (userInfo.firstName.length)? userInfo.firstName.charAt(0): '';
                    const lName = (userInfo.lastName.length)? userInfo.lastName.charAt(0): '';
                    userImgStr +=`<span  class="text-uppercase btn btn-circle-dp legend-circle-dp col-2" >${fName}${lName}</span>`
                }
            }
        
        let myIcon = L.divIcon({
            iconSize: null,
            className: 'user-info-popup',
            html: `
            <div class="map-label">
            <div class="map-label-content shadow d-inline-flex flex-lg-row align-items-center align-middle profile-notifications">
                ${userImgStr}
                <div class="map-label-info-container w-100 d-flex-col flex-lg-row align-items-center align-middle profile-notifications">
                    <div class="w-100  text-left user-name">${userInfo["name"]}</div>
                    <div class="w-100  text-left desk-info">Desk:  ${(from === "people")? entityInfo : entityInfo["displayName"]}</div>    
                </div>
            </div>
            <div class="map-label-arrow"></div>
            </div>
            `,
        });
        
        map.createPane("userMarker");
        map.getPane("userMarker").style.zIndex = "999";
        // L.marker(this.getCentroid(data.polygonCoordinates[0])).addTo(map);
        let marker = L.marker(this.getCentroid(data.polygonCoordinates[0]),{icon: myIcon, draggable: false, pane: "userMarker"}).addTo(map);
        this.setMapView(
            map,
            this.getCentroid(data.polygonCoordinates[0]),
            11
        );
        // marker.setZIndexOffset(70000).addTo(map);
        // map.getPane('userPane').style.zIndex = '800';
        return of({map, marker});
     } else {
        const markerObjVar = this.getMarkerVariables(
            11
            );
        let seatCoordinates = data['userData']['entityInfo']['attributes'];
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
                const disabledIcon = "./assets/images/checked.svg";

    let myIcon = L.icon({
        iconUrl: disabledIcon,
        iconSize: [markerObjVar.iconSizeX, markerObjVar.iconSizeY],
        iconAnchor: [16, 17],
        popupAnchor: [0, -28],
    });


    let markerObj = {
                    seatCoordinatesX: seatCoordinatesY,
                    seatCoordinatesY: seatCoordinatesX,
                    draggable: false,
                    iconUrl: "./assets/images/checkbox.png",
                    iconSize: [32, 32],
                    zoomLeavel: 11,
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
                )
        map.addLayer(marker);
        return of({map, marker});
        }
    }
}
