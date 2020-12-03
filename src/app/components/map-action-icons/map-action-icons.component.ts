import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";


@Component({
    selector: 'map-action-icons',
    styleUrls: ['map-action-icons.component.scss'],
    templateUrl: 'map-action-icons.component.html',
})
export class MapActionIconsComponent {
    @Input()
    currentZone;
    @Input()
    viewOptions;
    @Input()
    pdfView;
    @Input()
    floorId;
    @Input()
    showCircle;
    @Output()
    toggleSearchPanel = new EventEmitter();
    @Output()
    toggleRightPanel = new EventEmitter();

    constructor(private dialog: MatDialog) {}
    onPrintbtnClick() {
        let data = {
            type: "print-map",
            floorId: this.floorId,
            pdfView:this.pdfView,
            showCircle:this.showCircle,
            currentZone: this.currentZone
        };
        this.openDialog(data, 30);
    }
    onSearchBtnClick() {
        this.toggleSearchPanel.emit()
    }

    togglePageRightPanel() {
        this.toggleRightPanel.emit()
    }
    openDialog(data, widthPercetage = 50, heightPercentage?): void {
        let width = widthPercetage + "%";
        let height;
        if (heightPercentage > 0) {
            height = heightPercentage + "%";
        } else {
            height = "auto";
        }
       
    }

    isShowable(type) {
        const showIcon = this.viewOptions.find(op => op === type) 
        return showIcon;
    }
}