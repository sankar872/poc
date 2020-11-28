import { Component, OnInit, Input } from "@angular/core";
import { CustomLoaderService } from "../custom-loader/custom-loader.service";

@Component({
    selector: "app-custom-loader",
    templateUrl: "./custom-loader.component.html",
    styleUrls: ["./custom-loader.component.scss"],
})
export class CustomLoaderComponent implements OnInit {
    constructor(public customLoaderService: CustomLoaderService) {}

    ngOnInit() {}
    getProgressWidth() {
        var crntStep = "";
        this.customLoaderService.stepper$.subscribe((res) => {
            crntStep = res;
        });
        var style: any = {};
        if (crntStep === "first") {
            style.width = "30%";
        } else if (crntStep === "second") {
            style.width = "65%";
        } else if (crntStep === "third") {
            style.width = "100%";
        }
    }
}
