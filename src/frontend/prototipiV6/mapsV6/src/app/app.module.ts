import {AppComponent} from './app.component';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PipeModule} from './shared/pipes/pipe.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 *  Maps Module
 */
import {MapsModule} from './maps/maps.module';
/**
 * Shared Module
 */
import {SharedModule} from './shared/shared.module';
/**
 *  solo per il componente
 */
import {NavComponent} from './maps-test/nav/nav.component';

@NgModule({
    declarations: [
        AppComponent,
        NavComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule,
        NgSelectModule,
        FormsModule,
        MapsModule,
        SharedModule,
        PipeModule,
        BrowserAnimationsModule
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
