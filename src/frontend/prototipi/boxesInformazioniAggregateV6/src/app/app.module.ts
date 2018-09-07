import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {PipeModule} from './shared/pipes/pipe.module';
import * as Shared from './shared/';
import {AppComponent} from './app.component';
import {BoxFunzionariComponent} from './boxes/info-aggregate/box-funzionari/box-funzionari.component';
import {InfoAggregateComponent} from './boxes/info-aggregate/info-aggregate.component';
import {InfoAggregateService} from './boxes/boxes-services/info-aggregate.service';
import {BoxInterventiComponent} from './boxes/info-aggregate/box-interventi/box-interventi.component';
import {BoxMezziComponent} from './boxes/info-aggregate/box-mezzi/box-mezzi.component';
import {BoxMeteoComponent} from './boxes/info-aggregate/box-meteo/box-meteo.component';
import {MeteoService} from './shared/meteo/meteo-service.service';

@NgModule({
    declarations: [
        AppComponent,
        BoxFunzionariComponent,
        InfoAggregateComponent,
        BoxInterventiComponent,
        BoxMezziComponent,
        BoxMeteoComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        NgbModule,
        PipeModule.forRoot(),
    ],
    providers: [
        {provide: InfoAggregateService, useClass: InfoAggregateService},
        {provide: MeteoService, useClass: MeteoService}
        ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
