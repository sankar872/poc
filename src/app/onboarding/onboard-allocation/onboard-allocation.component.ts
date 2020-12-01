import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { CommonService } from "../../services/common-service.service";
import { OnboardingService } from "../../services/onboarding.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

//modal
import { LoaderService } from "../../shared/modules/loader/loader.service";
import { ToastrService } from "ngx-toastr";
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { BehaviorSubject, Observable, Subject, pipe} from "rxjs";
import { catchError, tap, filter, switchMap, mergeMap, startWith, debounceTime, map, takeUntil, distinctUntilChanged } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs/observable/of";

@Component({
  selector: "app-onboard-allocation",
  templateUrl: "./onboard-allocation.component.html",
  styleUrls: ["./onboard-allocation.component.scss"],
  //changeDetection: ChangeDetectionStrategy.Default
})


export class OnboardAllocationComponent implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject<void>();
    headerTitle = "Allocation";
    public fileToUpload: File;
    @ViewChild("labelImport")
    labelImport: ElementRef;

    currentSelectedRow;
    showMap: boolean = false;
    @Input() allocationResult:any;
    @Input() userInfoMap:any;
    userInfoMapData:any;
    @Output() paginationForAllocations = new EventEmitter<String>();
    @Output() downloadSeatAllocation = new EventEmitter<String>();
    @Output() userFileUpload = new EventEmitter<FileList>();
    @Output() getAllAllocations = new EventEmitter<any>();
    @Output() getSearchAllocations = new EventEmitter<any>();
    @Output() deleteAllocation = new EventEmitter<any>();
    @Output() leafMapParent = new EventEmitter<any>();
    
    displayedColumns: string[] = [
        "employeecode",
        "name",
        "department",
        "desk",
        "floor",
        "building",
        "location",
        "Status",
        "locate",
        "Action",
    ];
    length = 10;
    searchString = '';
    categoryName=null;
    uploadFile:any;
    leafletMapParent:any;

    registerForm = this.formBuilder.group({
        searchBy: ["", Validators.required],
        searchVal: ["", Validators.required],
        floorName: [""],
        deskNumber: [""]
    });

    constructor(
            private commonService: CommonService,
            public dialog: MatDialog,
            public loaderService: LoaderService,
            private confirmationDialogService: ConfirmationDialogService,
            private toastr: ToastrService,
            private formBuilder: FormBuilder,
            public onboardingService: OnboardingService
        ) {
            
    }

    ngOnInit() {
       
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["allocationResult"] && typeof changes["allocationResult"]["currentValue"] != 'undefined') {
            //this.userInfoMapData = changes["allocationResult"]["currentValue"];
                this.getAllocations();
        }

        if (changes["userInfoMap"] && typeof changes["userInfoMap"]["currentValue"] != 'undefined') {
            this.userInfoMapData = changes["userInfoMap"]["currentValue"];
            setTimeout(() => {
                this.showMap = true;
            }, 2000);
        }
    }

    getAllocations(){
            let res = this.allocationResult;
            this.dataSource = res["response"]["content"];
            this.length = res["response"]["totalElements"];
            this.pageIndex = this.length < 2 ? 0 : res["response"]["number"];
    }

    getNextRecords(event) {
        this.paginationForAllocations.emit(event);
    }

    uploadCSV(files: FileList) {
        alert();
        this.labelImport.nativeElement.innerText = Array.from(files)
            .map((f) => f.name)
            .join(", ");
        this.fileToUpload = files.item(0);
        this.uploadFile = files;
        
    }


    uploadFileToActivity() {
        if (this.fileToUpload) {
            const allocation$ = this.onboardingService.uploadFile(
                this.fileToUpload
            )
            .subscribe(
                (data) => {
                    
                })
            //this.userFileUpload.emit(this.uploadFile);
        } else {
            alert("No file selected!");
        }
    }

    download() {
        let data = "USER_ALLOCATION";
        this.downloadSeatAllocation.emit(data);
    }

    reset(){
        this.submitted=false;
        this.registerForm.controls.searchBy.reset();
        this.registerForm.controls.searchVal.reset();
        this.registerForm.controls.deskNumber.reset();
        this.registerForm.controls.floorName.reset();
        this.searchString = '';
        this.getAllAllocations.emit();
    }

    onSubmitSearch(){
        if(this.categoryName != "null" && this.categoryName != null && this.categoryName != undefined){
            this.changeValidationNames();
         }else{
             this.fieldData = "Field";
         }
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        
        if(this.registerForm.value.searchBy == 'user')
        {
            if(this.selectedData.userId){
                this.searchString = 'searchCriteria=USER&id='+this.selectedData.userId;
            }else{
                this.toastr.error('Invalid search parameters. Please select user from dropdown');
            }
        }else if(this.registerForm.value.searchBy == 'departmentName')
        {
            if(this.selectedData.userId){
                this.searchString = 'searchCriteria=DEPARTMENT&id='+this.selectedData.userId;
            }else{
              this.toastr.error('Invalid search parameters. Please select department from dropdown');
            }
        }else if(this.registerForm.value.searchBy == 'floor')
        {
            if(this.floor.zoneId){
                this.searchString = 'searchCriteria=FLOOR&id='+this.floor.zoneId;
            }else{
                this.toastr.error('Invalid search parameters. Please select floor from dropdown');
            }
        }
        else if(this.registerForm.value.searchBy == 'deskNumber')
        {
            if(this.floor.zoneId){
                this.searchString = 'searchCriteria=DESK&id='+this.floor.zoneId+'&deskName='+this.registerForm.controls.deskNumber.value;
            }else{
                this.toastr.error('Invalid search parameters. Please select floor from dropdown');
            }
        }
        let data = {
            "searchString":this.searchString,
            "pageIndex": this.pageIndex,
            "pageSize": this.pageSize
        };
        this.getSearchAllocations.emit(data);

            // this.dataSource = new MatTableDataSource();
            // this.dataSource = new MatTableDataSource(
            //     res["response"]["content"]
            // );
            // this.length = res["response"]["totalElements"];
            // this.pageIndex =
            //     this.length < 2 ? 0 : res["response"]["number"];

    }

    changeValidationNames(){
        if(this.categoryName == 'departmentName'){
            this.fieldData = "Department";
        }
        else if(this.categoryName == 'user'){ 
            this.fieldData = "Username"; 
        }
        else if(this.categoryName == 'floor'){ 
            this.fieldData = "Building Name";
         }
        else if(this.categoryName == 'deskNumber'){ 
            this.fieldData = "Building Name";
        }
    } 

    deleteWorkstation(element){
        this.deleteMessage = "Are you sure you want to delete allocation for " + element.user.name + "?";
        let data = {
                      "id": element.id,
                      "featureKey": "REGULAR"
                   };
        //this.deleteAllocation.emit(data);          
        this.confirmationDialogService
            .confirm('',this.deleteMessage)
            .then(confirmed => {
                if (confirmed == true) {
                    let data = {
                        "id": element.id,
                        "featureKey": "REGULAR"
                    };
                    this.deleteAllocation.emit(data);          
                }
            });
    }

    openAllocationMap(ele) {
        this.showMap = false;
        this.currentSelectedRow = ele;
        let reqObj = {
            zoneId: ele['entityChildType']['zoneId'],
        };
        this.leafletMap(reqObj);
    }

    leafletMap(eve){
        this.leafMapParent.emit(eve);
    }

    userInfoMaps(eve){
        
    }


















  currentZone:any = 5;


  searchQueryItems = { searchType: "", searchValue: "", floorName: "" };
  pageSizeOptions = [2, 5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;
  allStatus = [];


  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userRow;

  buildingArr: any[];
  locationAvailabilityObs$: any;
  locationAvailabilityData: any;
  currentViewObs$ = new BehaviorSubject("allocationView");
  currentView$: Observable<string> = this.currentViewObs$.asObservable();
  mapViewObs$: any;
  mapData: any;
  
  fieldData;
  deleteMessage;
 
  
  showFloorName = false;
  floor;
  deskNum;
  uploadData;
  showDeskNumber = false;
  placeholderValue = '';
  submitted = false;
  
  


  /** */
  floorSearchSub$ = new BehaviorSubject<any>("");
  floorSearchAction$ = this.floorSearchSub$.asObservable();
  floorList = [];
  floorAutoComplete$ =  this.floorSearchAction$
  .pipe(
      debounceTime(200),
      map(searchTerm => {
          let result = [];
          let term =searchTerm.toString().trim();
          if(term === "") {
              return (this.floorList.length)? this.floorList: [];
          }
          result = this.floorList.filter(floor => {
              let floorName = floor["name"].toLowerCase().toString();
              let res = floorName.indexOf(term);
              if (res >= 0) {
                  return floor;
              }
          })
          return result
      }),
      )
  isloading: boolean = false;
  searchBy: any;
  searchTermSubject$ = new Subject<any>();
  searchTermAction$ = this.searchTermSubject$.asObservable();
  
  selectedData: any = {};
  /** */

  

  ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
  }

  getSearchCategory(value){
      this.searchTermSubject$.next("");
      this.floorSearchSub$.next("");
      this.searchBy = value;
      this.selectedData = {};
      let frmControl = this.f;
      frmControl.searchVal.setValue("");
      frmControl.floorName.setValue("");
      this.submitted = false;
      if(value == 'floor'){
          this.showFloorName = true;
          this.registerForm.get('floorName').setValidators([Validators.required]);
          this.registerForm.get('deskNumber').clearValidators();
      }  
      else
          this.showFloorName = false;
      if(value == 'departmentName'){ 
          this.fieldData = "Department";
          this.showDeskNumber = false;
          this.showFloorName = false;
          this.placeholderValue = 'Department Name';
          this.registerForm.get('floorName').clearValidators();
          this.registerForm.get('deskNumber').clearValidators();  
      }
      else if(value == 'user'){ 
          this.fieldData = "Username";
          this.showDeskNumber = false;
          this.showFloorName = false;
          this.placeholderValue = 'Email or Name or Phone Number';
          this.registerForm.get('floorName').clearValidators();
          this.registerForm.get('deskNumber').clearValidators();
        }
      else if(value == 'floor'){ 
          this.fieldData = "Building Name";
          this.showDeskNumber = false;
          this.placeholderValue = 'Enter Building Name';
          this.registerForm.controls.searchVal.reset();
          this.registerForm.controls.floorName.reset();
       }
      else if(value == 'deskNumber'){ 
          this.fieldData = "Building Name";
          this.showDeskNumber = true;
          this.showFloorName = true;
          this.placeholderValue = 'Enter Building Name';
          this.registerForm.get('floorName').setValidators([Validators.required]);
          this.registerForm.get('deskNumber').setValidators([Validators.required]);
       }
  }

  get f() {
      return this.registerForm.controls;
  }

  


  editAllocation(ele) {
      let data = {
          type: "editAllocation",
          status: this.allStatus,
          selectedStatus: ele.user.userActivityStatus,
          currentZone: this.currentZone,
          allocation: ele,
      };
  }





  getAllStatus() {
  }


  


  goBack() {
      this.showMap = false;
  }


  getAvailabilityView() {
      this.buildingArr = [];
      this.loaderService.loadingOn();

    
  }
  showMapToBook = (event) => {
      
      this.loaderService.loadingOn();
      let data = {
          reallocationInformationDto: this.userRow,
          zoneId: event["zoneInfo"]["id"],
      };
     
  };
  
  goPreviousPage(event) {
      this.currentViewObs$.next(event);
  }

  getAutocompleteList = (searchTerm) => {
      this.searchTermSubject$.next(searchTerm.trim());
  };
  onselectData(val) {
    
  }
  onselectFloorData(val) {
      this.floor = val;
  }
  setFloorSearch(term) {
      this.floorSearchSub$.next(term.trim());
  }
}
