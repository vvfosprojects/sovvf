import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ReducerFilterListeComposizione, SetRichiestaComposizione } from '../../../features/home/store/actions/composizione-partenza/composizione-partenza.actions';
import { ComposizionePartenzaState } from '../../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { SwitchComposizione } from '../../../features/home/store/actions/view/view.actions';
import { Composizione } from 'src/app/shared/enum/composizione.enum';
import { ViewComponentState } from '../../../features/home/store/states/view/view.state';
import { Observable, Subscription } from 'rxjs';
import { AddFiltroSelezionatoComposizione, ClearFiltriComposizione, ResetFiltriComposizione, SetFiltriGeneriMezzoTriage } from '../../store/actions/filtri-composizione/filtri-composizione.actions';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { SostituzionePartenzaModalState } from '../../store/states/sostituzione-partenza-modal/sostituzione-partenza-modal.state';
import { ListaTipologicheMezzi } from '../../../features/home/composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { ViewLayouts } from '../../interface/view.interface';
import { Sede } from '../../model/sede.model';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TriageSummary } from '../../interface/triage-summary.interface';
import { TriageSummaryModalComponent } from '../../modal/triage-summary-modal/triage-summary-modal.component';
import { getGeneriMezzoTriageSummary } from '../../helper/function-triage';
import { GetListaMezziSquadre } from '../../store/actions/sostituzione-partenza/sostituzione-partenza.actions';
import { TipologicaComposizionePartenza } from '../../../features/home/composizione-partenza/interface/filtri/tipologica-composizione-partenza.interface';
import { AppState } from '../../store/states/app/app.state';

@Component({
    selector: 'app-filterbar-composizione',
    templateUrl: './filterbar-composizione.component.html',
    styleUrls: ['./filterbar-composizione.component.css']
})
export class FilterbarComposizioneComponent implements OnChanges, OnDestroy {

    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;
    @Select(ViewComponentState.viewComponent) viewState$: Observable<ViewLayouts>;
    @Select(ComposizionePartenzaState.richiestaComposizione) richiestaComposizione$: Observable<SintesiRichiesta>;
    @Select(ComposizionePartenzaState.loadingMezzi) loadingMezzi$: Observable<boolean>;
    @Select(ComposizionePartenzaState.loadingSquadre) loadingSquadre$: Observable<boolean>;

    @Input() filtri: ListaTipologicheMezzi;
    @Input() disableComposizioneMode: boolean;
    @Input() nascondiTornaIndietro: boolean;
    @Input() nascondiCambiaComposizioneMode: boolean;
    @Input() composizionePartenza: boolean;
    @Input() sostituzionePartenza: boolean;
    @Input() competenze: Sede[];
    @Input() nightMode: boolean;
    @Input() loadingSquadre: boolean;
    @Input() loadingMezzi: boolean;
    @Input() triageSummary: TriageSummary[];

    richiesta: SintesiRichiesta;
    notFoundText = 'Nessun Filtro Trovato';
    viewState: ViewLayouts;
    disableDefaultDistaccamenti = true;

    distaccamentiSelezionati: string[];
    generiMezzoSelezionato: string[];

    private subscription = new Subscription();

    constructor(private store: Store,
                private dropdownConfig: NgbDropdownConfig,
                private modalService: NgbModal) {
        dropdownConfig.placement = 'right';
        this.getRichiestaComposizione();
        this.getViewState();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.triageSummary?.currentValue && !changes?.triageSummary?.previousValue && !changes?.generiMezzoSelezionato?.currentValue?.length) {
            this.setGenereMezzoTriage();
        }

        if (changes?.loadingMezzi) {
            this.checkDistaccamenti();
        }

        if (((changes?.competenze?.currentValue && changes?.competenze?.currentValue !== []) || changes?.competenze?.currentValue === []) && changes?.filtri?.currentValue) {
            this.setDistaccamentiDefault();
            this.checkDistaccamenti();
        }
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ClearFiltriComposizione());
        this.subscription.unsubscribe();
    }

    getRichiestaComposizione(): void {
        this.subscription.add(
            this.richiestaComposizione$.subscribe((r: SintesiRichiesta) => {
                this.richiesta = r;
            })
        );
    }

    checkDistaccamenti(): void {
        const distaccamentiDefault = [];
        if (this.richiesta && this.richiesta.competenze) {
            this.richiesta.competenze.forEach(x => distaccamentiDefault.push(x.codice));
            JSON.stringify(distaccamentiDefault) === JSON.stringify(this.distaccamentiSelezionati) ? this.disableDefaultDistaccamenti = true : this.disableDefaultDistaccamenti = false;
        }
    }

    setDistaccamentiDefault(): void {
        this.distaccamentiSelezionati = [];
        const distaccamentiDefault = [];

        if (this.competenze?.length) {
            const vistaSedi = this.store.selectSnapshot(AppState.vistaSedi);
            const sedeSelezionata = vistaSedi[0];
            if (sedeSelezionata.indexOf('.') !== -1) {
                this.competenze.forEach(x => distaccamentiDefault.push({ id: x.codice }));
                if (distaccamentiDefault?.length) {
                    const distaccamentiIds = this.filtri.distaccamenti.map((d: TipologicaComposizionePartenza) => d.id);
                    if (distaccamentiIds.includes(distaccamentiDefault[0].id)) {
                        this.competenze.forEach(x => this.distaccamentiSelezionati.push(x.codice));
                        this.addFiltro(distaccamentiDefault, 'codiceDistaccamento');
                    } else {
                        this.addFiltro([], 'codiceDistaccamento');
                    }
                }
            } else {
                this.addFiltro([], 'codiceDistaccamento');
            }
        } else {
            this.addFiltro([], 'codiceDistaccamento');
        }
    }

    setGenereMezzoTriage(): void {
        this.generiMezzoSelezionato = [];
        this.generiMezzoSelezionato = getGeneriMezzoTriageSummary(this.triageSummary);
        this.store.dispatch(new SetFiltriGeneriMezzoTriage(this.generiMezzoSelezionato));
    }

    getViewState(): void {
        this.subscription.add(this.viewState$.subscribe(r => this.viewState = r));
    }

    addFiltro(event: any, tipo: string): void {
        if (event) {
            if (event?.id || event?.descrizione) {
                this.store.dispatch(new AddFiltroSelezionatoComposizione(event.id || event.descrizione, tipo));
            } else {
                this.store.dispatch(new AddFiltroSelezionatoComposizione(event, tipo));
            }
            this.nuovaPartenza(this.richiesta);
            this.update(tipo);
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
        this.update(tipo);
    }

    // resetFiltri(): void {
    //     this.store.dispatch(new ClearFiltriComposizione());
    //     this.update();
    // }

    update(tipo?: string): void {
        if (this.composizionePartenza) {
            this.store.dispatch(new ReducerFilterListeComposizione(tipo));
        } else if (this.sostituzionePartenza) {
            this.store.dispatch(new GetListaMezziSquadre());
        }
    }

    compPartenzaSwitch(event: Composizione): void {
        this.store.dispatch(new SwitchComposizione(event));
        if (event === Composizione.Avanzata) {
            this.setDistaccamentiDefault();
        }
    }

    openDettaglioTriage(): void {
        let dettaglioTriageModal: any;
        dettaglioTriageModal = this.modalService.open(TriageSummaryModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        dettaglioTriageModal.componentInstance.codRichiesta = this.richiesta?.codiceRichiesta ? this.richiesta?.codiceRichiesta : this.richiesta?.codice;
        dettaglioTriageModal.componentInstance.titolo = !this.richiesta.codiceRichiesta ? 'Chiamata' : 'Intervento';
        dettaglioTriageModal.componentInstance.tipologia = this.richiesta.tipologie[0];
        dettaglioTriageModal.componentInstance.dettaglioTipologia = this.richiesta.dettaglioTipologia;
        dettaglioTriageModal.componentInstance.schedaContatto = this.richiesta.codiceSchedaNue;
        dettaglioTriageModal.componentInstance.triageSummary = this.richiesta.triageSummary;
    }

    nuovaPartenza(richiesta: SintesiRichiesta): void {
        if (this.store.selectSnapshot(SostituzionePartenzaModalState.idRichiestaSostituzione)) {
            this.store.dispatch([
                new SetRichiestaComposizione(richiesta)
            ]);
        } else {
            this.store.dispatch([
                new SetRichiestaComposizione(richiesta)
            ]);
        }
    }
}
