import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {PipeModule} from './shared/pipes/pipe.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
/**
 * Eventi Richiesta Module
 */
import {EventiRichiestaModule} from './eventi/eventi-richiesta.module';
/**
 * Shared Module
 */
import {SharedModule} from './shared/shared.module';


@NgModule({
    declarations: [
        AppComponent

    ],
    imports: [
        BrowserModule,
        NgbModule,
        PipeModule.forRoot(),
        SharedModule,
        EventiRichiestaModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
