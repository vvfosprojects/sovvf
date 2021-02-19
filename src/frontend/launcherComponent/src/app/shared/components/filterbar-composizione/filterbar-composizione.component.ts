import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ReducerFilterListeComposizione, SetRichiestaComposizione } from '../../../features/home/store/actions/composizione-partenza/composizione-partenza.actions';
import { ComposizionePartenzaState } from '../../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { SwitchComposizione, TurnOffComposizione } from '../../../features/home/store/actions/view/view.actions';
import { Composizione } from 'src/app/shared/enum/composizione.enum';
import { ViewComponentState } from '../../../features/home/store/states/view/view.state';
import { Observable, Subscription } from 'rxjs';
import { iconaStatiClass } from '../../helper/composizione-functions';
import { AddFiltroSelezionatoComposizione, ClearFiltriComposizione, ResetFiltriComposizione, SetGenereMezzoDefault } from '../../store/actions/filtri-composizione/filtri-composizione.actions';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { SetMarkerRichiestaSelezionato } from 'src/app/features/home/store/actions/maps/marker.actions';
import { SostituzionePartenzaModalState } from '../../store/states/sostituzione-partenza-modal/sostituzione-partenza-modal.state';
import { GetListaMezziSquadre, StartListaComposizioneLoading } from '../../store/actions/sostituzione-partenza/sostituzione-partenza.actions';
import { ListaTipologicheMezzi } from '../../../features/home/composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { ViewLayouts } from '../../interface/view.interface';
import { Sede } from '../../model/sede.model';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TriageSummary } from '../../interface/triage-summary.interface';
import { TriageSummaryModalComponent } from '../../modal/triage-summary-modal/triage-summary-modal.component';
import { getGeneriMezzoTriageSummary, getNoteOperatoreTriageSummary } from '../../helper/function-triage';

@Component({
    selector: 'app-filterbar-composizione',
    templateUrl: './filterbar-composizione.component.html',
    styleUrls: ['./filterbar-composizione.component.css']
})
export class FilterbarComposizioneComponent implements OnChanges, OnDestroy {

    @Input() filtri: ListaTipologicheMezzi;
    @Input() prenotato: any;
    @Input() disableComposizioneMode: boolean;
    @Input() nascondiTornaIndietro: boolean;
    @Input() nascondiCambiaComposizioneMode: boolean;
    @Input() composizionePartenza: boolean;
    @Input() sostituzionePartenza: boolean;
    @Input() competenze: Sede[];
    @Input() nightMode: boolean;
    @Input() doubleMonitor: boolean;
    @Input() triageSummary: TriageSummary[];

    @Output() confirmPrenota: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;
    @Select(ViewComponentState.viewComponent) viewState$: Observable<ViewLayouts>;

    richiesta: SintesiRichiesta;
    notFoundText = 'Nessun Filtro Trovato';
    viewState: ViewLayouts;
    distaccamentiSelezionati: string[];
    generiMezzoSelezionato: string[];

    private subscription = new Subscription();

    constructor(private store: Store,
                private dropdownConfig: NgbDropdownConfig,
                private modalService: NgbModal) {
        dropdownConfig.placement = 'right';
        this.richiesta = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
        this.setDistaccamentiDefault();
        this.getViewState();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.triageSummary?.currentValue) {
            this.setGenereMezzoDefault();
        }
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ClearFiltriComposizione());
    }

    setDistaccamentiDefault(): void {
        this.distaccamentiSelezionati = [];
        this.richiesta.competenze.forEach(x => this.distaccamentiSelezionati.push(x.codice));
        const distaccamentiDefault = [];
        this.richiesta.competenze.forEach(x => distaccamentiDefault.push({ id: x.codice }));
        this.addFiltro(distaccamentiDefault, 'codiceDistaccamento');
    }

    setGenereMezzoDefault(): void {
        this.generiMezzoSelezionato = getGeneriMezzoTriageSummary(this.triageSummary);
        if (this.generiMezzoSelezionato) {
            this.store.dispatch(new SetGenereMezzoDefault(this.generiMezzoSelezionato));
        }
    }

    getViewState(): void {
        this.subscription.add(this.viewState$.subscribe(r => this.viewState = r));
    }

    getNoteOperatoreTriage(): string[] {
        return getNoteOperatoreTriageSummary(this.triageSummary);
    }

    addFiltro(event: any, tipo: string): void {
        this.store.dispatch(new StartListaComposizioneLoading());
        if (event) {
            if (event?.id || event?.descrizione) {
                this.store.dispatch(new AddFiltroSelezionatoComposizione(event.id || event.descrizione, tipo));
            } else {
                this.store.dispatch(new AddFiltroSelezionatoComposizione(event, tipo));
            }
            this.nuovaPartenza(this.richiesta);
            this.update();
        }
    }

    nightModeBg(): string {
        let value = '';
        if (!this.nightMode) {
            value = 'bg-light';
        } else if (this.nightMode) {
            value = 'bg-moon-light';
        }
        return value;
    }

    clearFiltri(tipo: string): void {
        this.store.dispatch(new ResetFiltriComposizione(tipo));
        this.update();
    }

    resetFiltri(): void {
        this.store.dispatch(new ClearFiltriComposizione());
        this.update();
    }

    update(): void {
        if (this.composizionePartenza) {
            this.store.dispatch(new ReducerFilterListeComposizione());
        } else if (this.sostituzionePartenza) {
            this.store.dispatch(new GetListaMezziSquadre());
        }
    }

    turnOffComposizione(): void {
        this.store.dispatch(new TurnOffComposizione());
    }

    compPartenzaSwitch(event: Composizione): void {
        this.store.dispatch(new SwitchComposizione(event));
    }

    _iconaStatiClass(statoMezzo: string): string {
        return iconaStatiClass(statoMezzo);
    }

    openDettaglioTriage(): void {
        let dettaglioTriageModal: any;
        if (this.doubleMonitor) {
            dettaglioTriageModal = this.modalService.open(TriageSummaryModalComponent, {
                windowClass: 'modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg'
            });
        } else {
            dettaglioTriageModal = this.modalService.open(TriageSummaryModalComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg'
            });
        }
        dettaglioTriageModal.componentInstance.codRichiesta = this.richiesta?.codiceRichiesta ? this.richiesta?.codiceRichiesta : this.richiesta?.codice;
        dettaglioTriageModal.componentInstance.tipologie = this.richiesta.tipologie;
        // TODO: rivedere backend (aggiugnere "dettaglioTipologia" in "GetRichieste")
        dettaglioTriageModal.componentInstance.dettaglioTipologia = this.richiesta.dettaglioTipologia;
        // TODO: rivedere backend (aggiugnere "schedaContatto" in "GetRichieste", con tutti i dati relativi alla scheda)
        dettaglioTriageModal.componentInstance.schedaContatto = this.richiesta.codiceSchedaNue;
    }

    _confirmPrenota(): void {
        const value = !this.prenotato;
        this.confirmPrenota.emit(value);
    }

    nuovaPartenza(richiesta: SintesiRichiesta): void {
        if (this.store.selectSnapshot(SostituzionePartenzaModalState.idRichiestaSostituzione)) {
            const idRichiesta = this.store.selectSnapshot(SostituzionePartenzaModalState.idRichiestaSostituzione);
            this.store.dispatch([
                new SetMarkerRichiestaSelezionato(idRichiesta),
                new SetRichiestaComposizione(richiesta)
            ]);
        } else {
            this.store.dispatch([
                new SetMarkerRichiestaSelezionato(richiesta.id),
                new SetRichiestaComposizione(richiesta)
            ]);
        }
    }
}
