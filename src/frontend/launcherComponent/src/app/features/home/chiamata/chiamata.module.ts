import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { ReactiveFormsModule } from '@angular/forms';
import { ChiamataComponent } from './chiamata.component';
import { SchedaTelefonataComponent } from './scheda-telefonata/scheda-telefonata.component';

@NgModule({
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        GooglePlaceModule,
        NgbModule,
        ClipboardModule,
        ReactiveFormsModule
    ],
    declarations: [
        ChiamataComponent,
        SchedaTelefonataComponent
    ],
    exports: [
        ChiamataComponent
    ],
    providers: []
})
export class ChiamataModule {
}
