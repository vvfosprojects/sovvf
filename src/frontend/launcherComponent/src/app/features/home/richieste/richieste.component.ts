import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe } from 'ngx-filter-pipe';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { Select, Store } from '@ngxs/store';
import { RicercaFilterbarState } from '../store/states/filterbar/ricerca-filterbar.state';
import { ClearRichiestaFissata, SetRichiestaFissata } from '../store/actions/richieste/richiesta-fissata.actions';
import { RichiestaFissataState } from '../store/states/richieste/richiesta-fissata.state';
import { ClearRichiestaHover, SetRichiestaHover } from '../store/actions/richieste/richiesta-hover.actions';
import { ClearRichiestaSelezionata, SetRichiestaSelezionata } from '../store/actions/richieste/richiesta-selezionata.actions';
import { RichiesteState } from '../store/states/richieste/richieste.state';
import { RichiestaSelezionataState } from '../store/states/richieste/richiesta-selezionata.state';
import { RichiestaHoverState } from '../store/states/richieste/richiesta-hover.state';
import { ToggleComposizione, ToggleModifica } from '../store/actions/view/view.actions';
import { Composizione } from '../../../shared/enum/composizione.enum';
import { ClearMarkerRichiestaHover, ClearMarkerRichiestaSelezionato, SetMarkerRichiestaHover, SetMarkerRichiestaSelezionato } from '../store/actions/maps/marker.actions';
import { GetInitZoomCentroMappa } from '../store/actions/maps/centro-mappa.actions';
import { ClearMarkerOpachiRichieste, SetMarkerOpachiRichieste } from '../store/actions/maps/marker-opachi.actions';
import { SetRichiestaModifica } from '../store/actions/form-richiesta/richiesta-modifica.actions';
import { SetRichiestaComposizione } from '../store/actions/composizione-partenza/composizione-partenza.actions';
import { SetRichiestaGestione } from '../store/actions/richieste/richiesta-gestione.actions';
import { RichiestaGestioneState } from '../store/states/richieste/richiesta-gestione.state';
import { MezzoActionInterface } from '../../../shared/interface/mezzo-action.interface';
import { ActionMezzo, ClearRichieste, EliminaPartenzaRichiesta, GetListaRichieste } from '../store/actions/richieste/richieste.actions';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';
import { PaginationState } from '../../../shared/store/states/pagination/pagination.state';
import { ResetFiltriSelezionatiRichieste } from '../store/actions/filterbar/filtri-richieste.actions';
import { StatoRichiesta } from '../../../shared/enum/stato-richiesta.enum';
import { FiltriRichiesteState } from '../store/states/filterbar/filtri-richieste.state';
import { VoceFiltro } from '../filterbar/filtri-richieste/voce-filtro.model';
import { SetTriageSummary } from '../../../shared/store/actions/triage-summary/triage-summary.actions';

@Component({
    selector: 'app-richieste',
    templateUrl: './richieste.component.html',
    styleUrls: ['./richieste.component.css']
})
export class RichiesteComponent implements OnInit, OnDestroy {

    @Input() boxAttivi: boolean;
    @Input() nightMode: boolean;

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
    idRichiestaSelezionata: string;

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
    listHeightClass = 'm-h-710';
    permessiFeature = PermissionFeatures;
    statoRichiesta = StatoRichiesta;

    subscription = new Subscription();

    constructor(private modalService: NgbModal,
                private filter: FilterPipe,
                private store: Store) {
        this.getRichieste();
    }

    ngOnInit(): void {
        this.store.dispatch(new GetListaRichieste());
        this.getRichiestaFissata();
        this.getRichiestaFissataEspanso();
        this.getRichiestaHover();
        this.getRichiestaSelezionata();
        this.getRichiestaGestione();
        this.getRicercaRichieste();
        this.getFiltriSelezionati();
        console.log('Componente Richieste creato');
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.store.dispatch([
            new ResetFiltriSelezionatiRichieste({ preventGetList: true }),
            new ClearRichieste()
        ]);
        console.log('Componente Richieste distrutto');
    }

    getRichieste(): void {
        this.subscription.add(
            this.richieste$.subscribe((richieste: SintesiRichiesta[]) => {
                this.richieste = richieste;
                this.loaderRichieste = false;
            })
        );
    }

    onNuoveRichieste(page: number): void {
        this.store.dispatch(new GetListaRichieste({ page }));
    }

    onRefreshRichieste(): void {
        this.store.dispatch(new GetListaRichieste());
    }

    // Restituisce la Richiesta Fissata
    getRichiestaFissata(): void {
        this.subscription.add(
            this.richiestaFissata$.subscribe((richiestaFissata: SintesiRichiesta) => {
                if (richiestaFissata) {
                    this.richiestaFissata = richiestaFissata;
                    if (this.boxAttivi) {
                        this.listHeightClass = 'm-h-572';
                    } else {
                        this.listHeightClass = 'm-h-677';
                    }
                } else {
                    setTimeout(() => {
                        this.richiestaFissata = null;
                        if (this.boxAttivi) {
                            this.listHeightClass = 'm-h-710';
                        } else {
                            this.listHeightClass = 'm-h-795';
                        }
                    }, 300);
                }
            })
        );
    }

    getRichiestaFissataEspanso(): void {
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
    getRichiestaHover(): void {
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
    getRichiestaSelezionata(): void {
        this.subscription.add(
            this.idRichiestaSelezionata$.subscribe((idRichiestaSelezionata: string) => {
                if (idRichiestaSelezionata) {
                    this.idRichiestaSelezionata = idRichiestaSelezionata;
                } else {
                    this.idRichiestaSelezionata = null;
                }
                const aggiornamentoRichiesto = this.store.selectSnapshot(RichiesteState.needRefresh);
                if (aggiornamentoRichiesto) {
                    this.store.dispatch(new GetListaRichieste());
                }
            })
        );
    }

    getRichiestaGestione(): void {
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

    getRicercaRichieste(): void {
        // Restituisce la stringa di ricerca
        this.subscription.add(
            this.ricerca$.subscribe((ricerca: any) => {
                this.ricerca = ricerca;
                this.opacizzaRichieste(ricerca);
            })
        );
    }

    getFiltriSelezionati(): void {
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
                const s = [];
                result.forEach((c: any) => {
                    s.push(c.id);
                });
                this.store.dispatch(new SetMarkerOpachiRichieste(s));
            } else {
                this.store.dispatch(new ClearMarkerOpachiRichieste());
            }
        }
    }

    onHoverIn(idRichiesta: string): void {
        this.store.dispatch(new SetMarkerRichiestaHover(idRichiesta));
        this.store.dispatch(new SetRichiestaHover(idRichiesta));
    }

    onHoverOut(): void {
        this.store.dispatch(new ClearMarkerRichiestaHover());
        this.store.dispatch(new ClearRichiestaHover());
    }

    onSelezione(idRichiesta: string): void {
        this.store.dispatch(new SetMarkerRichiestaSelezionato(idRichiesta));
        this.store.dispatch(new SetRichiestaSelezionata(idRichiesta));
    }

    onDeselezione(): void {
        this.store.dispatch(new ClearMarkerRichiestaSelezionato());
        this.store.dispatch(new GetInitZoomCentroMappa());
        this.store.dispatch(new ClearRichiestaSelezionata());
    }

    onFissaInAlto(richiesta: SintesiRichiesta): void {
        this.store.dispatch(new SetMarkerRichiestaSelezionato(richiesta.id));
        this.store.dispatch(new SetRichiestaFissata(richiesta.id, richiesta.codice));
    }

    onDefissa(): void {
        this.store.dispatch(new ClearMarkerRichiestaSelezionato());
        this.store.dispatch(new GetInitZoomCentroMappa());
        this.store.dispatch(new ClearRichiestaFissata());
    }

    onModificaRichiesta(richiesta: SintesiRichiesta): void {
        this.store.dispatch(new SetRichiestaModifica(richiesta));
        this.store.dispatch(new SetTriageSummary(richiesta.triageSummary));
        this.store.dispatch(new SetMarkerRichiestaSelezionato(richiesta.id));
        this.store.dispatch(new ToggleModifica());
    }

    onGestioneRichiesta(richiesta: SintesiRichiesta): void {
        this.store.dispatch(new SetRichiestaGestione(richiesta));
        // console.log('Gestione Richiesta', richiesta);
    }

    toggleComposizione(): void {
        this.store.dispatch(new ToggleComposizione(Composizione.Avanzata));
    }

    nuovaPartenza(richiesta: SintesiRichiesta): void {
        this.store.dispatch([
            new SetMarkerRichiestaSelezionato(richiesta.id),
            new SetRichiestaComposizione(richiesta)
        ]);
    }

    onActionMezzo(actionMezzo: MezzoActionInterface): void {
        this.store.dispatch(new ActionMezzo(actionMezzo));
        // console.log('actionMezzo', actionMezzo);
    }

    onEliminaPartenza(event: { targaMezzo: string, idRichiesta: string, modalResult: any }): void {
        this.store.dispatch(new EliminaPartenzaRichiesta(event.targaMezzo, event.idRichiesta, event.modalResult));
    }
}
