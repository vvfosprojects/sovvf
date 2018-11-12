/*
    Modules
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
/*
    Components
 */
import { ChiamataComponent } from './chiamata.component';
import { SchedaTelefonataComponent } from './scheda-telefonata/scheda-telefonata.component';
/*
    Provider
 */

@NgModule({
    imports: [
        BrowserModule,
        NgSelectModule,
        FormsModule,
        GooglePlaceModule,
        NgbModule,
        ClipboardModule
    ],
    declarations: [
        ChiamataComponent,
        SchedaTelefonataComponent
    ],
    exports: [
        ChiamataComponent
    ],
    providers: [
    ]
})
export class ChiamataModule { }
