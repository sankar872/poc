import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { AppService } from "./app.service";
import { BookingRequestObject } from "./desk-booking/models/desk-booking.interface";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  bookingObj: BookingRequestObject = {
    endTime: 1606262399000,
    recurringEndTime: 2359,
    recurringStartTime: 1830,
    startTime: 1606176000000,
    userId: 1,
    floorId: 48
  };
  bookingType: string = "department";
  mapData:any = {};
  empAutocompleteList = [];
  depAutocompleteList = [];
  constructor(private appService: AppService) {}
  ngOnInit() {
    if(this.bookingType === "employee") {
      this.bookingObj["user"] = {
        id: 1,
        firstName: "Desmond",
        lastName: "Eagle",
        imageUrl: "",
        name:"Desmond Eagle",
        email:"admin@smarten.com",
        department:"Dev"
      }
    }else {
      this.bookingObj["department"]= {
        id: null,
        name:null,
      }
    }
    this.getMapData(this.bookingObj);
  }
  getMapData(reqObj) {
    let request = {
      request: {
        requestDetails: reqObj,
      },
      zoneId: 57,
    };
    this.appService.getMapData(request).subscribe((res) => {
      this.mapData = res;
    });
  }
  onBookingError(error) {
    console.log(error);
  }
  getUserAutocomplete(searchTerm){
    this.appService.getEmployeeList(searchTerm).subscribe(res => {
      this.empAutocompleteList = res;
    })
  }
  getDepAutocomplete(searchTerm){
    this.appService.getEmployeeList(searchTerm).subscribe(res => {
      console.log(res);
      this.depAutocompleteList = res;
    })
  }
  saveBooking(event) {

  }
}
