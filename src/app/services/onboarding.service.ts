import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { ModuleidService } from "../services/moduleid-service";
import { tap, shareReplay, map, catchError } from "rxjs/operators";
import { _throw } from 'rxjs/observable/throw';
import { environment } from "../../environments/environment";
import { of } from "rxjs/observable/of";
@Injectable()
export class OnboardingService {
    moduleId;
    BASEURL;
    EMSURL;
    BASEEMSURL;
    upload_Url
    httpOptions:any;
    departmentSubject$ = new BehaviorSubject<any>([]);
    departments$ = this.departmentSubject$.asObservable();
    buildingSubject$ = new BehaviorSubject<any>([]);
    buildings$ = this.buildingSubject$.asObservable();
    floorSubject$ = new BehaviorSubject<any>([]);
    floors$ = this.floorSubject$.asObservable();
    currentZone;
    constructor(
        public http: HttpClient,
        @Inject("BASE_URL") baseUrl: string,
        public moduleidService: ModuleidService
    ) {
        //this.BASE_URL = environment.BASE_URL+'ems/';
        //alert(baseUrl);
        this.BASEURL = baseUrl;
        this.EMSURL = environment.BASE_URL + "ems/";
        this.BASEEMSURL = environment.BASE_URL;
        this.upload_Url = environment.BASE_UPLOAD_URL;
        this.moduleId = moduleidService.getModueId();
        this.currentZone = 55;
        this.httpOptions ={
            headers: new HttpHeaders({
                'ss-header': '{"version":"1.0","clientKey":"ADMIN_WEB_APP","zoneId":53,"moduleId":1,"sessionId":"23ad1275-2ef6-4a3e-90f8-81e90d1def98"}'
            })
        };
    }

    private _refreshNeeded = new Subject<void>();
    get refreshNeeded() {
        return this._refreshNeeded;
    }




    searchAllocation(searchString, pageSize, pageIndex) {
        let url =
            this.BASEURL +
            `allocation/search?` +
            searchString +
            `&size=` +
            pageSize +
            `&page=` +
            pageIndex +
            `&isPermanant=true`;
        return this.http.get<any>(url,this.httpOptions);
    }

    getFloorDetailsByFloorId() {
        let url =
            this.BASEURL + `onboarding/floorOnboarding?zoneId=`+this.currentZone;
        return this.http.get<any>(url, this.httpOptions);
    }

    onboardSpace(){
        let url = this.BASEURL +"onboarding/floorDetails?states=PARTIAL,COMPLETE";
        return this.http.get<any>(url,this.httpOptions);
    }

    uploadFile(file) {
        alert();
        let url = `${this.upload_Url}webconversion/generateTilesUpdated`;
        const formData: FormData = new FormData();
        formData.append("file", file, file.name);

        return this.http
            .post(
                url,
                formData
            )
    }
}
