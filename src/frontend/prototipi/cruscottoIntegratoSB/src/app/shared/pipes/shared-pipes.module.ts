import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendlyDatePipe } from "./friendly-date.pipe";
import { FriendlyHourPipe } from "./friendly-hour.pipe";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [FriendlyDatePipe, FriendlyHourPipe],
    exports: [FriendlyDatePipe, FriendlyHourPipe]
})
export class SharedPipesModule { }
