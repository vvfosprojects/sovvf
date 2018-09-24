import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {PipeModule} from './shared/pipes/pipe.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import * as Shared from './shared/';
import {AppComponent} from './app.component';
import {MapsComponent} from './maps/maps.component';
import {NavComponent} from './maps/nav/nav.component';
import {MapsService} from './maps/service/maps-service/maps-service.service';
import {MapsServiceFake} from './maps/service/maps-service/maps-service.service.fake';
import {MarkerService} from './maps/service/marker-service/marker-service.service';
import {MarkedService} from './maps/service/marked-service/marked-service.service';
import {MeteoService} from './shared/meteo/meteo-service.service';
import {AgmComponent} from './maps/agm/agm.component';
import {AgmCoreModule} from '@agm/core';
import {environment} from '../environments/environment';



@NgModule({
    declarations: [
        AppComponent,
        // start import of Shared Declarations
        [],
        // end import of Shared Declarations
        MapsComponent,
        NavComponent,
        AgmComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        PipeModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: environment.apiUrl.maps.agm.key
        })
    ],
    providers: [
        {provide: MapsService, useClass: MapsServiceFake},
        {provide: MarkedService, useClass: MarkedService},
        {provide: MarkerService, useClass: MarkerService},
        {provide: MeteoService, useClass: MeteoService}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
