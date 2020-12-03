import { Component, ViewChild } from '@angular/core';
import { LoaderService } from "./shared/modules/loader/loader.service";
import { OnboardingService } from "./services/onboarding.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { AppService } from "./app.service";
import { BookingRequestObject } from "./desk-booking/models/desk-booking.interface";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {

  bookingObj: BookingRequestObject = {
    endTime: 1606867199000,
    recurringEndTime: 2359,
    recurringStartTime: 1230,
    startTime: 1606780800000,
    userId: 1,
    user:{
      id: 1,
      firstName: "sam",
      lastName:"andrew",
      imageUrl:null,
      name:"sam andrew",
      email:"sam@ss.com",
      department:"Finance"
    },
    department:{
      id:1,
      name:"Finance"
    },
    zoneId: 5
  };
  bookingType: string = "department";
  mapData:any = {};
  empAutocompleteList = [];
  depAutocompleteList = [];

  currentBuildingId;
  currentFloorId;

  legendData = [{
    'color': "red",
    'name': "Occupied"
  },
  {
    'color': "green",
    'name': "Available"
  },
  {
    'color': "yellow",
    'name': "Type 1"
  },
  {
    'color': "pink",
    'name': "Type 2"
  },
  {
    'color': "blue",
    'name': "Type 3"
  },
  {
    'color': "orange",
    'name': "Type 4"
  },
  {
    'color': "maroon",
    'name': "Type 5"
  },
  {
    'color': "SkyBlue",
    'name': "Type 6"
  },
  {
    'color': "gray",
    'name': "Type 7"
  },
  {
    'color': "brown",
    'name': "Type 8"
  }];

  title = 'app';
  searchCriteria = [{'id':'1', 'name':'Department', 'searchKey': 'departmentName'},
                      {'id':'2', 'name':'User', 'searchKey': 'user'},
                      {'id':'3', 'name':'Floor', 'searchKey': 'floor'},
                      {'id':'4', 'name':'Desk Number', 'searchKey': 'deskNumber'}];
  searchString = '';
  allocationResult:any;
  onboardSpaceResult:any;
  userInfoMap:any;
  flag:boolean = false;
  uploadFloor = [];
  openFloor = [];
  mapView = 'listPage';
  seatMetaInfo:any = [];
  selectedFloor = 'acc1';
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  displayedColumns = ['Building', 'Floor', 'Actions'];

  selectedDate = new Date();
  dayTime = "0000";
  displayAnalysticMap = [];
  activeLink = 'Onboard Space';
  userInfo:any;

  constructor(
          private onboardingService: OnboardingService,
          public loaderService: LoaderService,
          private appService: AppService
      ) {
        this.$save.pipe(debounceTime(1000)).subscribe((event: any) => {
          this.receivedDataFromChild(event);
        });
      }
  
      ngOnInit() {
          this.getAllocations(this.searchString, 0, 10);
          this.getAllOnboardSpace();

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
                id:1,
                name:"Finance"
            }
          }
          this.getMapData(this.bookingObj);

          this.getAnalytics('department');
      }

      ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
      }

      //Onboard space Start
      //Onboard space download start
      downloadSuccess(eve){
        var data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
        var csvContent = "data:text/csv;charset=utf-8,";
        data.forEach(function(infoArray, index){

          let dataString = infoArray.join(",");
          csvContent += index < infoArray.length ? dataString+ "\n" : dataString;

        }); 

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_data.csv");

        link.click();
      }
      
      downloadError(eve){
        alert("Download having some issue");
      }
      //Onboard space download end

      //Onboard space upload Floor start
      uploadFloorSuccessCallback(eve){
        alert("Successfully uploaded..");
        console.log(eve);
      }

      uploadFloorErrorCallback(eve){
        alert("Error in uploading..");
        console.log(eve);
      }

      onUploadAutocadFile = async event => {
        var fileName = event.target.value;
        var fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
        fileType = fileType.toLowerCase();
        if (fileType !== 'dwg') {
          this.uploadFloorErrorCallback('Not a valid file');
          return;
        }
        const fileData = event.target.files[0];
        if (event.target.files && event.target.files[0]) {
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          const uploadFileObj$ = await this.onboardingService.uploadFloorPlanFile(fileData)
        .subscribe(
            async res => {
              this.uploadFloorSuccessCallback(res);
            },
            err => {
              this.uploadFloorErrorCallback(err);
            }
          );
        }
      };
      //Onboard space upload Floor end




      openFloorError(eve){
        console.log(eve);
        alert("Error in loading the leaflet map");
      }
      deptFloorError(event){
        console.log(event);
        alert("Error in loading the department view");
      }
      //Onboard space End

      //Space view start

      $save: Subject<void> = new Subject<void>();
    
      requestForSearchSlide(eve){
        this.$save.next(eve);
        
      }

      getAnalytics(type) {
        this.currentBuildingId  = 56;
        this.currentFloorId = 57;
        this.getData();
      }

      receivedDataFromChild(event) {
        this.selectedDate = new Date(event.timeStamp);
        this.dayTime = event.dayTime;
        this.getData();
      }

      getData = () => {
          let selectedDate = this.getTimeStamp(this.selectedDate.getTime(), "start");
          // let selectedDate = new Date(this.selectedDate).setHours(0,0,0,0);
          if (!this.currentFloorId) {
              alert(
                  "Kindly Select Building and Floor Details"
              );
              return;
          }
          let reqObj: any = {
              dayTime: +this.dayTime,
              viewType: "DEPARTMENT",
              floorId: this.currentFloorId,
              timestamp: selectedDate,
          };
          this.appService.getSpaceViewAnalytics(
              reqObj
          ).subscribe(res=>{
            this.displayAnalysticMap = [...this.displayAnalysticMap, res]
          });
      };

      analysticSucess(eve){
        console.log(eve);
        alert("Map loaded successfully");
      }

      analysticError(eve){
        console.log(eve);
        alert("Map not loaded");
      }

      showUserInfo:boolean = false;
      selectedSeatInfo = [];
      seatInfoCallBack(eve){
        console.log(eve);

        if(this.activeLink == 'Onboard Space') {
          
        } else if(this.activeLink == 'Desk Booking') {
          this.selectedSeatInfo.push(eve.label);
          this.colMapPx = "col-9";
          this.colUserPx = "col-3";
        } else {
          this.showUserInfo = true;
          
        
          this.userInfo = {
            firstname : "Venkat",
            lastname  : "Nuni",
            seatInfo : eve.label,
            phoneNumber: "1234567890",
            department: "HR",
            company: "SmartenSpace",
            city: "New York"
          };

          this.colMapPx = "col-9";
          this.colUserPx = "col-3";
          
        }
      }
      //Space view end

      deleteSeat(i){
        this.selectedSeatInfo.splice(i, 1);
        if(this.selectedSeatInfo.length == 0){
          this.colMapPx = "col-12";
          this.colUserPx = "";
        }
      }


      openFloorSuccess(eve){
        console.log(eve);
        alert("opened Successfully");
      }

      deptFloorSuccess(event){
        console.log(event);
        alert('department view success');
      }











      paginationForAllocations(name){
        this.getAllocations("", name.pageIndex=0, name.pageSize)
      }

      uploadFloorPlan(ele){
        ele['url'] = "http://google.com";
        document.getElementById('fileInput').click();
        //this.uploadFloor = [...this.uploadFloor,ele];
      }

      openFloorPlan(ele){
        this.openFloor = [];
        ele['url'] = "http://google.com";
       // ele["seatMetaInfo"] = [];
        ele["userMetaInfo"] = [];
        ele["floorId"] = "acc11";
        ele["seatMetaInfo"] = [{
          'seatId' : "A/088",
          'color'  : "red"
        },{
          'seatId' : "A/016",
          'color'  : "red"
        }];

        this.openFloor = [...this.openFloor,ele];
        this.mapView = "showMap";
      }

      colMapPx = "col-12";
      colUserPx = "";
      getFloorInfo(eve, pageType) {
        console.log(this.openFloor);
        this.openFloor = [];
        let ele = {};
        if(pageType == 'spaceview') {
          ele['url'] = "http://google.com";
          ele["seatMetaInfo"] = [];
          ele["userMetaInfo"] = [];
          ele["floorId"] = this.selectedFloor;
        } else if(pageType == 'allocation') {
          ele['url'] = "http://google.com";
          ele["seatMetaInfo"] = [];
          ele["userMetaInfo"] = [{
            name: 'venkat',
            lastName: 'Nuni',
            seatId: 'B/001'
          }];
          ele["floorId"] = this.selectedFloor;
        } else if(pageType == 'deskbooking') {
          ele['url'] = "http://google.com";
          ele["seatMetaInfo"] = [];
          ele["userMetaInfo"] = [];
          ele["floorId"] = this.selectedFloor;
        } else if(pageType == 'departmentview') {
          ele['url'] = "http://google.com";
          ele["seatMetaInfo"] = [{
            'seatId' : "A/088",
            'color'  : "red"
          },{
            'seatId' : "A/016",
            'color'  : "red"
          },
          {
            'color': "red",
            'seatId' : "A/076",
          },
          {
            'color': "green",
            'seatId' : "A/066",
          },
          {
            'color': "yellow",
            'seatId' : "A/056",
          },
          {
            'color': "pink",
            'seatId' : "A/046",
          },
          {
            'color': "blue",
            'seatId' : "A/036",
          },
          {
            'color': "orange",
            'seatId' : "A/028",
          },
          {
            'color': "maroon",
            'seatId' : "A/038",
          },
          {
            'color': "SkyBlue",
            'seatId' : "A/048",
          },
          {
            'color': "gray",
            'seatId' : "A/058",
          },
          {
            'color': "brown",
            'seatId' : "A/068",
          }]
          ele["userMetaInfo"] = [];
          ele["floorId"] = this.selectedFloor;
        } 
        this.openFloor = [...this.openFloor,ele];
        //this.mapView = "showMap";
        this.showUserInfo = false;
       
      }
      
      getSearchAllocations(name){
        this.getAllocations(name.searchString, name.pageIndex, name.pageSize)
      }

      getAllAllocations(){
        this.getAllocations(this.searchString, 0, 10);
      }

      getAllOnboardSpace(){
        
        this.onboardingService.onboardSpace()
        .subscribe(res => {
          this.onboardSpaceResult = res;
          this.flag = true;
        }, err => {
        })
      }

      deleteAllocation(eve){
        alert("will call delete API");
      }
      
      getAllocations(searchString, pageIndex=0, pageSize=10){
          const allocation$ = this.onboardingService.searchAllocation(
              searchString,
              pageSize,
              pageIndex
          )
          .subscribe(res => {
            this.allocationResult = res;
            this.flag = true;
          }, err => {
          })
      }

      userFileUpload(eve){
        
      }


      tabClick(eve){
        this.openFloor = [];
        this.selectedSeatInfo = [];
        this.mapView = 'listPage';
        this.colMapPx = "col-12";
        this.colUserPx = "";
        this.showUserInfo = false;
        this.activeLink = eve.tab.textLabel;
        //if(eve.index)
      }

      downloadSeatAllocation(eve){
        var data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
        var csvContent = "data:text/csv;charset=utf-8,";
        data.forEach(function(infoArray, index){

          let dataString = infoArray.join(",");
          csvContent += index < infoArray.length ? dataString+ "\n" : dataString;

        }); 

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_data.csv");

        link.click();
      }

      

      leafMapParent(eve) {
        this.onboardingService
            .getFloorDetailsByFloorId()
            .subscribe((res) => {
              this.userInfoMap = res;
            });
      }

      

      getMapData(reqObj) {
        let request = {
          request: {
            requestDetails: reqObj,
          },
          zoneId: 257,
        };
        this.appService.getMapData(request).subscribe((res) => {
          this.mapData = res;
        });
      }
      onBookingError(error) {
       
      }
      getUserAutocomplete(searchTerm){
        this.appService.getEmployeeList(searchTerm).subscribe(res => {
          this.empAutocompleteList = res;
        })
      }
      getDepAutocomplete(searchTerm){
        this.appService.getEmployeeList(searchTerm).subscribe(res => {
          this.depAutocompleteList = res;
        })
      }
      saveBooking(event) {
    
      }

      viewList(eve){
        console.log(eve);
        this.mapView = eve;
      }

      

    timeConverter(UNIX_timestamp) {
        let a = new Date(parseInt(UNIX_timestamp));
        let months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];
        let date = (a.getDate().toString().length <= 1) ? 0+a.getDate().toString(): a.getDate().toString()
        let month = ((a.getMonth()+1).toString().length <= 1) ? 0+(a.getMonth()+1).toString(): (a.getMonth()+1).toString();
        let year = a.getFullYear();
        let monthString = months[a.getMonth()];
        let hour = a.getHours();
        let min = a.getMinutes();
        let sec = a.getSeconds();
        let timeStampObj: any = {};
        timeStampObj.UNIXtimeStamp = a;
        timeStampObj.date = date;
        timeStampObj.monthString = monthString;
        timeStampObj.month = month;
        timeStampObj.year = year;
        timeStampObj.hour = hour;
        timeStampObj.min = min;
        timeStampObj.sec = sec;

        return timeStampObj;
    }
    getTimeStamp(dateObj, type="start"){
        let timeStampObj = this.timeConverter(dateObj);
        if(type === "start") {
            return new Date(`${timeStampObj.year}-${timeStampObj.month}-${timeStampObj.date}T00:00:00.000+00:00`).getTime();
        }else {
            return new Date(`${timeStampObj.year}-${timeStampObj.month}-${timeStampObj.date}T23:59:59.000+00:00`).getTime();
        }
    }

    

    onSubmit = (event) => {
      alert(`your booking request object:, ${JSON.stringify(event)}`);
    }

}

export interface Element {
  building: string;
  floor;
}

const ELEMENT_DATA: Element[] = [
  {building: 'Buliding 1', floor: "F1"},
  {building: 'Buliding 2', floor: "F2"},
  {building: 'Buliding 3', floor: "F3"},
  {building: 'Buliding 4', floor: "F4"},
  {building: 'Buliding 5', floor: "F5"},
  {building: 'Buliding 6', floor: "F6"},
  {building: 'Buliding 7', floor: "F7"},
  {building: 'Buliding 8', floor: "F8"},
  {building: 'Buliding 9', floor: "F9"},
  {building: 'Buliding 10', floor: "F10"},
  {building: 'Buliding 11', floor: "F11"},
  {building: 'Buliding 12', floor: "F12"},
  {building: 'Buliding 13', floor: "F13"},
  {building: 'Buliding 14', floor: "F14"},
  {building: 'Buliding 15', floor: "F15"},
  {building: 'Buliding 16', floor: "F16"},
  {building: 'Buliding 17', floor: "F17"},
  {building: 'Buliding 18', floor: "F18"},
  {building: 'Buliding 19', floor: "F19"},
  {building: 'Buliding 20', floor: "F20"},
  {building: 'Buliding 21', floor: "F21"}
];
