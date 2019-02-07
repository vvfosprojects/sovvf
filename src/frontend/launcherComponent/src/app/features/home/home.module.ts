import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRouting } from './home.routing';
import { HomeComponent } from './home.component';
import { InfoAggregateComponent } from './boxes/info-aggregate/info-aggregate.component';
import { BoxPersonaleComponent } from './boxes/info-aggregate/box-personale/box-personale.component';
import { BoxInterventiComponent } from './boxes/info-aggregate/box-interventi/box-interventi.component';
import { BoxMezziComponent } from './boxes/info-aggregate/box-mezzi/box-mezzi.component';
import { BoxMeteoComponent } from './boxes/info-aggregate/box-meteo/box-meteo.component';
import { ModalServiziComponent } from './boxes/info-aggregate/modal-servizi/modal-servizi.component';
import { RichiesteComponent } from './richieste/richieste.component';
import { ListaRichiesteComponent } from './richieste/lista-richieste/lista-richieste.component';
import { RichiestaFissataComponent } from './richieste/lista-richieste/richiesta-fissata/richiesta-fissata.component';
import { SintesiRichiestaSmComponent } from './richieste/lista-richieste/sintesi-richiesta-sm/sintesi-richiesta-sm.component';
import { SintesiRichiestaComponent } from './richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
import { ComposizionePartenzaComponent } from './composizione-partenza/composizione-partenza.component';
import { FasterComponent } from './composizione-partenza/composizione-veloce/composizione-veloce.component';
import { ComposizioneAvanzataComponent } from './composizione-partenza/composizione-avanzata/composizione-avanzata.component';
import { BoxNuovaPartenzaComponent } from './composizione-partenza/shared/box-nuova-partenza/box-nuova-partenza.component';
import { MezzoComposizioneComponent } from './composizione-partenza/composizione-avanzata/mezzo-composizione/mezzo-composizione.component';
import { SquadraComposizioneComponent } from './composizione-partenza/composizione-avanzata/squadra-composizione/squadra-composizione.component';
import { ComposizioneFilterbarComponent } from './composizione-partenza/shared/filterbar/composizione-filterbar.component';
import { ChiamataComponent } from './chiamata/chiamata.component';
import { SchedaTelefonataComponent } from './chiamata/scheda-telefonata/scheda-telefonata.component';
import { MapsComponent } from './maps/maps.component';
import { AgmComponent } from './maps/agm/agm.component';
import { AgmContentComponent } from './maps/agm/agm-content.component';
import { MapsFiltroComponent } from './maps/maps-ui/filtro/filtro.component';
import { InfoWindowComponent } from './maps/maps-ui/info-window/info-window.component';
import { CambioSedeModalComponent } from './maps/maps-ui/info-window/cambio-sede-modal/cambio-sede-modal.component';
import { EventiRichiestaComponent } from './eventi/eventi-richiesta.component';
import { EventoRichiestaComponent } from './eventi/evento-richiesta/evento-richiesta.component';
import { ListaEventiRichiestaComponent } from './eventi/lista-eventi-richiesta/lista-eventi-richiesta.component';
import { FilterbarComponent } from './filterbar/filterbar.component';
import { RicercaRichiesteComponent } from './filterbar/ricerca-richieste/ricerca-richieste.component';
import { FiltriRichiesteComponent } from './filterbar/filtri-richieste/filtri-richieste.component';
import { FiltroComponent } from './filterbar/filtri-richieste/filtro/filtro.component';
import { ViewModeComponent } from './filterbar/view-mode/view-mode.component';
import { FiltriMappaComponent } from './filterbar/filtri-mappa/filtri-mappa.component';
import { TastoChiamataComponent } from './filterbar/tasto-chiamata/tasto-chiamata.component';
import { TastoCompPartenzaComponent } from './filterbar/tasto-comp-partenza/tasto-comp-partenza.component';
import { MarkerMeteoSwitchComponent } from './filterbar/marker-meteo-switch/marker-meteo-switch.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ClipboardModule } from 'ngx-clipboard';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { UiSwitchModule } from 'ngx-ui-switch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { SharedModule } from '../../shared/shared.module';
import { PipeModule } from '../../shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';
import { NgxsModule } from '@ngxs/store';
import { BoxClickState, BoxMezziState, BoxPersonaleState, BoxRichiesteState } from './boxes/store';
import { FiltriRichiesteState } from './filterbar/filtri-richieste/store';
import { RicercaRichiesteState } from './filterbar/ricerca-richieste/store';
import { MarkerMeteoState } from './filterbar/marker-meteo-switch/store';
import { BoxRichiesteService } from '../../core/service/boxes-service/box-richieste.service';
import { BoxRichiesteFakeService } from '../../core/service/boxes-service/box-richieste-fake.service';
import { BoxMezziService } from '../../core/service/boxes-service/box-mezzi.service';
import { BoxMezziFakeService } from '../../core/service/boxes-service/box-mezzi-fake.service';
import { BoxPersonaleService } from '../../core/service/boxes-service/box-personale.service';
import { BoxPesonaleFakeService } from '../../core/service/boxes-service/box-pesonale-fake.service';
import { DispatcherService } from '../../core/dispatcher/dispatcher-lista-richieste/dispatcher-lista-richieste.service';
import { DispatcherFakeService } from '../../core/dispatcher/dispatcher-lista-richieste/dispatcher-lista-richieste-fake.service';
import { ListaRichiesteManagerService } from '../../core/manager/lista-richieste-manager/lista-richieste-manager.service';
import { ListaRichiesteManagerServiceFake } from '../../core/manager/lista-richieste-manager/lista-richieste-manager.service.fake';
import { SintesiRichiesteService } from '../../core/service/lista-richieste-service/lista-richieste.service';
import { SintesiRichiesteServiceFake } from '../../core/service/lista-richieste-service/lista-richieste.service.fake';
import { DispatcherCompPartenzaService } from '../../core/dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.service';
import { DispatcherCompPartenzaFakeService } from '../../core/dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.fake.service';
import { CompPartenzaManagerService } from '../../core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { CompPartenzaManagerServiceFake } from '../../core/manager/comp-partenza-manager/comp-partenza-manager.service.fake';
import { CompPartenzaService } from '../../core/service/comp-partenza-service/comp-partenza.service';
import { CompPartenzaServiceFake } from '../../core/service/comp-partenza-service/comp-partenza.service.fake';
import {
    CentroMappaService, CentroMappaServiceFake,
    MezziMarkerService,
    MezziMarkerServiceFake,
    RichiesteMarkerService,
    RichiesteMarkerServiceFake,
    SediMarkerService,
    SediMarkerServiceFake
} from '../../core/service/maps-service';
import {
    CentroMappaManagerService, CentroMappaManagerServiceFake,
    MezziMarkerManagerService,
    MezziMarkerManagerServiceFake,
    RichiesteMarkerManagerService,
    RichiesteMarkerManagerServiceFake,
    SediMarkerManagerService,
    SediMarkerManagerServiceFake
} from '../../core/manager/maps-manager';
import {
    DispatcherCentroMappaService, DispatcherCentroMappaServiceFake,
    DispatcherMezziMarkerService,
    DispatcherMezziMarkerServiceFake,
    DispatcherRichiesteMarkerService,
    DispatcherRichiesteMarkerServiceFake,
    DispatcherSediMarkerService, DispatcherSediMarkerServiceFake
} from '../../core/dispatcher/dispatcher-maps';
import { EventiManagerService } from '../../core/manager/eventi-richiesta-manager/eventi-manager-service.service';
import { EventiManagerServiceFake } from '../../core/manager/eventi-richiesta-manager/eventi-manager-service.service.fake';
import { DispatcherEventiRichiestaService } from '../../core/dispatcher/dispatcher-eventi/dispatcher-eventi-richiesta.service';
import { DispatcherEventiRichiestaServiceFake } from '../../core/dispatcher/dispatcher-eventi/dispatcher-eventi-richiesta.service.fake';
import { EventiRichiestaService } from '../../core/service/eventi-richiesta-service/eventi-richiesta.service';
import { EventiRichiestaServiceFake } from '../../core/service/eventi-richiesta-service/eventi-richiesta.service.fake';
import { MarkerService } from './maps/service/marker-service/marker-service.service';
import { MarkedService } from './maps/service/marked-service/marked-service.service';
import { DirectionService } from './maps/service/direction-service/direction-service.service';
import { CenterService } from './maps/service/center-service/center-service.service';
import { MapsFiltroService } from './maps/maps-ui/filtro/maps-filtro.service';
import { AgmService } from './maps/agm/agm-service.service';
import { ListaRichiesteService } from './richieste/service/lista-richieste-service.service';
import { ViewService } from '../../core/service/view-service/view-service.service';

@NgModule({
    declarations: [
        HomeComponent,
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
        CommonModule,
        HomeRouting,
        NgxPaginationModule,
        NgSelectModule,
        ScrollingModule,
        GooglePlaceModule,
        ClipboardModule,
        AgmCoreModule.forRoot(),
        AgmDirectionModule,
        AgmJsMarkerClustererModule,
        AgmSnazzyInfoWindowModule,
        UiSwitchModule,
        NgxPaginationModule,
        FormsModule,
        ReactiveFormsModule,
        FilterPipeModule,
        SharedModule,
        PipeModule.forRoot(),
        NgbModule,
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
        }),
        NgxsModule.forFeature(
            [
                BoxRichiesteState,
                BoxMezziState,
                BoxPersonaleState,
                BoxClickState,
                FiltriRichiesteState,
                RicercaRichiesteState,
                MarkerMeteoState
            ]
        ),
    ],
    entryComponents: [ModalServiziComponent, CambioSedeModalComponent, EventiRichiestaComponent],
    providers: [
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
        { provide: EventiRichiestaService, useClass: EventiRichiestaServiceFake },
        MarkerService, MarkedService, DirectionService, CenterService, MapsFiltroService, AgmService, ListaRichiesteService,
        ViewService
    ]
})
export class HomeModule {
}
