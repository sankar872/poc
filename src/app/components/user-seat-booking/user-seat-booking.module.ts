import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Ng5SliderModule } from "ng5-slider";

import { UserBookSeatComponent } from "./user-seat-booking.component";
import { MapActionIconsModule } from "../../components/map-action-icons/map-action-icons.module"

@NgModule({
    imports: [CommonModule,Ng5SliderModule,MapActionIconsModule],
    declarations: [UserBookSeatComponent],
    exports: [UserBookSeatComponent],
})
export class UserSeatBookingModule {}
