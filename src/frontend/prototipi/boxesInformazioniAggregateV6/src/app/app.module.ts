import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {PipeModule} from './shared/pipes/pipe.module';
import {AppComponent} from './app.component';
/**
 * Boxes Module
 */
import {BoxesModule} from './boxes/boxes.module';
/**
 * Shared Module
 */
import {SharedModule} from './shared/shared.module';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        NgbModule,
        PipeModule,
        BoxesModule,
        SharedModule,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
