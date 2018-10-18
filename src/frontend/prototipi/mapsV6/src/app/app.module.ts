import {AppComponent} from './app.component';
import {NgModule} from '@angular/core';
import {PipeModule} from './shared/pipes/pipe.module';
import {SharedModule} from './shared/shared.module';
import {environment} from '../environments/environment';
/**
 *  maps component
 */
import {MapsFiltroComponent} from './maps/maps-ui/filtro/filtro.component';
import {CambioSedeModalComponent} from './maps/maps-ui/info-window/cambio-sede-modal/cambio-sede-modal.component';
import {InfoWindowComponent} from './maps/maps-ui/info-window/info-window.component';
import {MapsComponent} from './maps/maps.component';
/**
 * agm core
 */
import {AgmCoreModule} from '@agm/core';
import {AgmJsMarkerClustererModule} from '@agm/js-marker-clusterer';
import {AgmComponent} from './maps/agm/agm.component';
import {AgmContentComponent} from './maps/agm/agm-content.component';
import {AgmSnazzyInfoWindowModule} from '@agm/snazzy-info-window';

/**
 *  solo per il componente
 */
import {NavComponent} from './maps/maps-test/nav/nav.component';
import {DispatcherService} from './dispatcher/dispatcher.service';
import {DispatcherServiceFake} from './dispatcher/dispatcher.service.fake';
import {MapsService} from './dispatcher/data/maps-service/maps-service.service';
import {MapsServiceFake} from './dispatcher/data/maps-service/maps-service.service.fake';
import {MapManagerService} from './dispatcher/manager/maps-manager/map-manager-service.service';
import {MapManagerServiceFake} from './dispatcher/manager/maps-manager/map-manager-service.service.fake';

@NgModule({
    declarations: [
        AppComponent,
        MapsComponent,
        NavComponent,
        AgmComponent,
        AgmContentComponent,
        MapsFiltroComponent,
        CambioSedeModalComponent,
        InfoWindowComponent,
    ],
    imports: [
        SharedModule,
        PipeModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: environment.apiUrl.maps.agm.key
        }),
        AgmJsMarkerClustererModule,
        AgmSnazzyInfoWindowModule
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
