import { Component, Input, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe } from 'ngx-filter-pipe';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { EventiRichiestaComponent } from '../eventi/eventi-richiesta.component';
import { Select, Store } from '@ngxs/store';
import { RicercaFilterbarState } from '../store/states/filterbar/ricerca-filterbar.state';
import { ClearRichiestaFissata, SetEspanso, SetRichiestaFissata } from '../store/actions/richieste/richiesta-fissata.actions';
import { RichiestaFissataState } from '../store/states/richieste/richiesta-fissata.state';
import { ClearRichiestaHover, SetRichiestaHover } from '../store/actions/richieste/richiesta-hover.actions';
import { ClearRichiestaSelezionata, SetRichiestaSelezionata } from '../store/actions/richieste/richiesta-selezionata.actions';
import { RichiesteState } from '../store/states/richieste/richieste.state';
import { RichiestaSelezionataState } from '../store/states/richieste/richiesta-selezionata.state';
import { RichiestaHoverState } from '../store/states/richieste/richiesta-hover.state';
import { ClearEventiRichiesta, SetIdRichiestaEventi } from '../store/actions/eventi/eventi-richiesta.actions';
import { ToggleComposizione, ToggleModifica } from '../store/actions/view/view.actions';
import { Composizione } from '../../../shared/enum/composizione.enum';
import {
    ClearMarkerRichiestaHover,
    ClearMarkerRichiestaSelezionato,
    SetMarkerRichiestaHover,
    SetMarkerRichiestaSelezionato
} from '../store/actions/maps/marker.actions';
import { GetInitZoomCentroMappa } from '../store/actions/maps/centro-mappa.actions';
import { ClearMarkerOpachiRichieste, SetMarkerOpachiRichieste } from '../store/actions/maps/marker-opachi.actions';
import { SetRichiestaModifica } from '../store/actions/richieste/richiesta-modifica.actions';
import { RichiestaComposizione } from '../store/actions/composizione-partenza/composizione-partenza.actions';
import { RichiesteEspanseState } from '../store/states/richieste/richieste-espanse.state';
import { SetRichiestaGestione } from '../store/actions/richieste/richiesta-gestione.actions';
import { RichiestaGestioneState } from '../store/states/richieste/richiesta-gestione.state';
import { MezzoActionInterface } from '../../../shared/interface/mezzo-action.interface';
import { ActionMezzo, ActionRichiesta, EliminaPartenzaRichiesta, GetListaRichieste, ModificaStatoFonogramma } from '../store/actions/richieste/richieste.actions';
import { ReducerRichiesteEspanse } from '../store/actions/richieste/richieste-espanse.actions';
import { RichiestaActionInterface } from '../../../shared/interface/richiesta-action.interface';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';
import { PaginationState } from '../../../shared/store/states/pagination/pagination.state';
import { ResetFiltriSelezionatiRichieste } from '../store/actions/filterbar/filtri-richieste.actions';
import { StatoRichiesta } from '../../../shared/enum/stato-richiesta.enum';
import { FiltriRichiesteState } from '../store/states/filterbar/filtri-richieste.state';
import { VoceFiltro } from '../filterbar/filtri-richieste/voce-filtro.model';
import { ModificaStatoFonogrammaEmitInterface } from '../../../shared/interface/modifica-stato-fonogramma-emit.interface';

@Component({
    selector: 'app-richieste',
    templateUrl: './richieste.component.html',
    styleUrls: ['./richieste.component.css']
})
export class RichiesteComponent implements OnInit, OnDestroy {

    @Input() split: boolean;

    @Select(RicercaFilterbarState.ricerca) ricerca$: Observable<string>;
    ricerca: { descrizione: '' };

    @Select(RichiesteState.richieste) richieste$: Observable<SintesiRichiesta[]>;
    richieste: SintesiRichiesta[] = [];

    @Select(RichiestaFissataState.richiestaFissata) richiestaFissata$: Observable<SintesiRichiesta>;
    richiestaFissata: SintesiRichiesta;

    @Select(RichiestaGestioneState.richiestaGestione) richiestaGestione$: Observable<SintesiRichiesta>;
    richiestaGestione: SintesiRichiesta;

    @Select(RichiestaFissataState.espanso) richiestaFissataEspanso$: Observable<boolean>;

    @Select(RichiestaHoverState.idRichiestaHover) idRichiestaHover$: Observable<string>;
    richiestaHover: SintesiRichiesta;

    @Select(RichiestaSelezionataState.idRichiestaSelezionata) idRichiestaSelezionata$: Observable<string>;
    richiestaSelezionata: SintesiRichiesta;

    @Select(RichiesteEspanseState.richiesteEspanse) idRichiesteEspanse$: Observable<string[]>;

    @Select(RichiesteState.loadingRichieste) loadingRichieste$: Observable<boolean>;
    @Select(RichiesteState.needRefresh) needRefresh$: Observable<boolean>;
    @Select(RichiesteState.loadingActionRichiesta) loadingActionRichiesta$: Observable<string>;
    @Select(RichiesteState.loadingEliminaPartenza) loadingEliminaPartenza$: Observable<boolean>;

    @Select(PaginationState.page) page$: Observable<number>;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;

    @Select(FiltriRichiesteState.filtriRichiesteSelezionati) filtriRichiesteSelezionati$: Observable<VoceFiltro[]>;
    codiciFiltriSelezionati: string[] = [];

    loaderRichieste = true;
    listHeightClass = 'm-h-695';
    permessiFeature = PermissionFeatures;
    statoRichiesta = StatoRichiesta;

    subscription = new Subscription();

    constructor(private modalService: NgbModal,
                private filter: FilterPipe,
                private store: Store) {
        this.getRichieste();
    }

    ngOnInit(): void {
        this.getRichiestaFissata();
        this.getRichiestaFissataEspanso();
        this.getRichiestaHover();
        this.getRichiestaSelezionata();
        this.getRichiestaGestione();
        this.getRicercaRichieste();
        this.getFiltriSelezionati();
        isDevMode() && console.log('Componente Richieste creato');
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.store.dispatch(new ResetFiltriSelezionatiRichieste({ preventGetList: true }));
        isDevMode() && console.log('Componente Richieste distrutto');
    }

    getRichieste() {
        this.subscription.add(
            this.richieste$.subscribe((richieste: SintesiRichiesta[]) => {
                this.richieste = richieste;
                this.loaderRichieste = false;
            })
        );
    }

    onNuoveRichieste(page: number) {
        this.store.dispatch(new GetListaRichieste({ page: page }));
    }

    onRefreshRichieste() {
        this.store.dispatch(new GetListaRichieste());
    }

    // Restituisce la Richiesta Fissata
    getRichiestaFissata() {
        this.subscription.add(
            this.richiestaFissata$.subscribe((richiestaFissata: SintesiRichiesta) => {
                if (richiestaFissata) {
                    this.richiestaFissata = richiestaFissata;
                    this.listHeightClass = 'm-h-590';
                } else {
                    setTimeout(() => {
                        this.richiestaFissata = null;
                        this.listHeightClass = 'm-h-695';
                    }, 300);
                }
            })
        );
    }

    getRichiestaFissataEspanso() {
        this.subscription.add(
            this.richiestaFissataEspanso$.subscribe((richiestaEspanso: boolean) => {
                // console.log(richiestaEspanso);
                if (richiestaEspanso === true) {
                    // this.listHeightClass = 'm-h-400';
                } else {
                    this.listHeightClass = 'm-h-590';
                }
            })
        );
    }

    // Restituisce la Richiesta Hover
    getRichiestaHover() {
        this.subscription.add(
            this.idRichiestaHover$.subscribe((idRichiestaHover: string) => {
                if (idRichiestaHover) {
                    const richiestaHoverArray = this.richieste.filter(r => r.id === idRichiestaHover);
                    this.richiestaHover = richiestaHoverArray[0];
                } else {
                    this.richiestaHover = null;
                }
            })
        );
    }

    // Restituisce la Richiesta Selezionata
    getRichiestaSelezionata() {
        this.subscription.add(
            this.idRichiestaSelezionata$.subscribe((idRichiestaSelezionata: string) => {
                if (idRichiestaSelezionata) {
                    const richiestaSelezionataArray = this.richieste.filter(r => r.id === idRichiestaSelezionata);
                    this.richiestaSelezionata = richiestaSelezionataArray[0];
                } else {
                    this.richiestaSelezionata = null;
                }
            })
        );
    }

    getRichiestaGestione() {
        this.subscription.add(
            this.richiestaGestione$.subscribe((richiestaGestione: SintesiRichiesta) => {
                if (richiestaGestione) {
                    const richiestaGestioneArray = this.richieste.filter(r => r.id === richiestaGestione.id);
                    this.richiestaGestione = richiestaGestioneArray[0];
                } else {
                    this.richiestaGestione = null;
                }
            })
        );
    }

    getRicercaRichieste() {
        // Restituisce la stringa di ricerca
        this.subscription.add(
            this.ricerca$.subscribe((ricerca: any) => {
                this.ricerca = ricerca;
                this.opacizzaRichieste(ricerca);
            })
        );
    }

    getFiltriSelezionati() {
        this.subscription.add(
            this.filtriRichiesteSelezionati$.subscribe((filtri: VoceFiltro[]) => {
                this.codiciFiltriSelezionati = filtri.map(filtro => filtro.codice);
            })
        );
    }

    opacizzaRichieste(ricerca: any): void {
        const result = this.filter.transform(this.richieste, ricerca);
        if (result) {
            if (!(this.richieste.length === result.length) && result.length > 0) {
                const string = [];
                result.forEach((c: any) => {
                    string.push(c.id);
                });
                this.store.dispatch(new SetMarkerOpachiRichieste(string));
            } else {
                this.store.dispatch(new ClearMarkerOpachiRichieste());
            }
        }
    }

    onHoverIn(idRichiesta: string) {
        this.store.dispatch(new SetMarkerRichiestaHover(idRichiesta));
        this.store.dispatch(new SetRichiestaHover(idRichiesta));
    }

    onHoverOut() {
        this.store.dispatch(new ClearMarkerRichiestaHover());
        this.store.dispatch(new ClearRichiestaHover());
    }

    onSelezione(idRichiesta: string) {
        this.store.dispatch(new SetMarkerRichiestaSelezionato(idRichiesta));
        this.store.dispatch(new SetRichiestaSelezionata(idRichiesta));
    }

    onDeselezione() {
        this.store.dispatch(new ClearMarkerRichiestaSelezionato());
        this.store.dispatch(new GetInitZoomCentroMappa());
        this.store.dispatch(new ClearRichiestaSelezionata());
    }

    onFissaInAlto(richiesta: SintesiRichiesta) {
        this.store.dispatch(new SetMarkerRichiestaSelezionato(richiesta.id));
        this.store.dispatch(new SetRichiestaFissata(richiesta.id, richiesta.codice));
    }

    onDefissa() {
        this.store.dispatch(new ClearMarkerRichiestaSelezionato());
        this.store.dispatch(new GetInitZoomCentroMappa());
        this.store.dispatch(new ClearRichiestaFissata());
    }

    /* Apre il modal per visualizzare gli eventi relativi alla richiesta cliccata */
    onVisualizzaEventiRichiesta(codice: string) {
        this.store.dispatch(new SetIdRichiestaEventi(codice));
        const modal = this.modalService.open(EventiRichiestaComponent, {
            windowClass: 'xlModal',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modal.result.then(() => {
            },
            () => this.store.dispatch(new ClearEventiRichiesta()));
    }

    onModificaRichiesta(richiesta: SintesiRichiesta) {
        this.store.dispatch(new SetRichiestaModifica(richiesta));
        this.store.dispatch(new SetMarkerRichiestaSelezionato(richiesta.id));
        this.store.dispatch(new ToggleModifica());
    }

    onGestioneRichiesta(richiesta: SintesiRichiesta) {
        this.store.dispatch(new SetRichiestaGestione(richiesta));
        // console.log('Gestione Richiesta', richiesta);
    }

    toggleComposizione() {
        this.store.dispatch(new ToggleComposizione(Composizione.Avanzata));
    }

    nuovaPartenza($event: SintesiRichiesta) {
        this.store.dispatch(new SetMarkerRichiestaSelezionato($event.id));
        this.store.dispatch(new RichiestaComposizione($event));
    }

    onActionMezzo(actionMezzo: MezzoActionInterface) {
        this.store.dispatch(new ActionMezzo(actionMezzo));
        // console.log('actionMezzo', actionMezzo);
    }

    onActionRichiesta(actionRichiesta: RichiestaActionInterface) {
        this.store.dispatch(new ActionRichiesta(actionRichiesta));
        // console.log('actionRichiesta', actionRichiesta);
    }

    toggleEspanso(id: string): void {
        this.store.dispatch(new ReducerRichiesteEspanse(id));
    }

    onSetEspanso(result?: boolean): void {
        this.store.dispatch(new SetEspanso(result));
    }

    onEliminaPartenza(event: { targaMezzo: string, idRichiesta: string, modalResult: any }) {
        this.store.dispatch(new EliminaPartenzaRichiesta(event.targaMezzo, event.idRichiesta, event.modalResult));
    }

    onModificaStatoFonogramma(event: ModificaStatoFonogrammaEmitInterface) {
        this.store.dispatch(new ModificaStatoFonogramma(event));
    }
}
