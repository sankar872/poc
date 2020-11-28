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
  SimpleChanges,
  SimpleChange
} from "@angular/core";
import { CommonService } from "../../services/common-service.service";
import { OnboardingService } from '../../services/onboarding.service';
//import { Route, Router, ActivatedRoute } from "@angular/router";
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

import { of } from "rxjs/observable/of";

@Component({
  selector: 'app-onboard-space',
  templateUrl: './onboard-space.component.html',
  styleUrls: ['./onboard-space.component.scss'],
})
export class OnboardSpaceComponent implements OnInit {

  @Input() uploadFloor:any;
  @Output() downloadFloor = new EventEmitter<String>();
  @Output() uploadFileInfo = new EventEmitter<any>();
  FloorData = [];
  fileInput:HTMLElement = document.getElementById('fileInput') as HTMLElement;
  spans = [];
  workstationColorArr = [];
  totalRecords = 0;
  isFileUploaded: boolean = false;
  showTableData:boolean = false;
  fileName: string = 'Upload File';
  workstationList = [];
  //floor-leaflet-data
  stepper = 'first';

  constructor(
    public dialog: MatDialog,
    public toastrService: ToastrService,
    public onboardingService: OnboardingService
) {}

  ngAfterViewInit() {
    //this.uploadFloor.subscribe(data => this.FloorData = data);
    console.log(this.FloorData);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(typeof changes['uploadFloor']['currentValue'] != 'undefined' && changes['uploadFloor']['currentValue'].length>0) {
      document.getElementById('fileInput').click();
    }
    
  }
  /*
  "Buildings",
        "Floor",
        "Createdby",
        "Capacity",
        "Lease Start"*/



  ngOnInit() {
   
  }

  download(){
    this.downloadFloor.emit("downloadFloor");
  }


  onUploadAutocadFile = async event => {
    var fileName = event.target.value;
    var fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
    fileType = fileType.toLowerCase();
    if (fileType !== 'dwg') {
      this.toastrService.error('Not a valid file');
      return;
    }
    const fileData = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      this.fileName = event.target.files[0].name;
      const uploadFileObj$ = await this.onboardingService.uploadFile(fileData)
    .subscribe(
        async res => {
          alert("uploaded successfully...");
          this.isFileUploaded = true;
          this.uploadFileInfo.emit(res);
        },
        err => {
          alert("not uploaded successfully...");
        }
      );
    }
  };



}