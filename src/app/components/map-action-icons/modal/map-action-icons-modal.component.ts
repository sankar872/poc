import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { MapActionIconsService } from "../map-action-icons.service";

@Component({
    selector: 'map-action-icons-modal',
    styleUrls: ['map-action-icons-modal.component.scss'],
    templateUrl: 'map-action-icons-modal.component.html',
})
export class MapActionIconsModalComponent implements OnInit {
    currentZone;
    pageType: string;
    userMsg: string = "";
    floorId;
    pdfView;
    showCircle;
    constructor(
        public dialogRef: MatDialogRef<MapActionIconsModalComponent>,
        private toastrService: ToastrService,
        private mapActionIconsService: MapActionIconsService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.pageType = this.data["type"];
        }
    ngOnInit() {
        if(this.pageType === 'print-map') {
            this.currentZone = this.data["currentZone"];
            this.pdfView = this.data["pdfView"];
            this.floorId = this.data["floorId"];
            this.showCircle = this.data["showCircle"];
        }
    }
    closePopup () {
        this.dialogRef.close();
    }
}