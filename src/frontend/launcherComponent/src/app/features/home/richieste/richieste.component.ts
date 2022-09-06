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
import { SetCentroMappa, SetZoomCentroMappa } from '../../maps/store/actions/centro-mappa.actions';
import { SetRichiestaModifica } from '../store/actions/form-richiesta/richiesta-modifica.actions';
import { SetRichiestaComposizione } from '../store/actions/composizione-partenza/composizione-partenza.actions';
import { SetRichiestaGestione } from '../store/actions/richieste/richiesta-gestione.actions';
import { RichiestaGestioneState } from '../store/states/richieste/richiesta-gestione.state';
import { MezzoActionInterface } from '../../../shared/interface/mezzo-action.interface';
import { ActionMezzo, ClearRichieste, GetListaRichieste } from '../store/actions/richieste/richieste.actions';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';
import { PaginationState } from '../../../shared/store/states/pagination/pagination.state';
import { ResetFiltriSelezionatiRichieste } from '../store/actions/filterbar/filtri-richieste.actions';
import { StatoRichiesta } from '../../../shared/enum/stato-richiesta.enum';
import { FiltriRichiesteState } from '../store/states/filterbar/filtri-richieste.state';
import { VoceFiltro } from '../filterbar/filtri-richieste/voce-filtro.model';
import { EntiState } from '../../../shared/store/states/enti/enti.state';
import { EnteInterface } from '../../../shared/interface/ente.interface';
import { InfoMezzo, LoadingState } from '../../../shared/store/states/loading/loading.state';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { ClearRicercaFilterbar } from '../store/actions/filterbar/ricerca-richieste.actions';
import { TipoConcorrenzaEnum } from '../../../shared/enum/tipo-concorrenza.enum';
import { DeleteAllConcorrenza } from '../../../shared/store/actions/concorrenza/concorrenza.actions';
import { SchedeContattoState } from '../store/states/schede-contatto/schede-contatto.state';
import { ClockService } from '../../navbar/clock/clock-service/clock.service';

@Component({
    selector: 'app-richieste',
    templateUrl: './richieste.component.html',
    styleUrls: ['./richieste.component.css']
})
export class RichiesteComponent implements OnInit, OnDestroy {

    @Input() boxAttivi: boolean;
    @Input() nightMode: boolean;

    @Select(RicercaFilterbarState.ricerca) ricerca$: Observable<string>;
    ricerca: string;

    @Select(RichiesteState.richieste) richieste$: Observable<SintesiRichiesta[]>;
    richieste: SintesiRichiesta[] = [];

    @Select(RichiestaFissataState.richiestaFissata) richiestaFissata$: Observable<SintesiRichiesta>;
    richiestaFissata: SintesiRichiesta;

    @Select(RichiestaGestioneState.richiestaGestione) richiestaGestione$: Observable<SintesiRichiesta>;
    richiestaGestione: SintesiRichiesta;

    @Select(RichiestaHoverState.idRichiestaHover) idRichiestaHover$: Observable<string>;
    richiestaHover: SintesiRichiesta;

    @Select(RichiestaSelezionataState.idRichiestaSelezionata) idRichiestaSelezionata$: Observable<string>;
    idRichiestaSelezionata: string;

    @Select(RichiesteState.loadingRichieste) loadingRichieste$: Observable<boolean>;
    @Select(RichiesteState.needRefresh) needRefresh$: Observable<boolean>;
    @Select(RichiesteState.loadingActionRichiesta) loadingActionRichiesta$: Observable<string[]>;
    @Select(RichiesteState.loadingActionMezzo) loadingActionMezzo$: Observable<string[]>;

    @Select(PaginationState.page) page$: Observable<number>;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;

    @Select(LoadingState.annullaStatoMezzi) annullaStatoMezzi$: Observable<InfoMezzo[]>;

    @Select(FiltriRichiesteState.filtriRichiesteSelezionati) filtriRichiesteSelezionati$: Observable<VoceFiltro[]>;
    codiciFiltriSelezionati: string[] = [];

    @Select(EntiState.enti) enti$: Observable<EnteInterface[]>;
    enti: EnteInterface[];

    @Select(SchedeContattoState.loadingDettaglioSchedeContatto) loadingDettaglioSchedaContatto$: Observable<string>;

    loaderRichieste = true;
    listHeightClass = 'm-h-720';

    dateSync: Date;

    // ENUM
    permessiFeature = PermissionFeatures;
    statoRichiesta = StatoRichiesta;
    tipoConcorrenzaEnum = TipoConcorrenzaEnum;

    private subscriptions = new Subscription();

    constructor(private clockService: ClockService,
                private modalService: NgbModal,
                private filter: FilterPipe,
                private store: Store) {
        this.getRichieste();
    }

    ngOnInit(): void {
        this.store.dispatch(new GetListaRichieste());
        this.getClock();
        this.heightControl();
        this.getRichiestaFissata();
        this.getRichiestaHover();
        this.getRichiestaSelezionata();
        this.getRichiestaGestione();
        this.getRicercaRichieste();
        this.getFiltriSelezionati();
        this.getEnti();
        console.log('Componente Richieste creato');
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.store.dispatch([
            new DeleteAllConcorrenza(),
            new ResetFiltriSelezionatiRichieste({ preventGetList: true }),
            new ClearRichieste(),
            new ClearRichiestaSelezionata(),
            new ClearRichiestaHover(),
            new ClearRicercaFilterbar()
        ]);
        console.log('Componente Richieste distrutto');
    }

    heightControl(): void {
        if (!this.richiestaFissata) {
            if (this.boxAttivi) {
                this.listHeightClass = 'm-h-710';
            } else {
                this.listHeightClass = 'm-h-840';
            }
        }
    }

    getClock(): void {
        this.subscriptions.add(
            this.clockService.getClock().subscribe((dateSync: Date) => {
                if (dateSync) {
                    this.dateSync = dateSync;
                }
            })
        );
    }

    getRichieste(): void {
        this.subscriptions.add(
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
        this.subscriptions.add(
            this.richiestaFissata$.subscribe((richiestaFissata: SintesiRichiesta) => {
                if (richiestaFissata) {
                    this.richiestaFissata = richiestaFissata;
                    if (this.boxAttivi) {
                        this.listHeightClass = 'm-h-647';
                    } else {
                        this.listHeightClass = 'm-h-737';
                    }
                } else {
                    setTimeout(() => {
                        this.richiestaFissata = null;
                        if (this.boxAttivi) {
                            this.listHeightClass = 'm-h-710';
                        } else {
                            this.listHeightClass = 'm-h-840';
                        }
                    }, 300);
                }
            })
        );
    }

    // Restituisce la Richiesta Hover
    getRichiestaHover(): void {
        this.subscriptions.add(
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
        this.subscriptions.add(
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
        this.subscriptions.add(
            this.richiestaGestione$.subscribe((richiestaGestione: SintesiRichiesta) => {
                richiestaGestione ? this.richiestaGestione = richiestaGestione : this.richiestaGestione = null;
            })
        );
    }

    getRicercaRichieste(): void {
        // Restituisce la stringa di ricerca
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: any) => {
                if (ricerca || ricerca === '') {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetListaRichieste({ page: 1 }));
                }
            })
        );
    }

    getFiltriSelezionati(): void {
        this.subscriptions.add(
            this.filtriRichiesteSelezionati$.subscribe((filtri: VoceFiltro[]) => {
                this.codiciFiltriSelezionati = filtri.map(filtro => filtro.codice);
            })
        );
    }

    getEnti(): void {
        this.subscriptions.add(
            this.enti$.subscribe((enti: EnteInterface[]) => {
                this.enti = enti;
            })
        );
    }

    onHoverIn(idRichiesta: string): void {
        this.store.dispatch(new SetRichiestaHover(idRichiesta));
    }

    onHoverOut(): void {
        this.store.dispatch(new ClearRichiestaHover());
    }

    onSelezione(event: { idRichiesta: string, coordinate: Coordinate }): void {
        this.store.dispatch([
            new SetRichiestaSelezionata(event.idRichiesta)
        ]);
    }

    onDeselezione(): void {
        this.store.dispatch([
            new ClearRichiestaSelezionata()
        ]);
    }

    onFissaInAlto(richiesta: SintesiRichiesta): void {
        this.store.dispatch(new SetRichiestaFissata(richiesta.id, richiesta.codice));
    }

    onDefissa(): void {
        this.store.dispatch(new ClearRichiestaFissata());
    }

    onModificaRichiesta(richiesta: SintesiRichiesta): void {
        this.store.dispatch([
            new SetRichiestaModifica(richiesta),
            new ToggleModifica()
        ]);
    }

    onGestioneRichiesta(richiesta: SintesiRichiesta): void {
        this.store.dispatch(new SetRichiestaGestione(richiesta));
    }

    toggleComposizione(): void {
        this.store.dispatch([
            new ToggleComposizione(Composizione.Avanzata)
        ]);
    }

    nuovaPartenza(richiesta: SintesiRichiesta): void {
        this.store.dispatch([
            new SetRichiestaComposizione(richiesta),
            new SetCentroMappa({ coordinateCentro: richiesta.localita.coordinate }),
            new SetZoomCentroMappa(16)
        ]);
    }

    onActionMezzo(actionMezzo: MezzoActionInterface): void {
        this.store.dispatch(new ActionMezzo(actionMezzo));
    }
}
