import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {PipeModule} from './shared/pipes/pipe.module';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {MapsComponent} from './maps/maps.component';
import {NavComponent} from './maps/maps-test/nav/nav.component';
import {DispatcherService} from './maps/dispatcher/dispatcher.service';
import {DispatcherServiceFake} from './maps/dispatcher/dispatcher.service.fake';
import {MapsService} from './maps/service/maps-service/maps-service.service';
import {MapsServiceFake} from './maps/service/maps-service/maps-service.service.fake';
import {AgmComponent} from './maps/agm/agm.component';
import {AgmCoreModule} from '@agm/core';
import {environment} from '../environments/environment';
import {AgmContentComponent} from './maps/agm/agm-content.component';
import {AgmJsMarkerClustererModule} from '@agm/js-marker-clusterer';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MapsFiltroComponent} from './maps/maps-filtro/maps-filtro.component';
import {EventiServiceFake} from './eventi-fake/eventi.service.fake';
import {EventiService} from './shared/eventi/eventi.service';
import {MezzoModalComponent} from './maps/maps-ui/modal/mezzo-modal/mezzo-modal.component';
import {MezzoModalContentComponent} from './maps/maps-ui/modal/mezzo-modal-content/mezzo-modal-content.component';
import {InfoWindowComponent} from './maps/maps-ui/info-window/info-window.component';
/*
non importare su launcher
 */
import {DebounceClickDirective} from './shared';


@NgModule({
    declarations: [
        AppComponent,
        // start import of Shared Declarations
        [
            DebounceClickDirective,
        ],
        // end import of Shared Declarations
        MapsComponent,
        NavComponent,
        AgmComponent,
        AgmContentComponent,
        MapsFiltroComponent,
        MezzoModalComponent,
        MezzoModalContentComponent,
        InfoWindowComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        PipeModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: environment.apiUrl.maps.agm.key
        }),
        AgmJsMarkerClustererModule,
        NgbModule,
        NgSelectModule,
        FormsModule
    ],
    entryComponents: [MezzoModalContentComponent],
    providers: [
        {provide: DispatcherService, useClass: DispatcherServiceFake},
        {provide: MapsService, useClass: MapsServiceFake},
        {provide: EventiService, useClass: EventiServiceFake},
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
