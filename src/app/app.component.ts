import { Component, ViewChild } from '@angular/core';
import { LoaderService } from "./shared/modules/loader/loader.service";
import { OnboardingService } from "./services/onboarding.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  displayedColumns = ['Building', 'Floor', 'Actions'];
  constructor(
          private onboardingService: OnboardingService,
          public loaderService: LoaderService
      ) {
          
      }
  
      ngOnInit() {
          this.getAllocations(this.searchString, 0, 10);
          this.getAllOnboardSpace();
      }

      ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
      }

      paginationForAllocations(name){
        this.getAllocations("", name.pageIndex=0, name.pageSize)
      }

      uploadFloorPlan(ele){
        this.uploadFloor = [...this.uploadFloor,ele];
        console.log(this.uploadFloor);
      }
      
      getSearchAllocations(name){
        console.log(name);
        this.getAllocations(name.searchString, name.pageIndex, name.pageSize)
      }

      getAllAllocations(){
        this.getAllocations(this.searchString, 0, 10);
      }

      getAllOnboardSpace(){
        
        this.onboardingService.onboardSpace()
        .subscribe(res => {
          console.log(res);
          this.onboardSpaceResult = res;
          this.flag = true;
        }, err => {
        })
      }

      deleteAllocation(eve){
        console.log(eve);
      }
      
      getAllocations(searchString, pageIndex=0, pageSize=10){
        console.log(searchString);
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
        console.log(eve);
      }

      downloadSeatAllocation(eve){
        console.log(eve);
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

      downloadFloor(eve){
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
        console.log("parent", eve);
        this.onboardingService
            .getFloorDetailsByFloorId()
            .subscribe((res) => {
              this.userInfoMap = res;
            });
      }

      uploadFileInfo(eve){
        console.log(eve);
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