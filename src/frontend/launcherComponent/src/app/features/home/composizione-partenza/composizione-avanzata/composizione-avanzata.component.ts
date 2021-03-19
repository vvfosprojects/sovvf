import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgbPopoverConfig, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subscription} from 'rxjs';
import {MezzoComposizione} from '../../../../shared/interface/mezzo-composizione-interface';
import {SquadraComposizione} from '../../../../shared/interface/squadra-composizione-interface';
import {DirectionInterface} from '../../maps/maps-interface/direction-interface';
import {SintesiRichiesta} from '../../../../shared/model/sintesi-richiesta.model';
import {Composizione} from '../../../../shared/enum/composizione.enum';
import {Select, Store} from '@ngxs/store';
import {makeCopy} from '../../../../shared/helper/function';
import {ComposizionePartenzaState} from '../../store/states/composizione-partenza/composizione-partenza.state';
import {MezziComposizioneState} from '../../../../shared/store/states/mezzi-composizione/mezzi-composizione.state';
import {SquadreComposizioneState} from '../../../../shared/store/states/squadre-composizione/squadre-composizione.state';
import {
    HoverInMezzoComposizione,
    HoverOutMezzoComposizione,
    UnselectMezzoComposizione,
    ReducerSelectMezzoComposizione,
    ReducerSelectMezzoComposizioneInRientro, ReducerSelectMezzoComposizionePreAccoppiati
} from '../../../../shared/store/actions/mezzi-composizione/mezzi-composizione.actions';
import {BoxPartenzaState} from '../../store/states/composizione-partenza/box-partenza.state';
import {BoxPartenza} from '../interface/box-partenza-interface';
import {
    AddBoxPartenza,
    ClearBoxPartenze,
    RemoveBoxPartenza,
    RemoveMezzoBoxPartenzaSelezionato,
    RemoveSquadraBoxPartenza,
    RequestAddBoxPartenza,
    DeselectBoxPartenza
} from '../../store/actions/composizione-partenza/box-partenza.actions';
import {
    ClearSelectedSquadreComposizione,
    ClearSquadraComposizione,
    HoverInSquadraComposizione,
    HoverOutSquadraComposizione,
    SelectSquadraComposizione,
    SelectSquadraComposizioneInRientro,
    SelectSquadraComposizionePreAccoppiati,
    UnselectSquadraComposizione,
    UnselectSquadraComposizioneInRientro,
    UnselectSquadraComposizionePreAccoppiati
} from '../../../../shared/store/actions/squadre-composizione/squadre-composizione.actions';
import {ConfirmPartenze} from '../../store/actions/composizione-partenza/composizione-partenza.actions';
import {TurnoState} from '../../../navbar/store/states/turno.state';
import {SganciamentoInterface} from 'src/app/shared/interface/sganciamento.interface';
import {MezzoDirection} from '../../../../shared/interface/mezzo-direction';
import {ConfermaPartenze} from '../interface/conferma-partenze-interface';
import {StatoMezzo} from '../../../../shared/enum/stato-mezzo.enum';
import {FiltriComposizioneState} from '../../../../shared/store/states/filtri-composizione/filtri-composizione.state';
import {GetFiltriComposizione} from '../../../../shared/store/actions/filtri-composizione/filtri-composizione.actions';
import {PaginationComposizionePartenzaState} from 'src/app/shared/store/states/pagination-composizione-partenza/pagination-composizione-partenza.state';
import {GetListeComposizioneAvanzata} from '../../store/actions/composizione-partenza/composizione-avanzata.actions';
import {ResetPaginationComposizionePartenza} from '../../../../shared/store/actions/pagination-composizione-partenza/pagination-composizione-partenza.actions';
import {
    SetRicercaMezziComposizione,
    SetRicercaSquadreComposizione
} from '../../../../shared/store/actions/ricerca-composizione/ricerca-composizione.actions';
import {TriageSummary} from '../../../../shared/interface/triage-summary.interface';
import {NecessitaSoccorsoAereoEnum} from '../../../../shared/enum/necessita-soccorso-aereo.enum';

@Component({
    selector: 'app-composizione-avanzata',
    templateUrl: './composizione-avanzata.component.html',
    styleUrls: ['./composizione-avanzata.component.css']
})
export class ComposizioneAvanzataComponent implements OnInit, OnDestroy {

    // Mezzi Composizione
    @Select(MezziComposizioneState.mezziComposizione) mezziComposizione$: Observable<MezzoComposizione[]>;
    mezziComposizione: MezzoComposizione[];
    @Select(MezziComposizioneState.idMezzoComposizioneSelezionato) idMezzoSelezionato$: Observable<string>;
    idMezzoSelezionato: string;
    @Select(MezziComposizioneState.idMezziInPrenotazione) idMezziInPrenotazione$: Observable<string[]>;
    idMezziInPrenotazione: string[];
    @Select(MezziComposizioneState.idMezziPrenotati) idMezziPrenotati$: Observable<string[]>;
    idMezziPrenotati: string[];
    @Select(MezziComposizioneState.idMezziBloccati) idMezziBloccati$: Observable<string[]>;
    idMezziBloccati: string[];
    @Select(MezziComposizioneState.idMezzoHover) idMezzoHover$: Observable<string>;
    idMezzoHover: string;

    // Squadre Composizione
    @Select(SquadreComposizioneState.squadreComposizione) squadraComposizione$: Observable<SquadraComposizione[]>;
    squadreComposizione: SquadraComposizione[];
    @Select(SquadreComposizioneState.idSquadreSelezionate) idSquadreSelezionate$: Observable<string[]>;
    idSquadreSelezionate: Array<string>;
    @Select(SquadreComposizioneState.idSquadraHover) idSquadraHover$: Observable<string>;
    idSquadraHover: string;

    // Filtri Composizione
    @Select(FiltriComposizioneState.filtriSelezionati) filtriSelezionati$: Observable<any>;
    filtriSelezionati: any;

    // BoxPartenza Composizione
    @Select(BoxPartenzaState.boxPartenzaList) boxPartenzaList$: Observable<BoxPartenza[]>;
    boxPartenzaList: BoxPartenza[];
    @Select(BoxPartenzaState.idBoxPartenzaSelezionato) idBoxPartenzaSelezionato$: Observable<string>;
    idBoxPartenzaSelezionato: string;

    @Select(BoxPartenzaState.disableConfirmPartenza) disableConfirmPartenza$: Observable<boolean>;
    @Select(BoxPartenzaState.disableNuovaPartenza) disableNuovaPartenza$: Observable<boolean>;

    // Loading Liste Mezzi e Squadre
    @Select(ComposizionePartenzaState.loadingListe) loadingListe$: Observable<boolean>;
    loadingListe: boolean;

    // Paginazione Mezzi
    @Select(PaginationComposizionePartenzaState.pageMezzi) currentPageMezzi$: Observable<number>;
    currentPageMezzi: number;
    @Select(PaginationComposizionePartenzaState.totalItemsMezzi) totalItemsMezzi$: Observable<number>;
    totalItemsMezzi: number;
    @Select(PaginationComposizionePartenzaState.pageSizeMezzi) pageSizeMezzi$: Observable<number>;
    pageSizeMezzi: number;

    // Paginazione Squadre
    @Select(PaginationComposizionePartenzaState.pageSquadre) currentPageSquadre$: Observable<number>;
    currentPageSquadre: number;
    @Select(PaginationComposizionePartenzaState.totalItemsSquadre) totalItemsSquadre$: Observable<number>;
    totalItemsSquadre: number;
    @Select(PaginationComposizionePartenzaState.pageSizeSquadre) pageSizeSquadre$: Observable<number>;
    pageSizeSquadre: number;


    @Input() richiesta: SintesiRichiesta;
    @Input() loadingInvioPartenza: boolean;
    @Input() boxAttivi: boolean;
    @Input() triageSummary: TriageSummary[];
    @Input() nightMode: boolean;
    @Input() doubleMonitor: boolean;

    @Output() centraMappa = new EventEmitter();
    @Output() sendDirection = new EventEmitter<DirectionInterface>();
    @Output() clearDirection = new EventEmitter();
    @Output() sganciamento = new EventEmitter<SganciamentoInterface>();
    @Output() changeRicercaSquadre = new EventEmitter<string>();
    @Output() changeRicercaMezzi = new EventEmitter<string>();

    statoMezzo = StatoMezzo;
    Composizione = Composizione;

    ricercaSquadre: string;
    ricercaMezzi: string;

    private subscription = new Subscription();

    constructor(private popoverConfig: NgbPopoverConfig,
                private tooltipConfig: NgbTooltipConfig,
                private store: Store) {
        // Popover options
        this.popoverConfig.container = 'body';
        this.popoverConfig.placement = 'top';
        // Tooltip options
        this.tooltipConfig.container = 'body';
        this.tooltipConfig.placement = 'top';

        // Prendo i mezzi da visualizzare nella lista
        this.subscription.add(
            this.mezziComposizione$.subscribe((mezziComp: MezzoComposizione[]) => {
                this.mezziComposizione = mezziComp;
            })
        );
        // Prendo il mezzo selezionato
        this.subscription.add(
            this.idMezzoSelezionato$.subscribe((idMezzo: string) => {
                this.idMezzoSelezionato = idMezzo;
            })
        );
        // Prendo i mezzi in prenotazione
        this.subscription.add(
            this.idMezziInPrenotazione$.subscribe((idMezzi: string[]) => {
                this.idMezziInPrenotazione = idMezzi;
            })
        );
        // Prendo i mezzi prenotati
        this.subscription.add(
            this.idMezziPrenotati$.subscribe((idMezzi: string[]) => {
                this.idMezziPrenotati = idMezzi;
            })
        );
        // Prendo il mezzo hover
        this.subscription.add(
            this.idMezzoHover$.subscribe((idMezzo: string) => {
                this.idMezzoHover = idMezzo;
            })
        );
        // Prendo il mezzo bloccato
        this.subscription.add(
            this.idMezziBloccati$.subscribe((idMezzi: string[]) => {
                this.idMezziBloccati = idMezzi;
            })
        );

        // Prendo le squadre da visualizzare nella lista
        this.subscription.add(
            this.squadraComposizione$.subscribe((squadreComp: SquadraComposizione[]) => {
                if (squadreComp) {
                    this.squadreComposizione = makeCopy(squadreComp);
                }
            })
        );
        // Prendo la squadra selezionata
        this.subscription.add(
            this.idSquadreSelezionate$.subscribe((idSquadre: string[]) => {
                this.idSquadreSelezionate = idSquadre;
            })
        );
        // Prendo la squadra hover
        this.subscription.add(
            this.idSquadraHover$.subscribe((idSquadra: string) => {
                this.idSquadraHover = idSquadra;
            })
        );

        // Prendo i filtri selezionati
        this.subscription.add(
            this.filtriSelezionati$.subscribe((filtriSelezionati: any) => {
                this.filtriSelezionati = makeCopy(filtriSelezionati);
            })
        );

        // Prendo i box partenza
        this.subscription.add(
            this.boxPartenzaList$.subscribe((boxPartenza: BoxPartenza[]) => {
                this.boxPartenzaList = boxPartenza;
            })
        );
        // Prendo il box partenza selezionato
        this.subscription.add(
            this.idBoxPartenzaSelezionato$.subscribe((idBoxPartenza: string) => {
                this.idBoxPartenzaSelezionato = idBoxPartenza;
            })
        );

        // Prendo Pagina Corrente Mezzi
        this.subscription.add(
            this.currentPageMezzi$.subscribe((currentPageMezzi: number) => {
                this.currentPageMezzi = currentPageMezzi;
            })
        );
        // Prendo Totale Items Mezzi
        this.subscription.add(
            this.totalItemsMezzi$.subscribe((totalItemsMezzi: number) => {
                this.totalItemsMezzi = totalItemsMezzi;
            })
        );
        // Prendo Pagina Size Mezzi
        this.subscription.add(
            this.pageSizeMezzi$.subscribe((pageSizeMezzi: number) => {
                this.pageSizeMezzi = pageSizeMezzi;
            })
        );

        // Prendo Pagina Corrente Squadre
        this.subscription.add(
            this.currentPageSquadre$.subscribe((currentPageSquadre: number) => {
                this.currentPageSquadre = currentPageSquadre;
            })
        );
        // Prendo Totale Items Squadre
        this.subscription.add(
            this.totalItemsSquadre$.subscribe((totalItemsSquadre: number) => {
                this.totalItemsSquadre = totalItemsSquadre;
            })
        );
        // Prendo Pagina Size Squadre
        this.subscription.add(
            this.pageSizeSquadre$.subscribe((pageSizeSquadre: number) => {
                this.pageSizeSquadre = pageSizeSquadre;
            })
        );
        this.subscription.add(this.loadingListe$.subscribe(res => this.loadingListe = res));
    }

    ngOnInit(): void {
        this.store.dispatch(new GetFiltriComposizione());
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearBoxPartenze(),
            new ResetPaginationComposizionePartenza(),
            new SetRicercaMezziComposizione(undefined),
            new SetRicercaSquadreComposizione(undefined),
        ]);
        this.subscription.unsubscribe();
    }

    nightModeText(): string {
        let value = '';
        if (!this.nightMode) {
            value = 'text-dark';
        } else if (this.nightMode) {
            value = 'text-white';
        }
        return value;
    }

    checkSquadraSelezione(idSquadra: string): boolean {
        let squadraSelezionata = false;
        if (this.idSquadreSelezionate) {
            this.idSquadreSelezionate.forEach((id: string) => {
                if (id === idSquadra) {
                    squadraSelezionata = true;
                }
            });
        }
        return squadraSelezionata;
    }

    checkDoubleDividi(box: BoxPartenza): boolean {
        if (box.squadreComposizione && box.squadreComposizione.length === 1) {
            const id = box.squadreComposizione[0].id;
            let inputVec = [];
            inputVec = this.boxPartenzaList.slice().reverse();
            const vec: BoxPartenza[] = inputVec.filter(x => x.squadreComposizione && x.squadreComposizione.length === 1 && x.squadreComposizione[0].id === id);
            return vec && vec.length > 1 && vec.reverse().findIndex(x => x === box) === 0;
        } else { return false; }
    }

    checkSquadraHover(idSquadra: string): boolean {
        let squadraHover = false;
        if (this.idSquadraHover && this.idSquadraHover === idSquadra) {
            squadraHover = true;
        }
        return squadraHover;
    }

    checkMezzoSelezione(idMezzo: string): boolean {
        let mezzoSelezionato = false;
        if (this.idMezzoSelezionato && this.idMezzoSelezionato === idMezzo) {
            mezzoSelezionato = true;
        }
        return mezzoSelezionato;
    }

    checkMezzoHover(idMezzo: string): boolean {
        let mezzoHover = false;
        if (this.idMezzoHover && this.idMezzoHover === idMezzo) {
            mezzoHover = true;
        }
        return mezzoHover;
    }

    getSoccorsoAereoTriage(): { desc: NecessitaSoccorsoAereoEnum | string, value: number } {
        if (!!this.triageSummary) {
            let soccorsoAereoTriage: string;
            for (const summary of this.triageSummary) {
                const soccorsoAereo = summary.soccorsoAereo;
                if (soccorsoAereo) {
                    soccorsoAereoTriage = soccorsoAereo;
                }
            }
            switch (soccorsoAereoTriage) {
                case NecessitaSoccorsoAereoEnum.NonNecessario:
                    return {
                        desc: NecessitaSoccorsoAereoEnum.NonNecessario,
                        value: 1
                    };
                case NecessitaSoccorsoAereoEnum.Utile:
                    return {
                        desc: NecessitaSoccorsoAereoEnum.Utile,
                        value: 2
                    };
                case NecessitaSoccorsoAereoEnum.MoltoUtile:
                    return {
                        desc: NecessitaSoccorsoAereoEnum.MoltoUtile,
                        value: 3
                    };
                case NecessitaSoccorsoAereoEnum.Indispensabile:
                    return {
                        desc: NecessitaSoccorsoAereoEnum.Indispensabile,
                        value: 4
                    };
            }
        }
        return {
            desc: 'Non Impostata',
            value: 0
        };
    }

    mezzoSelezionato(mezzoComposizione: MezzoComposizione): void {
        this.store.dispatch(new ReducerSelectMezzoComposizione(mezzoComposizione));
    }

    mezzoSelezionatoInRientro(mezzoComposizione: MezzoComposizione): void {
        this.store.dispatch(new ReducerSelectMezzoComposizioneInRientro(mezzoComposizione));
    }

    mezzoSelezionatoPreAccoppiati(mezzoComposizione: MezzoComposizione): void {
        this.store.dispatch(new ReducerSelectMezzoComposizionePreAccoppiati(mezzoComposizione));
    }

    mezzoDeselezionato(mezzoComposizione: MezzoComposizione): void {
        this.store.dispatch([
            new UnselectMezzoComposizione(),
            new RemoveMezzoBoxPartenzaSelezionato()
        ]);
        this.onClearDirection();
    }

    mezzoDeselezionatoInRientro(mezzoComposizione: MezzoComposizione): void {
        const boxPartenzaSelezionato = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaSelezionato);
        this.store.dispatch([
            new UnselectMezzoComposizione(),
            new ClearSelectedSquadreComposizione(),
            new RemoveBoxPartenza(boxPartenzaSelezionato),
            new GetListeComposizioneAvanzata()
        ]);
        this.onClearDirection();
    }

    mezzoDeselezionatoPreAccoppiati(mezzoComposizione: MezzoComposizione): void {
        const boxPartenzaSelezionato = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaSelezionato);
        this.store.dispatch([
            new UnselectMezzoComposizione(),
            new ClearSelectedSquadreComposizione(),
            new RemoveBoxPartenza(boxPartenzaSelezionato),
            new GetListeComposizioneAvanzata()
        ]);
        this.onClearDirection();
    }

    mezzoHoverIn(mezzoComposizione: MezzoComposizione): void {
        this.store.dispatch([
            new HoverInMezzoComposizione(mezzoComposizione.id, mezzoComposizione.mezzo.coordinateFake),
        ]);
    }

    mezzoHoverOut(): void {
        this.store.dispatch([
            new HoverOutMezzoComposizione(),
        ]);
    }

    squadraSelezionata(squadraComposizione: SquadraComposizione): void {
        if (squadraComposizione) {
            if (this.boxPartenzaList.length <= 0) {
                this.store.dispatch(new AddBoxPartenza());
            }
            this.store.dispatch([
                new SelectSquadraComposizione(squadraComposizione),
            ]);
        }
    }

    squadraSelezionataInRientro(squadraComposizione: SquadraComposizione): void {
        if (squadraComposizione) {
            this.store.dispatch([
                new SelectSquadraComposizioneInRientro(squadraComposizione),
            ]);
        }
    }

    squadraSelezionataPreAccoppiati(squadraComposizione: SquadraComposizione): void {
        if (squadraComposizione) {
            this.store.dispatch([
                new SelectSquadraComposizionePreAccoppiati(squadraComposizione),
            ]);
        }
    }

    squadraDeselezionata(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch(new UnselectSquadraComposizione(squadraComposizione));
        this.store.dispatch(new RemoveSquadraBoxPartenza(squadraComposizione.id));
    }

    squadraDeselezionataInRientro(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch(new UnselectSquadraComposizioneInRientro(squadraComposizione));
        this.store.dispatch(new RemoveSquadraBoxPartenza(squadraComposizione.id));
    }

    squadraDeselezionataPreAccoppiati(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch(new UnselectSquadraComposizionePreAccoppiati(squadraComposizione));
        this.store.dispatch(new RemoveSquadraBoxPartenza(squadraComposizione.id));
    }

    squadraHoverIn(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch(new HoverInSquadraComposizione(squadraComposizione.id));
    }

    squadraHoverOut(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch(new HoverOutSquadraComposizione(squadraComposizione.id));
    }

    onSearchSquadre(): void {
        this.changeRicercaSquadre.emit(makeCopy(this.ricercaSquadre));
    }

    onSearchMezzi(): void {
        this.changeRicercaMezzi.emit(makeCopy(this.ricercaMezzi));
    }

    onClearSearchSquadre(): void {
        this.ricercaSquadre = '';
        this.changeRicercaSquadre.emit(makeCopy(this.ricercaSquadre));
    }

    onClearSearchMezzi(): void {
        this.ricercaMezzi = '';
        this.changeRicercaMezzi.emit(makeCopy(this.ricercaMezzi));
    }

    boxPartenzaSelezionato(boxPartenza: BoxPartenza): void {
        // this.store.dispatch(new RequestSelectBoxPartenza(boxPartenza.id));
    }

    nuovaPartenza(): void {
        if (this.boxPartenzaList.length === 0) {
            this.store.dispatch(new RequestAddBoxPartenza());
            this.dopoAggiungiBoxPartenza();
        } else {
            this.store.dispatch(new RequestAddBoxPartenza());
            this.dopoAggiungiBoxPartenza();
            this.store.dispatch(new GetListeComposizioneAvanzata());
        }
    }

    squadraShortcut(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch(new AddBoxPartenza());
        this.dopoAggiungiBoxPartenza();
        this.store.dispatch(new SelectSquadraComposizione(squadraComposizione, true));
    }

    eliminaBoxPartenza(boxPartenza: BoxPartenza): void {
        this.store.dispatch(new RemoveBoxPartenza(boxPartenza));
        this.onClearDirection();
        this.store.dispatch(new GetListeComposizioneAvanzata());
    }

    dopoAggiungiBoxPartenza(): void {
        this.boxPartenzaList.forEach(boxPartenza => {
            if (boxPartenza.mezzoComposizione) {
                this.store.dispatch(new DeselectBoxPartenza(boxPartenza));
            }
            this.onClearDirection();
        });
    }

    confermaPartenzeInViaggio(): void {
        const partenze = makeCopy(this.boxPartenzaList);
        const partenzeMappedArray = partenze.map(obj => {
            const rObj = {
                mezzo: null,
                squadre: null
            };
            if (obj.mezzoComposizione) {
                obj.mezzoComposizione.mezzo.stato = StatoMezzo.InViaggio;
                rObj.mezzo = obj.mezzoComposizione.mezzo;
            } else {
                rObj.mezzo = null;
            }
            if (obj.squadreComposizione.length > 0) {
                rObj.squadre = obj.squadreComposizione.map((squadraComp: SquadraComposizione) => {
                    return squadraComp.squadra;
                });
            } else {
                rObj.squadre = [];
            }
            return rObj;
        });
        const partenzeObj: ConfermaPartenze = {
            partenze: partenzeMappedArray,
            idRichiesta: this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).codice,
            turno: this.store.selectSnapshot(TurnoState.turnoCalendario).corrente
        };
        this.store.dispatch([
            new ConfirmPartenze(partenzeObj),
            new ClearSquadraComposizione()
        ]);
    }

    onClearDirection(): void {
        this.clearDirection.emit();
        this.centraMappa.emit();
    }

    mezziPageChange(pageMezzi: number): void {
        const options = {
            page: {
                pageMezzi,
            }
        };
        this.store.dispatch(new GetListeComposizioneAvanzata(options));
    }

    squadrePageChange(pageSquadre: number): void {
        const options = {
            page: {
                pageSquadre,
            }
        };
        this.store.dispatch(new GetListeComposizioneAvanzata(options));
    }

    // Interazione con Mappa
    mezzoCoordinate(obj: MezzoDirection): void {
        if (obj.coordinateMezzo && this.richiesta.localita.coordinate) {
            if (this.idMezziPrenotati.indexOf(obj.idMezzo) <= -1) {
                const direction: DirectionInterface = {
                    origin: {
                        lat: obj.coordinateMezzo.latitudine,
                        lng: obj.coordinateMezzo.longitudine
                    },
                    destination: {
                        lat: this.richiesta.localita.coordinate.latitudine,
                        lng: this.richiesta.localita.coordinate.longitudine
                    },
                    isVisible: true
                };

                this.sendDirection.emit(direction);
            }
        } else {
            this.onClearDirection();
            console.error('coordinate mezzo / coordinate richiesta non presenti');
        }
    }
}
