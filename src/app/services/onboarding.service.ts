import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject, BehaviorSubject } from "rxjs";
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
    buildingSubject$ = new BehaviorSubject<any>([]);
    floorSubject$ = new BehaviorSubject<any>([]);
    currentZone;
    constructor(
        public http: HttpClient,
       // @Inject("BASE_URL") baseUrl: string
    ) {
        //this.BASE_URL = environment.BASE_URL+'ems/';
        //alert(baseUrl);
        //this.BASEURL = baseUrl;
       
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




    

    getFloorDetailsByFloorId = () => {
        let url =
            this.BASEURL + `onboarding/floorOnboarding?zoneId=`+this.currentZone;
        return this.http.get(url, this.httpOptions);
    }

    getFloorPlanDetailsByFloorId = (floorId) => {
        let url = "http://10.8.0.42:9988/webconversion/entityInfo/getByExternalFloorId?externalFloorId="+floorId;
        //let url = this.BASEURL + `onboarding/floorOnboarding?zoneId=`+this.currentZone;
        return this.http.get(url,{});
    }


    uploadFile(file) {
        let url = `${this.upload_Url}webconversion/generateTilesUpdated`;
        //let url = "http:// 10.8.0.423:9988/webconversion/generateTilesUpdated";
        const formData: FormData = new FormData();
        formData.append("file", file, file.name);
        formData.append("data",JSON.stringify({"floorId":"acc1"}));
        console.log(formData);
        return this.http
            .post(
                url,
                formData
            )
    }
    uploadFloorPlanFile(file) {
        //let url = `${this.upload_Url}webconversion/generateTilesUpdated`;
        let url = "http://10.8.0.42:9988/webconversion/upload";
        const formData: FormData = new FormData();
        formData.append("file", file, file.name);
        formData.append("data",JSON.stringify({"floorId":"acc11"}));
        console.log(formData);
        return this.http
            .post(
                url,
                formData
            )
    }

    getAllAttributes() {
        
        let url = `http:// 10.8.0.421:9988/webconversion/entityInfo/getByExternalFloorId?externalFloorId=acc1`;
        //let url = "http:// 10.8.0.423:9988/webconversion/generateTilesUpdated";
        return this.http.get<any>(url);
    }
}
