import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ReducerFilterListeComposizione, RichiestaComposizione } from '../../../features/home/store/actions/composizione-partenza/composizione-partenza.actions';
import { ComposizionePartenzaState } from '../../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { TurnOffComposizione, SwitchComposizione } from '../../../features/home/store/actions/view/view.actions';
import { Composizione } from 'src/app/shared/enum/composizione.enum';
import { ViewComponentState } from '../../../features/home/store/states/view/view.state';
import { Observable, Subscription } from 'rxjs';
import { iconaStatiClass } from '../../helper/composizione-functions';
import {
    AddFiltroSelezionatoComposizione,
    ClearFiltriComposizione,
    ResetFiltriComposizione,
    SetFiltriDistaccamentoDefault
} from '../../store/actions/filtri-composizione/filtri-composizione.actions';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { SetMarkerRichiestaSelezionato } from 'src/app/features/home/store/actions/maps/marker.actions';
import { SostituzionePartenzaModalState } from '../../store/states/sostituzione-partenza-modal/sostituzione-partenza-modal.state';
import { GetListaMezziSquadre, StartListaComposizioneLoading } from '../../store/actions/sostituzione-partenza/sostituzione-partenza.actions';
import { ListaTipologicheMezzi } from '../../../features/home/composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewLayouts } from '../../interface/view.interface';
import { Sede } from '../../model/sede.model';
import { ImpostazioniState } from '../../store/states/impostazioni/impostazioni.state';
import { TriageSummary } from '../../interface/triage-summary.interface';
import { TriageSummaryComponent } from '../triage-summary/triage-summary.component';

@Component({
    selector: 'app-filterbar-composizione',
    templateUrl: './filterbar-composizione.component.html',
    styleUrls: ['./filterbar-composizione.component.css']
})
export class FilterbarComposizioneComponent implements OnInit, OnDestroy {

    @Input() filtri: ListaTipologicheMezzi;
    @Input() prenotato: any;
    @Input() disableComposizioneMode: boolean;
    @Input() nascondiTornaIndietro: boolean;
    @Input() nascondiCambiaComposizioneMode: boolean;
    @Input() composizionePartenza: boolean;
    @Input() sostituzionePartenza: boolean;
    @Input() competenze: Sede[];
    @Input() triageSummary: TriageSummary[];

    @Output() confirmPrenota = new EventEmitter<boolean>();

    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;
    @Select(ViewComponentState.viewComponent) viewState$: Observable<ViewLayouts>;
    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;


    private subscription = new Subscription();

    richiesta: SintesiRichiesta;
    notFoundText = 'Nessun Filtro Trovato';
    viewState: ViewLayouts;
    codCompetenzeDefault: string[] = [];

    constructor(private store: Store,
                private dropdownConfig: NgbDropdownConfig,
                private modalService: NgbModal) {
        dropdownConfig.placement = 'right';
        this.richiesta = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
        this.richiesta.competenze.forEach(x => this.codCompetenzeDefault.push(x.codice));
        this.store.dispatch(new SetFiltriDistaccamentoDefault(this.codCompetenzeDefault));
        this.getViewState();
        this.getNightMode();
    }

    ngOnInit(): void {
        // TODO: implementare logica
        const tipoMezzo = getGeneriMezzoTriage(this.triageSummary);
        this.addFiltro(tipoMezzo[0], 'tipoMezzo');
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ClearFiltriComposizione());
    }

    getViewState(): void {
        this.subscription.add(this.viewState$.subscribe(r => this.viewState = r));
    }

    getNoteOperatoreTriage(): string[] {
        if (!!this.triageSummary) {
            const note = [];
            this.triageSummary.forEach((summary: TriageSummary) => {
                const noteOperatore = summary.noteOperatore;
                if (noteOperatore) {
                    note.push(noteOperatore);
                }
            });
            return note;
        }
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

    getNightMode(): void {
        this.subscription.add(
            this.nightMode$.subscribe((nightMode: boolean) => {
                this.nightMode = nightMode;
            })
        );
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
        if (tipo === 'codiceDistaccamento') {
            this.store.dispatch(new SetFiltriDistaccamentoDefault(this.codCompetenzeDefault));
            this.update();
        } else {
            this.update();
        }
    }

    resetFiltri(): void {
        this.store.dispatch(new ClearFiltriComposizione());
        this.store.dispatch(new SetFiltriDistaccamentoDefault(this.codCompetenzeDefault));
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
        let modal: any;
        modal = this.modalService.open(TriageSummaryComponent, {
            windowClass: 'xlModal',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
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
                new RichiestaComposizione(richiesta)
            ]);
        } else {
            this.store.dispatch([
                new SetMarkerRichiestaSelezionato(richiesta.id),
                new RichiestaComposizione(richiesta)
            ]);
        }
    }
}


function getGeneriMezzoTriage(triageSummary: TriageSummary[]): string[] {
    if (triageSummary) {
        const generiMezzo = [];
        triageSummary.forEach((summary: TriageSummary) => {
            summary?.generiMezzo?.forEach((genereMezzo: string) => {
                const genereMezzoFound = generiMezzo.filter((gMezzo: string) => gMezzo === genereMezzo)[0];
                if (!genereMezzoFound) {
                    generiMezzo.push(genereMezzo);
                }
            });
        });
        return generiMezzo;
    }
    return null;
}
