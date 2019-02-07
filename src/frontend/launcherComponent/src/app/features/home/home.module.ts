import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRouting } from './home.routing';
import { HomeComponent } from './home.component';
import { ComposizionePartenzaComponent } from './composizione-partenza/composizione-partenza.component';
import { FasterComponent } from './composizione-partenza/composizione-veloce/composizione-veloce.component';
import { ComposizioneAvanzataComponent } from './composizione-partenza/composizione-avanzata/composizione-avanzata.component';
import { BoxNuovaPartenzaComponent } from './composizione-partenza/shared/box-nuova-partenza/box-nuova-partenza.component';
import { MezzoComposizioneComponent } from './composizione-partenza/composizione-avanzata/mezzo-composizione/mezzo-composizione.component';
import { SquadraComposizioneComponent } from './composizione-partenza/composizione-avanzata/squadra-composizione/squadra-composizione.component';
import { ComposizioneFilterbarComponent } from './composizione-partenza/shared/filterbar/composizione-filterbar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { ScrollingModule } from '@angular/cdk/scrolling';
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
import { DispatcherCompPartenzaService } from '../../core/dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.service';
import { DispatcherCompPartenzaFakeService } from '../../core/dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.fake.service';
import { CompPartenzaManagerService } from '../../core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { CompPartenzaManagerServiceFake } from '../../core/manager/comp-partenza-manager/comp-partenza-manager.service.fake';
import { CompPartenzaService } from '../../core/service/comp-partenza-service/comp-partenza.service';
import { CompPartenzaServiceFake } from '../../core/service/comp-partenza-service/comp-partenza.service.fake';
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
import { MapsModule } from './maps/maps.module';
import { RichiesteModule } from './richieste/richieste.module';
// import { ComposizionePartenzaModule } from './composizione-partenza/composizione-partenza.module';

@NgModule({
    declarations: [
        HomeComponent,
        ComposizionePartenzaComponent,
        FasterComponent,
        ComposizioneAvanzataComponent,
        BoxNuovaPartenzaComponent,
        MezzoComposizioneComponent,
        SquadraComposizioneComponent,
        ComposizioneFilterbarComponent,
    ],
    imports: [
        CommonModule,
        HomeRouting,
        BoxesModule,
        ChiamataModule,
        EventiRichiestaModule,
        FilterbarModule,
        MapsModule,
        RichiesteModule,
        // ComposizionePartenzaModule,
        NgxPaginationModule,
        NgSelectModule,
        ScrollingModule,
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
    providers: [
        { provide: DispatcherCompPartenzaService, useClass: DispatcherCompPartenzaFakeService },
        { provide: CompPartenzaManagerService, useClass: CompPartenzaManagerServiceFake },
        { provide: CompPartenzaService, useClass: CompPartenzaServiceFake },
        MarkerService, MarkedService, DirectionService, CenterService, MapsFiltroService, AgmService,
        ListaRichiesteService,
        ViewService
    ]
})
export class HomeModule {
}
