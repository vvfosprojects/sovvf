import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {PipeModule} from './shared/pipes/pipe.module';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {MapsComponent} from './maps/maps.component';
import {NavComponent} from './maps/maps-test/nav/nav.component';
import {DispatcherService} from './dispatcher/dispatcher.service';
import {DispatcherServiceFake} from './dispatcher/dispatcher.service.fake';
import {MapsService} from './dispatcher/data/maps-service/maps-service.service';
import {MapsServiceFake} from './dispatcher/data/maps-service/maps-service.service.fake';
import {AgmComponent} from './maps/agm/agm.component';
import {AgmCoreModule} from '@agm/core';
import {environment} from '../environments/environment';
import {AgmContentComponent} from './maps/agm/agm-content.component';
import {AgmJsMarkerClustererModule} from '@agm/js-marker-clusterer';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MapsFiltroComponent} from './maps/maps-ui/filtro/filtro.component';
import {CambioSedeModalComponent} from './maps/maps-ui/info-window/cambio-sede-modal/cambio-sede-modal.component';
import {InfoWindowComponent} from './maps/maps-ui/info-window/info-window.component';
/*
non importare su launcher
 */
import {DebounceClickDirective} from './shared';
import {MapManagerService} from './dispatcher/manager/maps-manager/map-manager-service.service';
import {MapManagerServiceFake} from './dispatcher/manager/maps-manager/map-manager-service.service.fake';


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
        CambioSedeModalComponent,
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
    entryComponents: [CambioSedeModalComponent],
    providers: [
        {provide: MapManagerService, useClass: MapManagerServiceFake},
        {provide: DispatcherService, useClass: DispatcherServiceFake},
        {provide: MapsService, useClass: MapsServiceFake},
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
