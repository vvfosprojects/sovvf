import { AppComponent } from './app.component';
import { I18n } from './i18n';
import { environment } from '../environments/environment';

/**
 * Module
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from './shared/pipes/pipe.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'ng-sidebar';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { TimeagoModule, TimeagoFormatter, TimeagoCustomFormatter, TimeagoIntl } from 'ngx-timeago';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { ToastrModule } from 'ngx-toastr';

/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { BoxClickState, BoxRichiesteState, BoxPersonaleState, BoxMezziState } from './features/home/boxes/store';
import { FiltriRichiesteState } from './features/home/filterbar/filtri-richieste/store';
import { RicercaRichiesteState } from './features/home/filterbar/ricerca-richieste/store';

/**
 * Route
 */
import { APP_ROUTING } from './app.routing';
import { JwtInterceptor, ErrorInterceptor } from './core/auth/_helpers';
import { fakeBackendProvider } from './core/auth/_helpers';
/**
 * Module Components
 */
import { NavbarModule } from './features/navbar/navbar.module';
import { SharedModule } from './shared/shared.module';
import { AppLoadModule } from './core/app-load/app-load.module';
import { HomeComponent } from './features/home/home.component';
// import { RichiesteModule } from './features/home/richieste/richieste.module';
// import { BoxesModule } from './features/home/boxes/boxes.module';
// import { MapsModule } from './features/home/maps/maps.module';
// import { EventiRichiestaModule } from './features/home/eventi/eventi-richiesta.module';
// import { ChiamataModule } from './features/home/chiamata/chiamata.module';
// import { FilterbarModule } from './features/home/filterbar/filterbar.module';
// import { ComposizionePartenzaModule } from './features/home/composizione-partenza/composizione-partenza.module';
/**
 * inizio test
 */
import { InfoAggregateComponent } from './features/home/boxes/info-aggregate/info-aggregate.component';
import { BoxPersonaleComponent } from './features/home/boxes/info-aggregate/box-personale/box-personale.component';
import { BoxInterventiComponent } from './features/home/boxes/info-aggregate/box-interventi/box-interventi.component';
import { BoxMezziComponent } from './features/home/boxes/info-aggregate/box-mezzi/box-mezzi.component';
import { BoxMeteoComponent } from './features/home/boxes/info-aggregate/box-meteo/box-meteo.component';
import { ModalServiziComponent } from './features/home/boxes/info-aggregate/modal-servizi/modal-servizi.component';
import { BoxRichiesteService } from './core/service/boxes-service/box-richieste.service';
import { BoxRichiesteFakeService } from './core/service/boxes-service/box-richieste-fake.service';
import { BoxMezziService } from './core/service/boxes-service/box-mezzi.service';
import { BoxMezziFakeService } from './core/service/boxes-service/box-mezzi-fake.service';
import { BoxPersonaleService } from './core/service/boxes-service/box-personale.service';
import { BoxPesonaleFakeService } from './core/service/boxes-service/box-pesonale-fake.service';
import { RichiesteComponent } from './features/home/richieste/richieste.component';
import { ListaRichiesteComponent } from './features/home/richieste/lista-richieste/lista-richieste.component';
import { RichiestaFissataComponent } from './features/home/richieste/lista-richieste/richiesta-fissata/richiesta-fissata.component';
import { SintesiRichiestaSmComponent } from './features/home/richieste/lista-richieste/sintesi-richiesta-sm/sintesi-richiesta-sm.component';
import { DispatcherService } from './core/dispatcher/dispatcher-lista-richieste/dispatcher-lista-richieste.service';
import { DispatcherFakeService } from './core/dispatcher/dispatcher-lista-richieste/dispatcher-lista-richieste-fake.service';
import { ListaRichiesteManagerService } from './core/manager/lista-richieste-manager/lista-richieste-manager.service';
import { ListaRichiesteManagerServiceFake } from './core/manager/lista-richieste-manager/lista-richieste-manager.service.fake';
import { SintesiRichiesteService } from './core/service/lista-richieste-service/lista-richieste.service';
import { SintesiRichiesteServiceFake } from './core/service/lista-richieste-service/lista-richieste.service.fake';
import { NgxPaginationModule } from 'ngx-pagination';
// import { SintesiRichiestaModule } from './features/home/richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.module';
import { SintesiRichiestaComponent } from './features/home/richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComposizionePartenzaComponent } from './features/home/composizione-partenza/composizione-partenza.component';
import { FasterComponent } from './features/home/composizione-partenza/composizione-veloce/composizione-veloce.component';
import { ComposizioneAvanzataComponent } from './features/home/composizione-partenza/composizione-avanzata/composizione-avanzata.component';
import { BoxNuovaPartenzaComponent } from './features/home/composizione-partenza/shared/box-nuova-partenza/box-nuova-partenza.component';
import { MezzoComposizioneComponent } from './features/home/composizione-partenza/composizione-avanzata/mezzo-composizione/mezzo-composizione.component';
import { SquadraComposizioneComponent } from './features/home/composizione-partenza/composizione-avanzata/squadra-composizione/squadra-composizione.component';
import { ComposizioneFilterbarComponent } from './features/home/composizione-partenza/shared/filterbar/composizione-filterbar.component';
import { DispatcherCompPartenzaService } from './core/dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.service';
import { DispatcherCompPartenzaFakeService } from './core/dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.fake.service';
import { CompPartenzaManagerService } from './core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { CompPartenzaManagerServiceFake } from './core/manager/comp-partenza-manager/comp-partenza-manager.service.fake';
import { CompPartenzaService } from './core/service/comp-partenza-service/comp-partenza.service';
import { CompPartenzaServiceFake } from './core/service/comp-partenza-service/comp-partenza.service.fake';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChiamataComponent } from './features/home/chiamata/chiamata.component';
import { SchedaTelefonataComponent } from './features/home/chiamata/scheda-telefonata/scheda-telefonata.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ClipboardModule } from 'ngx-clipboard';
import { MapsComponent } from './features/home/maps/maps.component';
import { AgmComponent } from './features/home/maps/agm/agm.component';
import { AgmContentComponent } from './features/home/maps/agm/agm-content.component';
import { MapsFiltroComponent } from './features/home/maps/maps-ui/filtro/filtro.component';
import { InfoWindowComponent } from './features/home/maps/maps-ui/info-window/info-window.component';
import { CambioSedeModalComponent } from './features/home/maps/maps-ui/info-window/cambio-sede-modal/cambio-sede-modal.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import {
    CentroMappaService, CentroMappaServiceFake,
    MezziMarkerService,
    MezziMarkerServiceFake,
    RichiesteMarkerService,
    RichiesteMarkerServiceFake,
    SediMarkerService,
    SediMarkerServiceFake
} from './core/service/maps-service';
import {
    CentroMappaManagerService, CentroMappaManagerServiceFake,
    MezziMarkerManagerService,
    MezziMarkerManagerServiceFake,
    RichiesteMarkerManagerService,
    RichiesteMarkerManagerServiceFake,
    SediMarkerManagerService,
    SediMarkerManagerServiceFake
} from './core/manager/maps-manager';
import {
    DispatcherCentroMappaService, DispatcherCentroMappaServiceFake,
    DispatcherMezziMarkerService,
    DispatcherMezziMarkerServiceFake,
    DispatcherRichiesteMarkerService,
    DispatcherRichiesteMarkerServiceFake,
    DispatcherSediMarkerService, DispatcherSediMarkerServiceFake
} from './core/dispatcher/dispatcher-maps';
import { EventiRichiestaComponent } from './features/home/eventi/eventi-richiesta.component';
import { EventoRichiestaComponent } from './features/home/eventi/evento-richiesta/evento-richiesta.component';
import { ListaEventiRichiestaComponent } from './features/home/eventi/lista-eventi-richiesta/lista-eventi-richiesta.component';
import { EventiManagerService } from './core/manager/eventi-richiesta-manager/eventi-manager-service.service';
import { EventiManagerServiceFake } from './core/manager/eventi-richiesta-manager/eventi-manager-service.service.fake';
import { DispatcherEventiRichiestaService } from './core/dispatcher/dispatcher-eventi/dispatcher-eventi-richiesta.service';
import { DispatcherEventiRichiestaServiceFake } from './core/dispatcher/dispatcher-eventi/dispatcher-eventi-richiesta.service.fake';
import { EventiRichiestaService } from './core/service/eventi-richiesta-service/eventi-richiesta.service';
import { EventiRichiestaServiceFake } from './core/service/eventi-richiesta-service/eventi-richiesta.service.fake';
import { UiSwitchModule } from 'ngx-ui-switch';
import { FilterbarComponent } from './features/home/filterbar/filterbar.component';
import { RicercaRichiesteComponent } from './features/home/filterbar/ricerca-richieste/ricerca-richieste.component';
import { FiltriRichiesteComponent } from './features/home/filterbar/filtri-richieste/filtri-richieste.component';
import { FiltroComponent } from './features/home/filterbar/filtri-richieste/filtro/filtro.component';
import { ViewModeComponent } from './features/home/filterbar/view-mode/view-mode.component';
import { FiltriMappaComponent } from './features/home/filterbar/filtri-mappa/filtri-mappa.component';
import { TastoChiamataComponent } from './features/home/filterbar/tasto-chiamata/tasto-chiamata.component';
import { TastoCompPartenzaComponent } from './features/home/filterbar/tasto-comp-partenza/tasto-comp-partenza.component';
import { MarkerMeteoSwitchComponent } from './features/home/filterbar/marker-meteo-switch/marker-meteo-switch.component';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        /**
         * inizio test
         */
        InfoAggregateComponent,
        BoxPersonaleComponent,
        BoxInterventiComponent,
        BoxMezziComponent,
        BoxMeteoComponent,
        ModalServiziComponent,
        RichiesteComponent,
        ListaRichiesteComponent,
        RichiestaFissataComponent,
        SintesiRichiestaSmComponent,
        SintesiRichiestaComponent,
        ComposizionePartenzaComponent,
        FasterComponent,
        ComposizioneAvanzataComponent,
        BoxNuovaPartenzaComponent,
        MezzoComposizioneComponent,
        SquadraComposizioneComponent,
        ComposizioneFilterbarComponent,
        ChiamataComponent,
        SchedaTelefonataComponent,
        MapsComponent,
        AgmComponent,
        AgmContentComponent,
        MapsFiltroComponent,
        InfoWindowComponent,
        CambioSedeModalComponent,
        EventiRichiestaComponent,
        EventoRichiestaComponent,
        ListaEventiRichiestaComponent,
        FilterbarComponent,
        RicercaRichiesteComponent,
        FiltriRichiesteComponent,
        FiltroComponent,
        ViewModeComponent,
        FiltriMappaComponent,
        TastoChiamataComponent,
        TastoCompPartenzaComponent,
        MarkerMeteoSwitchComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppLoadModule,
        ReactiveFormsModule,
        HttpClientModule,
        APP_ROUTING,
        NgbModule,
        FormsModule,
        FilterPipeModule,
        NgProgressModule,
        NgProgressHttpModule,
        SharedModule,
        NavbarModule,
        // RichiesteModule,
        // BoxesModule,
        // MapsModule,
        // EventiRichiestaModule,
        // ChiamataModule,
        // FilterbarModule,
        // ComposizionePartenzaModule,
        /**
         * inizio test
         */
        NgxPaginationModule,
        NgSelectModule,
        // SintesiRichiestaModule,
        ScrollingModule,
        GooglePlaceModule,
        ClipboardModule,
        AgmCoreModule.forRoot(),
        AgmDirectionModule,
        AgmJsMarkerClustererModule,
        AgmSnazzyInfoWindowModule,
        UiSwitchModule,
        NgxPaginationModule,
        /**
         * fine test
         */
        NgxWebstorageModule.forRoot(),
        PipeModule.forRoot(),
        SidebarModule.forRoot(),
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
        }),
        ToastrModule.forRoot({
            positionClass: 'toast-top-center',
            preventDuplicates: true,
        }),
        NgxsModule.forRoot(
            [
                BoxRichiesteState,
                BoxMezziState,
                BoxPersonaleState,
                BoxClickState,
                FiltriRichiesteState,
                RicercaRichiesteState
            ],
            { developmentMode: !environment.production }
        ),
        NgxsStoragePluginModule.forRoot({
            key: []
        }),
        NgxsRouterPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot({
            name: 'SO115 - NGXS',
        }),
        NgxsLoggerPluginModule.forRoot({
            disabled: environment.production,
        }),
    ],
    /**
     * inizio test
     */
    entryComponents: [ModalServiziComponent, CambioSedeModalComponent, EventiRichiestaComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        I18n,
        /**
         * provider fake per la login
         */
        fakeBackendProvider,
        /**
         * inizio test
         */
        { provide: BoxRichiesteService, useClass: BoxRichiesteFakeService },
        { provide: BoxMezziService, useClass: BoxMezziFakeService },
        { provide: BoxPersonaleService, useClass: BoxPesonaleFakeService },
        { provide: DispatcherService, useClass: DispatcherFakeService },
        { provide: ListaRichiesteManagerService, useClass: ListaRichiesteManagerServiceFake },
        { provide: SintesiRichiesteService, useClass: SintesiRichiesteServiceFake },
        { provide: DispatcherCompPartenzaService, useClass: DispatcherCompPartenzaFakeService },
        { provide: CompPartenzaManagerService, useClass: CompPartenzaManagerServiceFake },
        { provide: CompPartenzaService, useClass: CompPartenzaServiceFake },
        { provide: RichiesteMarkerService, useClass: RichiesteMarkerServiceFake },
        { provide: RichiesteMarkerManagerService, useClass: RichiesteMarkerManagerServiceFake },
        { provide: DispatcherRichiesteMarkerService, useClass: DispatcherRichiesteMarkerServiceFake },
        { provide: MezziMarkerService, useClass: MezziMarkerServiceFake },
        { provide: MezziMarkerManagerService, useClass: MezziMarkerManagerServiceFake },
        { provide: DispatcherMezziMarkerService, useClass: DispatcherMezziMarkerServiceFake },
        { provide: SediMarkerService, useClass: SediMarkerServiceFake },
        { provide: SediMarkerManagerService, useClass: SediMarkerManagerServiceFake },
        { provide: DispatcherSediMarkerService, useClass: DispatcherSediMarkerServiceFake },
        { provide: CentroMappaService, useClass: CentroMappaServiceFake },
        { provide: CentroMappaManagerService, useClass: CentroMappaManagerServiceFake },
        { provide: DispatcherCentroMappaService, useClass: DispatcherCentroMappaServiceFake },
        { provide: EventiManagerService, useClass: EventiManagerServiceFake },
        { provide: DispatcherEventiRichiestaService, useClass: DispatcherEventiRichiestaServiceFake },
        { provide: EventiRichiestaService, useClass: EventiRichiestaServiceFake }
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
