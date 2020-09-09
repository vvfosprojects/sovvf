import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from './pipes/pipe.module';
import { TreeviewI18n, TreeviewModule } from 'ngx-treeview';
import { DefaultTreeviewI18n } from './store/states/sedi-treeview/default-treeview-i18n';
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
import { PrenotazioneProgressBarComponent } from './components/prenotazione-progress-bar/prenotazione-progress-bar.component';
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
import { BottoneNuovaVersioneComponent } from './components/bottone-nuova-versione/bottone-nuova-versione.component';
import { EliminaPartenzaModalComponent } from './modal/elimina-partenza-modal/elimina-partenza-modal.component';
import { RichiestaDuplicataModalComponent } from './modal/richiesta-duplicata-modal/richiesta-duplicata-modal.component';
import { ModificaFonogrammaModalComponent } from './modal/modifica-fonogramma-modal/modifica-fonogramma-modal.component';
import { DettaglioFonogrammaModalComponent } from './modal/dettaglio-fonogramma-modal/dettaglio-fonogramma-modal.component';
import { MezzoActionsModalComponent } from './modal/mezzo-actions-modal/mezzo-actions-modal.component';
import { TastoCompPartenzaComponent } from './components/tasto-comp-partenza/tasto-comp-partenza.component';

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
    BottoneNuovaVersioneComponent,
    EliminaPartenzaModalComponent,
    RichiestaDuplicataModalComponent,
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
    PrenotazioneProgressBarComponent,
    FilterbarComposizioneComponent,
    TastoCompPartenzaComponent
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule,
        FormsModule,
        PipeModule,
        TreeviewModule.forRoot(),
        NgSelectModule,
        NgxsFormPluginModule.forRoot()
    ],
    declarations: [
        ...COMPONENTS
    ],
    exports: [
        ...COMPONENTS,
        PipeModule
    ]
})
export class SharedModule {

    static forRoot() {
        return {
            ngModule: SharedModule,
            providers: [
                { provide: TreeviewI18n, useClass: DefaultTreeviewI18n },
            ],
        };
    }
}
