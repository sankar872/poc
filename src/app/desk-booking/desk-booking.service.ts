import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class DeskBookingService {
  constructor(
    public http: HttpClient,
  ) {}
  getMapData(reqData) {
    const httpOptions ={
      headers: new HttpHeaders({
          'ss-header': ' {"version":"1.0","clientKey":"ADMIN_WEB_APP","zoneId":48,"moduleId":1,"sessionId":"7ec95302-fbcb-4301-9acc-9f22af8b2b1d"}'
      })
  };
    let url = `https://demodeskmanagement.smartenspaces.com/spacemanagement/entity/availabilityMapView`;
        return this.http
            .post<any>(url, reqData, httpOptions)
            .pipe(
                map((res) => res["response"])
            );
  }
  availableEntitiesInArea(reqData, zoneId) {
    const httpOptions ={
      headers: new HttpHeaders({
          'ss-header': ' {"version":"1.0","clientKey":"ADMIN_WEB_APP","zoneId":48,"moduleId":1,"sessionId":"7ec95302-fbcb-4301-9acc-9f22af8b2b1d"}'
      })
  };
    let url = `https://demodeskmanagement.smartenspaces.com/spacemanagement/entity/availableEntitiesInArea`;
        return this.http
            .post<any>(url, reqData, httpOptions)
            .pipe(
                map((res) => res["response"])
            );
  }
}