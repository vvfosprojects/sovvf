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
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';
import { NgxsModule } from '@ngxs/store';
import { FiltriRichiesteState } from './store/states/filterbar/filtri-richieste.state';
import { RicercaRichiesteState } from './store/states/filterbar/ricerca-richieste.state';
import { MarkerMeteoState } from './store/states/filterbar/marker-meteo-switch.state';
import { BoxesModule } from './boxes/boxes.module';
import { ChiamataModule } from './chiamata/chiamata.module';
import { EventiRichiestaModule } from './eventi/eventi-richiesta.module';
import { FilterbarModule } from './filterbar/filterbar.module';
import { MapsModule } from './maps/maps.module';
import { RichiesteModule } from './richieste/richieste.module';
import { ComposizionePartenzaModule } from './composizione-partenza/composizione-partenza.module';
import { ViewComponentState } from './store/states/view/view.state';
import { BackupViewComponentState } from './store/states/view/save-view.state';
import { HomeState } from './store/states/home.state';
import { RichiestaModificaState } from './store/states/richieste/richiesta-modifica.state';
import { environment } from '../../../environments/environment';
import { HomeService } from '../../core/service/home-service/home.service';
import { HomeServiceFake } from '../../core/service/home-service/home.service.fake';
import { MezziInServizioModule } from './mezzi-in-servizio/mezzi-in-servizio.module';
import { TipologicheMezziState } from './store/states/composizione-partenza/tipologiche-mezzi.state';
import { SchedeContattoModule } from './schede-contatto/schede-contatto.module';
import { BoxClickState } from './store/states/boxes/box-click.state';
import { MapsFiltroState } from './store/states/maps/maps-filtro.state';

@NgModule({
    declarations: [
        HomeComponent
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
        MezziInServizioModule,
        SchedeContattoModule,
        NgxPaginationModule,
        NgSelectModule,
        ScrollingModule,
        NgxPaginationModule,
        FormsModule,
        ReactiveFormsModule,
        FilterPipeModule,
        SharedModule,
        NgbModule,
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
        }),
        NgxsModule.forFeature(
            [
                HomeState,
                ViewComponentState,
                BackupViewComponentState,
                FiltriRichiesteState,
                RicercaRichiesteState,
                MarkerMeteoState,
                RichiestaModificaState,
                TipologicheMezziState,
                BoxClickState,
                MapsFiltroState
            ]
        ),
    ],
    exports: [],
    providers: [
        { provide: HomeService, useClass: environment.fakeProvider ? HomeServiceFake : HomeService },
        NgbActiveModal
    ]
})
export class HomeModule {
}
