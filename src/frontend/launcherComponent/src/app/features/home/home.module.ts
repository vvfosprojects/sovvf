import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRouting } from './home.routing';
import { HomeComponent } from './home.component';
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
import { FiltriRichiesteState } from './filterbar/store/states/filtri-richieste.state';
import { RicercaRichiesteState } from './filterbar/store/states/ricerca-richieste.state';
import { MarkerMeteoState } from './filterbar/store/states/marker-meteo-switch.state';
import { MarkerService } from './maps/service/marker-service/marker-service.service';
import { CenterService } from './maps/service/center-service/center-service.service';
import { MapsFiltroService } from './maps/maps-ui/filtro/maps-filtro.service';
import { AgmService } from './maps/agm/agm-service.service';
import { ListaRichiesteService } from './richieste/service/lista-richieste-service.service';
import { BoxesModule } from './boxes/boxes.module';
import { ChiamataModule } from './chiamata/chiamata.module';
import { EventiRichiestaModule } from './eventi/eventi-richiesta.module';
import { FilterbarModule } from './filterbar/filterbar.module';
import { MapsModule } from './maps/maps.module';
import { RichiesteModule } from './richieste/richieste.module';
import { ComposizionePartenzaModule } from './composizione-partenza/composizione-partenza.module';
import { RichiestaFissataState } from './richieste/store/';
import { RichiesteState } from './richieste/store/';
import { RichiestaHoverState } from './richieste/store/';
import { RichiestaSelezionataState } from './richieste/store/states/richiesta-selezionata.state';
import { ViewComponentState } from './store/states/view.state';
import { BackupViewComponentState } from './store/states/save-view.state';
import { NuovaPartenzaState } from './composizione-partenza/store/states/nuova-partenza.state';

@NgModule({
    declarations: [
        HomeComponent,
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
        ComposizionePartenzaModule,
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
                ViewComponentState,
                BackupViewComponentState,
                FiltriRichiesteState,
                RicercaRichiesteState,
                MarkerMeteoState,
                RichiesteState,
                RichiestaFissataState,
                RichiestaHoverState,
                RichiestaSelezionataState,
                NuovaPartenzaState
            ]
        ),
    ],
    providers: [
        MarkerService, CenterService, MapsFiltroService, AgmService,
        ListaRichiesteService
    ]
})
export class HomeModule {
}
