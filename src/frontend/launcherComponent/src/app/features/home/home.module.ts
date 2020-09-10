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
import { NgxsModule } from '@ngxs/store';
import { FiltriRichiesteState } from './store/states/filterbar/filtri-richieste.state';
import { RicercaFilterbarState } from './store/states/filterbar/ricerca-filterbar.state';
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
import { HomeService } from '../../core/service/home-service/home.service';
import { MezziInServizioModule } from './mezzi-in-servizio/mezzi-in-servizio.module';
import { TipologicheMezziState } from './store/states/composizione-partenza/tipologiche-mezzi.state';
import { SchedeContattoModule } from './schede-contatto/schede-contatto.module';
import { BoxClickState } from './store/states/boxes/box-click.state';
import { MapsFiltroState } from './store/states/maps/maps-filtro.state';
import { SostituzionePartenzaModalComponent } from '../../shared/modal/sostituzione-partenza-modal/sostituzione-partenza-modal.component';
import { RicercaComposizioneState } from '../../shared/store/states/ricerca-composizione/ricerca-composizione.state';
import { SostituzionePartenzaModalState } from '../../shared/store/states/sostituzione-partenza-modal/sostituzione-partenza-modal.state';
import { MezziComposizioneState } from '../../shared/store/states/mezzi-composizione/mezzi-composizione.state';
import { SquadreComposizioneState } from '../../shared/store/states/squadre-composizione/squadre-composizione.state';
import { FiltriComposizioneState } from '../../shared/store/states/filtri-composizione/filtri-composizione.state';

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
        NgxsModule.forFeature(
            [
                HomeState,
                ViewComponentState,
                BackupViewComponentState,
                FiltriRichiesteState,
                RicercaFilterbarState,
                MarkerMeteoState,
                RichiestaModificaState,
                TipologicheMezziState,
                BoxClickState,
                MapsFiltroState,
                RicercaComposizioneState,
                SostituzionePartenzaModalState,
                MezziComposizioneState,
                SquadreComposizioneState,
                FiltriComposizioneState
            ]
        ),
    ],
    exports: [],
    entryComponents: [SostituzionePartenzaModalComponent],
    providers: [
        HomeService,
        NgbActiveModal
    ]
})
export class HomeModule {
}
