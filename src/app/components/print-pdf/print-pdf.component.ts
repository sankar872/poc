import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PrientPdfService } from "./print-pdf.service";
import { catchError, tap, filter, first, debounceTime, map, startWith } from 'rxjs/operators';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { LoaderService } from "../../shared/modules/loader/loader.service";
import { of } from 'rxjs/observable/of';

@Component({
    selector: 'print-pdf',
    styleUrls: ['print-pdf.component.scss'],
    templateUrl: 'print-pdf.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintPdfComponent implements OnInit, OnDestroy {
    @Input()
    currentZone;
    @Input()
    view;
    @Input()
    floorId;
    @Input()
    showCircle;
    printStepperSubject$ = new BehaviorSubject<number>(1);
    printStepper$ = this.printStepperSubject$.asObservable();
    userMsg: string = "";
    form: FormGroup;
    searchUserList = [];
    @Output()
    closePopup = new EventEmitter()
    pdfUrl;
    blob: Blob;
    url: string;
    // @ViewChild("input", { static: false })input: ElementRef;
    userList$ =this.printPdfService.emsUserList$.pipe(tap(() => this.isloading = false));


    //mat autocomplete
    visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [];
  searchInpCtrl = new FormControl();
  isloading:boolean = false;
  @ViewChild('Input') Input: ElementRef;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
    //mat autocomplete

    constructor(
        private toastrService: ToastrService,
        private printPdfService: PrientPdfService,
        private loaderService: LoaderService,
        ) {
            // this.currentZone = this.data["currentZone"];
            this.form = new FormBuilder().group({
                userTags: [['usertag'], [Validators.required]]
            });
        }
    ngOnInit() {
    }
    ngOnDestroy() {
        if(this.url) {
            window.URL.revokeObjectURL(this.url);
        }
    }
    getPdf() {
        this.loaderService.loadingOn();
        let reqObj = {
            floorId : this.floorId,
            showCircle: this.showCircle,
            view: this.view
        }
        this.printPdfService.getPdf(reqObj).pipe(
            tap(() => this.loaderService.loadingOff()),
            catchError(err => {
                this.loaderService.loadingOff();
                return of(err)   
            })
        ).subscribe(res => {
            this.blob = res
            this.url = window.URL.createObjectURL(this.blob);
            this.printStepperSubject$.next(2);
        })
    }
    viewPdf() {
        if(navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(this.blob, this.view);
        } else {
            let a = document.createElement('a');
            a.href = this.url;
            a.target="_blank"
            document.body.appendChild(a);
            a.click();        
            document.body.removeChild(a);
        }
    }
    downloadPdf() {
        if(navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(this.blob, this.view);
        } else {
            let a = document.createElement('a');
            a.href = this.url;
            a.download = this.view+'.pdf';
            document.body.appendChild(a);
            a.click();        
            document.body.removeChild(a);
        }
    }
    sharePdfStep() {
        this.printStepperSubject$.next(3);
    }
    sharePdf() {
        let listUser = this.searchUserList.map(user => user.value)
        if(!!listUser && listUser.length <= 0) {
            this.toastrService.error('Tag user to share the pdf');
        }
        
        this.loaderService.loadingOn();
        let reqObj = {
            zoneId : this.floorId,
            showCircles: this.showCircle,
            mapViewType: this.view,
            toUserIds:listUser,
            message:this.userMsg
        }
        this.printPdfService.sharePdf(reqObj).pipe(
            tap(() => this.loaderService.loadingOff(),
            catchError(err => {
                this.loaderService.loadingOff();
                return of(err)   
            }))
        ).subscribe(res => {
            this.printStepperSubject$.next(4);
        })
    }

    /**tag input code start */
    requestAutocompleteItems(text:string){
        this.isloading = true;
        this.printPdfService.requestAutocompleteItems(text);
    }
    public onRemove(item) {
        this.searchUserList = this.searchUserList.filter((user) => user['value'] !== item.value);
    }

    public onAdd(item) {}
    /**tag input code end */

    closeModal() {
        this.closePopup.emit();
    }
      selected(event: MatAutocompleteSelectedEvent): void {
          let selectedUser = event.option.value;
        var foundIndex = this.searchUserList.findIndex(x => x.value == selectedUser.value);
        if(foundIndex < 0) {
            this.searchUserList = [...this.searchUserList, event.option.value]
            this.Input.nativeElement.value = '';
            this.searchInpCtrl.setValue(null);
        }
      }
    
}