

/*
    Modules
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

/*
    Components
 */
import { ChiamataComponent } from './chiamata.component';

/*
    Provider
 */

@NgModule({
    imports: [
        BrowserModule,
        NgSelectModule,
        FormsModule
    ],
    declarations: [
        ChiamataComponent
    ],
    exports: [
        ChiamataComponent
    ],
    providers: [
    ]
})
export class ChiamataModule { }
