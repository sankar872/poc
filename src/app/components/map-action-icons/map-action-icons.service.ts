import { Injectable, Inject, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject} from "rxjs";
import { catchError, shareReplay, timeout, tap, filter, switchMap, map } from "rxjs/operators";
import { of } from "rxjs/observable/of";
export interface User {
    value: number | string,
    display: string,
    imgUrl?:string,
    legend:string
}
@Injectable()
export class MapActionIconsService implements OnInit {
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
        switchMap(([searchParams]) =>  this.http.get(`${this.emsUserurl}`,{})),
        map((res:any) => {
            let user:User[];
            let result = res['response']['content'];
            if(result.length){
                user =  result.map(item => {
                    const fName = (item.firstName.length)? item.firstName.charAt(0): '';
                    const lName = (item.lastName.length)? item.lastName.charAt(0): '';
                    const result = {  value: item.userId, display: item.name, imgUrl: item.imageUrl, legend:  `${fName} ${lName}`};
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
    ) {
        //this.BASEURL = baseUrl;
    }

    ngOnInit() {
        
    }

    // public requestAutocompleteItems(text){
    //     this.emsUserurl=`${this.EMSURL}ems/user/all?sortBy=createdAt&searchColumn=firstName&searchValue=${text}&page=${0}&size=${100000}`;
        
    //     this.searchTermSubject$.next(text);
    // }
}