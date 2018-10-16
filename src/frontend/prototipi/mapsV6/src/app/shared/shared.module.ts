import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DebounceClickDirective} from './index';


@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule,
        NgSelectModule,
        FormsModule,
    ],
    declarations: [
        DebounceClickDirective,
    ],
    exports: [
        BrowserModule,
        HttpClientModule,
        NgbModule,
        NgSelectModule,
        FormsModule,
        DebounceClickDirective,
    ]
})
export class SharedModule {
}
