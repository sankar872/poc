export interface LeafLetInit {
    mapId: string;
    minZoom: number;
    maxZoom: number;
    attributionControl: boolean;
    setViewLatLng: number[];
    zoomLeavel: number;
}
export interface TilesOption {
    tileUrl: string;
    maxZoom: number;
    attribution: string;
    id: string;
}
export interface PolygonOption {
    polygonArray: any[];
    color: string;
    fillColor: string;
    fillOpacity: number;
    weight: number;
    label?: string;
    markerIcon?: any;
    showMarker?: boolean;
}
export interface MarkerOption {
    seatCoordinatesX: number;
    seatCoordinatesY: number;
    draggable: boolean;
    iconUrl: string;
    iconSize: number[];
    zoomLeavel: number;
}
export interface DrawPolygonOption {
    position: string;
    allowIntersection: boolean;
    drawErrorColor: string;
    drawErrorTimeOut: number;
    shapeOptionsColor: string;
    showArea: boolean;
}
