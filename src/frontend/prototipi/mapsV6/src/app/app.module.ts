import {AppComponent} from './app.component';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PipeModule} from './shared/pipes/pipe.module';
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
import {
    CentroMappaManagerService,
    MezziMarkerManagerService,
    RichiesteMarkerManagerService,
    SediMarkerManagerService
} from './core/manager/maps-manager';
import {RichiesteMarkerManagerServiceFake} from './core/manager/maps-manager/richieste-marker/richieste-marker-manager.service.fake';
import {MezziMarkerManagerServiceFake} from './core/manager/maps-manager/mezzi-marker/mezzi-marker-manager.service.fake';
import {SediMarkerManagerServiceFake} from './core/manager/maps-manager/sedi-marker/sedi-marker-manager.service.fake';
import {CentroMappaManagerServiceFake} from './core/manager/maps-manager/centro-mappa/centro-mappa-manager.service.fake';
import {DispatcherRichiesteMarkerService} from './core/dispatcher/dispatcher-maps/richieste-marker/dispatcher-richieste-marker.service';
import {
    DispatcherRichiesteMarkerServiceFake
} from './core/dispatcher/dispatcher-maps/richieste-marker/dispatcher-richieste-marker.service.fake';
import {DispatcherMezziMarkerService} from './core/dispatcher/dispatcher-maps/mezzi-marker/dispatcher-mezzi-marker.service';
import {DispatcherMezziMarkerServiceFake} from './core/dispatcher/dispatcher-maps/mezzi-marker/dispatcher-mezzi-marker.service.fake';
import {DispatcherCentroMappaService} from './core/dispatcher/dispatcher-maps/centro-mappa/dispatcher-centro-mappa.service';
import {DispatcherSediMarkerService} from './core/dispatcher/dispatcher-maps/sedi-marker/dispatcher-sedi-marker.service';
import {DispatcherCentroMappaServiceFake} from './core/dispatcher/dispatcher-maps/centro-mappa/dispatcher-centro-mappa.service.fake';
import {DispatcherSediMarkerServiceFake} from './core/dispatcher/dispatcher-maps/sedi-marker/dispatcher-sedi-marker.service.fake';
import {RichiesteMarkerService} from './core/service/maps-service/richieste-marker/richieste-marker.service';
import {RichiesteMarkerServiceFake} from './core/service/maps-service/richieste-marker/richieste-marker.service.fake';
import {MezziMarkerService} from './core/service/maps-service/mezzi-marker/mezzi-marker.service';
import {MezziMarkerServiceFake} from './core/service/maps-service/mezzi-marker/mezzi-marker.service.fake';
import {SediMarkerService} from './core/service/maps-service/sedi-marker/sedi-marker.service';
import {SediMarkerServiceFake} from './core/service/maps-service/sedi-marker/sedi-marker.service.fake';
import {CentroMappaService} from './core/service/maps-service/centro-mappa/centro-mappa.service';
import {CentroMappaServiceFake} from './core/service/maps-service/centro-mappa/centro-mappa.service.fake';


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
    ],
    providers: [
        {provide: RichiesteMarkerManagerService, useClass: RichiesteMarkerManagerServiceFake},
        {provide: MezziMarkerManagerService, useClass: MezziMarkerManagerServiceFake},
        {provide: SediMarkerManagerService, useClass: SediMarkerManagerServiceFake},
        {provide: CentroMappaManagerService, useClass: CentroMappaManagerServiceFake},
        {provide: DispatcherRichiesteMarkerService, useClass: DispatcherRichiesteMarkerServiceFake},
        {provide: DispatcherMezziMarkerService, useClass: DispatcherMezziMarkerServiceFake},
        {provide: DispatcherSediMarkerService, useClass: DispatcherSediMarkerServiceFake},
        {provide: DispatcherCentroMappaService, useClass: DispatcherCentroMappaServiceFake},
        {provide: RichiesteMarkerService, useClass: RichiesteMarkerServiceFake},
        {provide: MezziMarkerService, useClass: MezziMarkerServiceFake},
        {provide: SediMarkerService, useClass: SediMarkerServiceFake},
        {provide: CentroMappaService, useClass: CentroMappaServiceFake},
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
