import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar, MatDialog, MatDialogRef } from "@angular/material";

import "rxjs/add/operator/toPromise";
import { environment } from "../../environments/environment";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class CommonService {
    private readonly BASE_URL;

    constructor(
        public matSnackBar: MatSnackBar,
        public http: HttpClient,
        public dialog: MatDialog
    ) {
        this.BASE_URL = environment.BASE_URL + "ems/";
    }

    private currentZoneSource = new BehaviorSubject("");
    currentZone = this.currentZoneSource.asObservable();

     /*****Update header title start *******/
     private headerTitle = new BehaviorSubject("Dashboard");
     updateApprovalMessage(message: string) {
         this.headerTitle.next(message);
     }
     /*****Update header title end *******/

    getConfig(zoneId, moduleId) {
        //{"version":"1.0","clientKey":"ADMIN_WEB_APP","zoneId":5,"sessionId":"{{sessionId}}", "moduleId":102}
        const httpOptions = {
            headers: new HttpHeaders({
                "ss-header":
                    '{"version":"1.0","clientKey":"ADMIN_WEB_APP","zoneId":' +
                    zoneId +
                    ', "moduleId":' +
                    moduleId +
                    ',"sessionId":"' +
                    localStorage.getItem("ssadmin_session") +
                    '"}'
            })
        };
        return this.http
            .get(this.BASE_URL + "module/config", httpOptions)
            .map(function(response) {
                return response;
            });
    }

    getConfigByModuleId(moduleId) {
        let userObj = JSON.parse(localStorage.getItem("userObj"));
        //let enterpriseId = '';
        let headerObj;

        
        if (userObj != null) {
            headerObj = {
                "ss-header":
                    '{"version":"1.0","clientKey":"ADMIN_WEB_APP", "moduleId":' +
                    moduleId +
                    ', "enterpriseId":' +
                    userObj.enterpriseId +
                    "}"
            };
        } else {
            headerObj = {
                "ss-header":
                    '{"version":"1.0","clientKey":"ADMIN_WEB_APP", "moduleId":' +
                    moduleId +
                    "}"
            };
        }
        const httpOptions = {
            headers: new HttpHeaders(headerObj)
        };
        return this.http
            .get(this.BASE_URL + "module/config", httpOptions)
            .map(function(response) {
                return response;
            });
    }

    downloadCSV(res) {
        var hiddenElement = document.createElement("a");
        hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(res);
        hiddenElement.target = "_blank";
        hiddenElement.download = "download.csv";
        document.body.appendChild(hiddenElement);
        hiddenElement.click();
        document.body.removeChild(hiddenElement);
    }
    public userAutoLogin() {
        const httpOptions = {
            headers: new HttpHeaders({
                "ss-header":
                    '{"version":"1.0","clientKey":"ADMIN_WEB_APP","zoneId":5}'
            })
        };
        return this.http.post(this.BASE_URL + "user/autoLogin",{}, httpOptions)
    }

    getNthIndex(str, ch, nth) {
        for (let i = 0; i < str.length; i++) {
            if (str.charAt(i) == ch) {
                if (!--nth) {
                    return i;
                }
            }
        }
        return false;
    }
    
}
