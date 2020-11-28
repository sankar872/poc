import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapActionIconsComponent } from "./map-action-icons.component"
import { MapActionIconsService } from "./map-action-icons.service"
import { SearchMapUserComponent } from "../search-map-user/search-map-user.component"

@NgModule({
    imports: [CommonModule],
    declarations: [MapActionIconsComponent, SearchMapUserComponent],
    exports: [MapActionIconsComponent, SearchMapUserComponent],
    providers: [MapActionIconsService]
})
export class MapActionIconsModule {}