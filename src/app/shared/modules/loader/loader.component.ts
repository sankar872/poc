import { Component, OnInit, Input } from "@angular/core";
import { LoaderService } from "../loader/loader.service";

@Component({
    selector: "app-loader",
    templateUrl: "./loader.component.html",
    styleUrls: ["./loader.component.scss"]
})
export class LoaderComponent implements OnInit {
    constructor(public loaderService: LoaderService) {}

    ngOnInit() {}
}
