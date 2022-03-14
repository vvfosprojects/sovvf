import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRouting } from './home.routing';
import { HomeComponent } from './home.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { SharedModule } from '../../shared/shared.module';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxsModule } from '@ngxs/store';
import { FiltriRichiesteState } from './store/states/filterbar/filtri-richieste.state';
import { RicercaFilterbarState } from './store/states/filterbar/ricerca-filterbar.state';
import { BoxesModule } from './boxes/boxes.module';
import { SchedaRichiestaModule } from './scheda-richiesta/scheda-richiesta.module';
import { EventiRichiestaModule } from './eventi/eventi-richiesta.module';
import { FilterbarModule } from './filterbar/filterbar.module';
import { MapsModule } from '../maps/maps.module';
import { RichiesteModule } from './richieste/richieste.module';
import { ComposizionePartenzaModule } from './composizione-partenza/composizione-partenza.module';
import { ViewComponentState } from './store/states/view/view.state';
import { BackupViewComponentState } from './store/states/view/save-view.state';
import { HomeState } from './store/states/home.state';
import { HomeService } from '../../core/service/home-service/home.service';
import { MezziInServizioModule } from './mezzi-in-servizio/mezzi-in-servizio.module';
import { TipologicheMezziState } from './store/states/composizione-partenza/tipologiche-mezzi.state';
import { SchedeContattoModule } from './schede-contatto/schede-contatto.module';
import { RicercaComposizioneState } from '../../shared/store/states/ricerca-composizione/ricerca-composizione.state';
import { SostituzionePartenzaModalState } from '../../shared/store/states/sostituzione-partenza-modal/sostituzione-partenza-modal.state';
import { MezziComposizioneState } from '../../shared/store/states/mezzi-composizione/mezzi-composizione.state';
import { SquadreComposizioneState } from '../../shared/store/states/squadre-composizione/squadre-composizione.state';
import { FiltriComposizioneState } from '../../shared/store/states/filtri-composizione/filtri-composizione.state';
import { ModificaPartenzaModalState } from '../../shared/store/states/modifica-partenza-modal/modifica-partenza-modal.state';
import { FiltroZoneEmergenzaState } from './store/states/filterbar/filtro-zone-emergenza.state';
import { BarChartModule } from '@swimlane/ngx-charts';
import { CodaChiamateModule } from './coda-chiamate/coda-chiamate.module';
import { BoxPersonaleService } from '../../core/service/box-service/box-personale.service';
import { BoxMezziService } from '../../core/service/box-service/box-mezzi.service';
import { BoxRichiesteService } from '../../core/service/box-service/box-richieste.service';
import { ConcorrenzaService } from '../../core/service/concorrenza-service/concorrenza.service';
import { LockedConcorrenzaService } from '../../core/service/concorrenza-service/locked-concorrenza.service';
import { RichiestaSganciamentoState } from './store/states/composizione-partenza/richiesta-sganciamento.state';
import { RichiesteState } from './store/states/richieste/richieste.state';
import { RichiestaFissataState } from './store/states/richieste/richiesta-fissata.state';
import { RichiestaHoverState } from './store/states/richieste/richiesta-hover.state';
import { RichiestaSelezionataState } from './store/states/richieste/richiesta-selezionata.state';
import { RichiestaGestioneState } from './store/states/richieste/richiesta-gestione.state';

@NgModule({
    declarations: [
        HomeComponent,
    ],
    imports: [
        CommonModule,
        HomeRouting,
        BoxesModule,
        SchedaRichiestaModule,
        EventiRichiestaModule,
        FilterbarModule,
        MapsModule,
        RichiesteModule,
        CodaChiamateModule,
        ComposizionePartenzaModule,
        MezziInServizioModule,
        SchedeContattoModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        FilterPipeModule,
        NgbModule,
        SharedModule,
        NgxsModule.forFeature(
            [
                HomeState,
                ViewComponentState,
                BackupViewComponentState,
                FiltriRichiesteState,
                RicercaFilterbarState,
                TipologicheMezziState,
                RicercaComposizioneState,
                ModificaPartenzaModalState,
                SostituzionePartenzaModalState,
                MezziComposizioneState,
                SquadreComposizioneState,
                RichiestaSganciamentoState,
                FiltriComposizioneState,
                FiltroZoneEmergenzaState,
                RichiesteState,
                RichiestaFissataState,
                RichiestaHoverState,
                RichiestaSelezionataState,
                RichiestaGestioneState
            ]
        ),
        BarChartModule,
    ],
    exports: [],
    providers: [
        HomeService,
        BoxPersonaleService,
        BoxMezziService,
        BoxRichiesteService,
        NgbActiveModal,
        ConcorrenzaService,
        LockedConcorrenzaService
    ]
})
export class HomeModule {
}
