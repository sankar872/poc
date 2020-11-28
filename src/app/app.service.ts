import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { of } from "rxjs/observable/of";

@Injectable()
export class AppService {
  constructor(public http: HttpClient) {}
  getMapData(reqData) {
    const httpOptions = {
      headers: new HttpHeaders({
        "ss-header":
          ' {"version":"1.0","clientKey":"ADMIN_WEB_APP","zoneId":48,"moduleId":1,"sessionId":"7ec95302-fbcb-4301-9acc-9f22af8b2b1d"}',
      }),
    };
    let url = `https://preprodspacemanagementv2.smartenspaces.com/spacemanagement/entity/availabilityMapView`;
    return this.http
      .post<any>(url, reqData, httpOptions)
      .pipe(map((res) => res["response"]));
  }
  getEmployeeList(searchTerm) {
    let term = searchTerm.trim();
    let url = `https://preprodspacemanagementv2.smartenspaces.com/ems/user/search/v2?searchString=${term}&searchParams=name,email,phone_num`;
    const httpOptions = {
      headers: new HttpHeaders({
        "ss-header":
          ' {"version":"1.0","clientKey":"ADMIN_WEB_APP","zoneId":48,"moduleId":1,"sessionId":"7ec95302-fbcb-4301-9acc-9f22af8b2b1d"}',
      }),
    };
    return this.http.get<any>(url, httpOptions).pipe(
      map((res) => {
        let userArr = [];
        if (res["response"]) {
          let data = res["response"];
          if (data.length) {
            data.forEach((element) => {
              userArr = [
                ...userArr,
                {
                  id: element.userId,
                  firstName: element.firstName,
                  lastName: element.lastName,
                  imageUrl: element.imageUrl,
                  name: `${element.firstName} ${element.lastName}`,
                  email: element.email,
                  department: element.departName,
                },
              ];
            });
            return userArr;
          }
        }
      }),
      catchError((err) => of([]))
    );
  }
}
