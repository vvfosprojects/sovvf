import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from './pipes/pipe.module';
import { TreeviewModule } from 'ngx-treeview';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListaPartenzeComponent } from './components/lista-partenze/lista-partenze.component';
import { NotificheComponent } from './components/notifiche/notifiche.component';
import { EnteModalComponent } from './modal/ente-modal/ente-modal.component';
import { NumeriEnteComponent } from './components/numeri-ente/numeri-ente.component';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { SelectElementiPerPaginaComponent } from './components/select-elementi-per-pagina/select-elementi-per-pagina.component';
import { RisultatiRicercaComponent } from './components/risultati-ricerca/risultati-ricerca.component';
import { TrasferimentoChiamataModalComponent } from './modal/trasferimento-chiamata-modal/trasferimento-chiamata-modal.component';
import { AllertaSedeModalComponent } from './modal/allerta-sede-modal/allerta-sede-modal.component';
import { ModificaPartenzaModalComponent } from './modal/modifica-partenza-modal/modifica-partenza-modal.component';
import { SostituzionePartenzaModalComponent } from './modal/sostituzione-partenza-modal/sostituzione-partenza-modal.component';
import { MezzoComposizioneComponent } from './components/mezzo-composizione/mezzo-composizione.component';
import { SquadraComposizioneComponent } from './components/squadra-composizione/squadra-composizione.component';
import { FilterbarComposizioneComponent } from './components/filterbar-composizione/filterbar-composizione.component';
import { ModificaEntiModalComponent } from './modal/modifica-enti-modal/modifica-enti-modal.component';
import { DebounceClickDirective } from './directive/debounce-click';
import { DebounceKeyUpDirective } from './directive/debounce-keyup';
import { ClickStopPropagationDirective } from './directive/click-stop-propagation';
import { ComponenteComponent } from './components/componente/componente.component';
import { CompetenzaComponent } from './components/competenza/competenza.component';
import { MezzoComponent } from './components/mezzo/mezzo.component';
import { TreeviewComponent } from './components/treeview/treeview.component';
import { ListaEntiComponent } from './components/lista-enti/lista-enti.component';
import { ListaSquadrePartenzaComponent } from './components/lista-squadre-partenza/lista-squadre-partenza.component';
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';
import { SelezioneTipiTerrenoComponent } from './components/selezione-tipi-terreno/selezione-tipi-terreno.component';
import { PartenzaComponent } from './components/partenza/partenza.component';
import { MezzoActionsComponent } from './components/mezzo/mezzo-actions/mezzo-actions.component';
import { SintesiRichiestaActionsComponent } from './components/sintesi-richiesta-actions/sintesi-richiesta-actions.component';
import { ActionRichiestaModalComponent } from './modal/action-richiesta-modal/action-richiesta-modal.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { PartialLoaderComponent } from './components/partial-loader/partial-loader.component';
import { EliminaPartenzaModalComponent } from './modal/elimina-partenza-modal/elimina-partenza-modal.component';
import { ModificaFonogrammaModalComponent } from './modal/modifica-fonogramma-modal/modifica-fonogramma-modal.component';
import { DettaglioFonogrammaModalComponent } from './modal/dettaglio-fonogramma-modal/dettaglio-fonogramma-modal.component';
import { MezzoActionsModalComponent } from './modal/mezzo-actions-modal/mezzo-actions-modal.component';
import { TastoCompPartenzaComponent } from './components/tasto-comp-partenza/tasto-comp-partenza.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { BoxAnteprimaPartenzaComponent } from './components/box-anteprima-partenza/box-anteprima-partenza.component';
import { SganciamentoMezzoModalComponent } from './modal/sganciamento-mezzo-modal/sganciamento-mezzo-modal.component';
import { TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';
import { TimeagoVVFFormatter } from './helper/timago-custom-formatter';
import { SintesiRichiestaComponent } from './components/sintesi-richiesta/sintesi-richiesta.component';
import { SostituzionePartenzeFineTunoModalComponent } from './modal/sostituzione-partenze-fine-turno-modal/sostituzione-partenze-fine-tuno-modal.component';
import { InterventiProssimitaModalComponent } from './modal/interventi-prossimita-modal/interventi-prossimita-modal.component';
import { ListaSchedeContattoModalComponent } from './modal/lista-schede-contatto-modal/lista-schede-contatto-modal.component';
import { DettaglioSchedaContattoModalComponent } from './modal/dettaglio-scheda-contatto-modal/dettaglio-scheda-contatto-modal.component';
import { ListaSchedeContattoComponent } from './components/lista-schede-contatto/lista-schede-contatto.component';
import { SchedeContattoComponent } from '../features/home/schede-contatto/schede-contatto.component';
import { SchedaContattoComponent } from './components/scheda-contatto/scheda-contatto.component';
import { SchedaContattoCollegataComponent } from './components/scheda-contatto-collegata/scheda-contatto-collegata.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TriageChiamataModalComponent } from './modal/triage-chiamata-modal/triage-chiamata-modal.component';
import { StepDettaglioTipologiaComponent } from './modal/triage-chiamata-modal/step-dettaglio-tipologia/step-dettaglio-tipologia.component';
import { StepDomandeComponent } from './modal/triage-chiamata-modal/step-domande/step-domande.component';
import { SoccorsoAereoModalComponent } from './modal/soccorso-aereo-modal/soccorso-aereo-modal.component';
import { AzioniSintesiRichiestaModalComponent } from './modal/azioni-sintesi-richiesta-modal/azioni-sintesi-richiesta-modal.component';
import { DettaglioSoccorsoAereoModalComponent } from './modal/dettaglio-soccorso-aereo-modal/dettaglio-soccorso-aereo-modal.component';
import { ItemTriageModalComponent } from './modal/item-triage-modal/item-triage-modal.component';
import { TriageSummaryComponent } from './components/triage-summary/triage-summary.component';
import { TriageSummaryModalComponent } from './modal/triage-summary-modal/triage-summary-modal.component';
import { IconaStatoComponent } from './components/icona-stato/icona-stato.component';
import { VersioneComponent } from './components/versione/versione.component';
import { TipologiaSintesiRichiestaComponent } from './components/tipologia-sintesi-richiesta/tipologia-sintesi-richiesta.component';
import { RiepilogoInterventiModalComponent } from './modal/riepilogo-interventi-modal/riepilogo-interventi-modal.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { OperatoreComponent } from './components/operatore/operatore.component';
import { RouterModule } from '@angular/router';

const COMPONENTS = [
    DebounceClickDirective,
    DebounceKeyUpDirective,
    ClickStopPropagationDirective,
    ComponenteComponent,
    CompetenzaComponent,
    MezzoComponent,
    TreeviewComponent,
    ListaEntiComponent,
    ListaSquadrePartenzaComponent,
    ConfirmModalComponent,
    SelezioneTipiTerrenoComponent,
    PartenzaComponent,
    MezzoActionsComponent,
    SintesiRichiestaActionsComponent,
    ActionRichiestaModalComponent,
    CheckboxComponent,
    PartialLoaderComponent,
    EliminaPartenzaModalComponent,
    ModificaFonogrammaModalComponent,
    DettaglioFonogrammaModalComponent,
    MezzoActionsModalComponent,
    ModificaEntiModalComponent,
    ListaPartenzeComponent,
    EnteModalComponent,
    NumeriEnteComponent,
    SelectElementiPerPaginaComponent,
    RisultatiRicercaComponent,
    TrasferimentoChiamataModalComponent,
    NotificheComponent,
    AllertaSedeModalComponent,
    ModificaPartenzaModalComponent,
    SostituzionePartenzaModalComponent,
    MezzoComposizioneComponent,
    SquadraComposizioneComponent,
    FilterbarComposizioneComponent,
    TastoCompPartenzaComponent,
    BoxAnteprimaPartenzaComponent,
    AllertaSedeModalComponent,
    SganciamentoMezzoModalComponent,
    SintesiRichiestaComponent,
    SostituzionePartenzeFineTunoModalComponent,
    ListaSchedeContattoModalComponent,
    DettaglioSchedaContattoModalComponent,
    ListaSchedeContattoComponent,
    SchedeContattoComponent,
    SchedaContattoComponent,
    SchedaContattoCollegataComponent,
    SostituzionePartenzeFineTunoModalComponent,
    InterventiProssimitaModalComponent,
    TriageChiamataModalComponent,
    StepDettaglioTipologiaComponent,
    StepDomandeComponent,
    SoccorsoAereoModalComponent,
    DettaglioSoccorsoAereoModalComponent,
    AzioniSintesiRichiestaModalComponent,
    ItemTriageModalComponent,
    TriageSummaryComponent,
    TriageSummaryModalComponent,
    IconaStatoComponent,
    VersioneComponent,
    TipologiaSintesiRichiestaComponent,
    OperatoreComponent,
    SidebarComponent,
    TipologiaSintesiRichiestaComponent,
    RiepilogoInterventiModalComponent
];
const MODULES = [
    PipeModule
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        NgbModule,
        FormsModule,
        PipeModule,
        TreeviewModule.forRoot(),
        NgSelectModule,
        NgxsFormPluginModule.forRoot(),
        FilterPipeModule,
        NgxPaginationModule,
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: { provide: TimeagoFormatter, useClass: TimeagoVVFFormatter }
        })
    ],
    declarations: [
        ...COMPONENTS,
    ],
    exports: [
        ...COMPONENTS,
        MODULES
    ]
})
export class SharedModule {

    static forRoot(): any {
        return {
            ngModule: SharedModule
        };
    }
}
