import { Injectable, Inject, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable,Subject } from "rxjs";
import { catchError, shareReplay, timeout, tap, filter, switchMap, map } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { ModuleidService } from "../../services/moduleid-service";
import { CommonService } from '../../services/common-service.service';
import { of } from "rxjs/observable/of";
export interface User {
    value: number | string,
    display: string,
    imgUrl?:string,
    legend:string
}
@Injectable()
export class PrientPdfService implements OnInit {
    moduleId;
    BASEURL;
    EMSURL;
    upload_Url;
    currentZone;
    searchTermSubject$ = new Subject<any>();
    searchTermAction$ = this.searchTermSubject$.asObservable();
    emsUserurl;
    // return this.http.get(this.BASE_EMS_URL+endpoint,{params: new ZoneAndModuleHttpParams(zoneId, this.moduleId)});
    emsUserList$ = this.searchTermAction$.pipe(
        filter(([searchParams]) => Boolean(searchParams)),
        switchMap(([searchParams]) =>  this.http.get(`${this.emsUserurl}`)),
        map((res:any) => {
            let user:User[];
            let result = res['response'];
            if(result.length){
                user =  result.map(item => {
                    const fName = (item.firstName.length)? item.firstName.charAt(0): '';
                    const lName = (item.lastName.length)? item.lastName.charAt(0): '';
                    const result = {  value: item.userId, display: item.name, imgUrl: item.imageUrl, legend:  `${fName}${lName}`};
                    return result;
                })
                return user
            }
            // return EMPTY;
        }),
        catchError(err => of(err))
    )
    constructor(
        private http: HttpClient,
        @Inject("BASE_URL") baseUrl: string,
        private toastrService: ToastrService,
        private moduleidService: ModuleidService,
        private commonService: CommonService,
    ) {
        this.BASEURL = baseUrl;
        this.EMSURL = environment.BASE_URL + 'ems/';
        this.upload_Url = environment.BASE_UPLOAD_URL;
        this.moduleId = this.moduleidService.getModueId();
    }

    ngOnInit() {
        this.currentZone = this.commonService.currentZone
        .pipe(
            filter(zone => Boolean(zone))
        ).subscribe(res => {
            this.currentZone = res;
        })
    }

    public requestAutocompleteItems(text){
        // this.emsUserurl=`${this.EMSURL}ems/user/all?sortBy=createdAt&searchColumn=firstName&searchValue=${text}&page=${0}&size=${100000}`;
        this.emsUserurl=`${this.EMSURL}user/search/v2?searchString=${text.trim()}&searchParams=name,email,phone_num`;
        this.searchTermSubject$.next(text);
    }
    getPdf(data) {
        let url =`${this.BASEURL}reports/pdfReport?zoneId=${data.floorId}&mapViewType=${data.view}&showCircles=${data.showCircle}`;
        return this.http.get(url,{});
    }
    sharePdf(data) {
        let url =`${this.BASEURL}reports/sendEmail`;
        return this.http.post(url, data, {});
    }
}