import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRouting } from './home.routing';
import { HomeComponent } from './home.component';
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
import { MapsComponent } from './maps/maps.component';
import { AgmComponent } from './maps/agm/agm.component';
import { AgmContentComponent } from './maps/agm/agm-content.component';
import { MapsFiltroComponent } from './maps/maps-ui/filtro/filtro.component';
import { InfoWindowComponent } from './maps/maps-ui/info-window/info-window.component';
import { CambioSedeModalComponent } from './maps/maps-ui/info-window/cambio-sede-modal/cambio-sede-modal.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
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
import { MarkerService } from './maps/service/marker-service/marker-service.service';
import { MarkedService } from './maps/service/marked-service/marked-service.service';
import { DirectionService } from './maps/service/direction-service/direction-service.service';
import { CenterService } from './maps/service/center-service/center-service.service';
import { MapsFiltroService } from './maps/maps-ui/filtro/maps-filtro.service';
import { AgmService } from './maps/agm/agm-service.service';
import { ListaRichiesteService } from './richieste/service/lista-richieste-service.service';
import { ViewService } from '../../core/service/view-service/view-service.service';
import { BoxesModule } from './boxes/boxes.module';
import { ChiamataModule } from './chiamata/chiamata.module';
import { EventiRichiestaModule } from './eventi/eventi-richiesta.module';
import { FilterbarModule } from './filterbar/filterbar.module';

@NgModule({
    declarations: [
        HomeComponent,
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
        MapsComponent,
        AgmComponent,
        AgmContentComponent,
        MapsFiltroComponent,
        InfoWindowComponent,
        CambioSedeModalComponent,
    ],
    imports: [
        CommonModule,
        HomeRouting,
        BoxesModule,
        ChiamataModule,
        EventiRichiestaModule,
        FilterbarModule,
        NgxPaginationModule,
        NgSelectModule,
        ScrollingModule,
        AgmCoreModule.forRoot(),
        AgmDirectionModule,
        AgmJsMarkerClustererModule,
        AgmSnazzyInfoWindowModule,
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
    entryComponents: [
        CambioSedeModalComponent,
    ],
    providers: [
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
        MarkerService, MarkedService, DirectionService, CenterService, MapsFiltroService, AgmService,
        ListaRichiesteService,
        ViewService
    ]
})
export class HomeModule {
}
