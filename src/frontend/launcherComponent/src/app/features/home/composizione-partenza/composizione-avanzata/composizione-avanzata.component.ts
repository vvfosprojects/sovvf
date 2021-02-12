import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { MezzoComposizione } from '../../../../shared/interface/mezzo-composizione-interface';
import { SquadraComposizione } from '../../../../shared/interface/squadra-composizione-interface';
import { DirectionInterface } from '../../maps/maps-interface/direction-interface';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { Composizione } from '../../../../shared/enum/composizione.enum';
import { Select, Store } from '@ngxs/store';
import { makeCopy } from '../../../../shared/helper/function';
import { ComposizionePartenzaState } from '../../store/states/composizione-partenza/composizione-partenza.state';
import { MezziComposizioneState } from '../../../../shared/store/states/mezzi-composizione/mezzi-composizione.state';
import { SquadreComposizioneState } from '../../../../shared/store/states/squadre-composizione/squadre-composizione.state';
import {
    HoverInMezzoComposizione,
    HoverOutMezzoComposizione,
    RequestRemoveBookMezzoComposizione,
    UnselectMezzoComposizione,
    ReducerSelectMezzoComposizione
} from '../../../../shared/store/actions/mezzi-composizione/mezzi-composizione.actions';
import { BoxPartenzaState } from '../../store/states/composizione-partenza/box-partenza.state';
import { BoxPartenza } from '../interface/box-partenza-interface';
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
  ClearSquadraComposizione,
  HoverInSquadraComposizione,
  HoverOutSquadraComposizione,
  SelectSquadraComposizione,
  UnselectSquadraComposizione
} from '../../../../shared/store/actions/squadre-composizione/squadre-composizione.actions';
import { ConfirmPartenze} from '../../store/actions/composizione-partenza/composizione-partenza.actions';
import { TurnoState } from '../../../navbar/store/states/turno.state';
import { SganciamentoInterface } from 'src/app/shared/interface/sganciamento.interface';
import { MezzoDirection } from '../../../../shared/interface/mezzo-direction';
import { ConfermaPartenze } from '../interface/conferma-partenze-interface';
import { StatoMezzo } from '../../../../shared/enum/stato-mezzo.enum';
import { FiltriComposizioneState } from '../../../../shared/store/states/filtri-composizione/filtri-composizione.state';
import { GetFiltriComposizione } from '../../../../shared/store/actions/filtri-composizione/filtri-composizione.actions';
import { PaginationComposizionePartenzaState } from 'src/app/shared/store/states/pagination-composizione-partenza/pagination-composizione-partenza.state';
import { GetListeComposizioneAvanzata } from '../../store/actions/composizione-partenza/composizione-avanzata.actions';
import { ResetPaginationComposizionePartenza } from '../../../../shared/store/actions/pagination-composizione-partenza/pagination-composizione-partenza.actions';
import {ImpostazioniState} from '../../../../shared/store/states/impostazioni/impostazioni.state';

@Component({
    selector: 'app-composizione-avanzata',
    templateUrl: './composizione-avanzata.component.html',
    styleUrls: ['./composizione-avanzata.component.css']
})
export class ComposizioneAvanzataComponent implements OnInit, OnDestroy {

    @Input() richiesta: SintesiRichiesta;
    @Input() loadingInvioPartenza: boolean;
    @Input() boxAttivi: boolean;

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

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    sunMode: boolean;

    Composizione = Composizione;
    subscription = new Subscription();

    @Output() centraMappa = new EventEmitter();
    @Output() sendDirection = new EventEmitter<DirectionInterface>();
    @Output() clearDirection = new EventEmitter();
    @Output() sganciamento = new EventEmitter<SganciamentoInterface>();
    @Output() changeRicercaSquadre = new EventEmitter<string>();
    @Output() changeRicercaMezzi = new EventEmitter<string>();

    statoMezzo = StatoMezzo;

    ricercaSquadre: string;
    ricercaMezzi: string;

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
                this.squadreComposizione = makeCopy(squadreComp);
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
        this.getSunMode();
    }

    ngOnInit(): void {
        this.store.dispatch(new GetFiltriComposizione());
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearBoxPartenze(),
            new ResetPaginationComposizionePartenza()
        ]);
        this.subscription.unsubscribe();
    }

    mezzoSelezionato(mezzoComposizione: MezzoComposizione): void {
        this.store.dispatch([
            new ReducerSelectMezzoComposizione(mezzoComposizione),
        ]);
    }

    getSunMode(): void {
      this.subscription.add(
        this.nightMode$.subscribe((nightMode: boolean) => {
          this.sunMode = !nightMode;
        })
      );
    }

    sunModeText(): string {
      let value = '';
      if (this.sunMode) {
        value = 'text-dark';
      } else if (!this.sunMode) {
        value = 'text-white';
      }
      return value;
    }

    mezzoDeselezionato(mezzoComposizione: MezzoComposizione): void {
        this.store.dispatch(new UnselectMezzoComposizione());
        this.store.dispatch(new RemoveMezzoBoxPartenzaSelezionato());
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

    squadraDeselezionata(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch(new UnselectSquadraComposizione(squadraComposizione));
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

    checkSquadraSelezione(idSquadra: string): boolean {
        let squadraSelezionata = false;
        this.idSquadreSelezionate.forEach((id: string) => {
            if (id === idSquadra) {
                squadraSelezionata = true;
            }
        });
        return squadraSelezionata;
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

    eliminaBoxPartenza(boxPartenza: BoxPartenza): void {
        if (boxPartenza.mezzoComposizione && boxPartenza.mezzoComposizione.istanteScadenzaSelezione) {
            const mezzoComp = boxPartenza.mezzoComposizione;
            this.store.dispatch(new RequestRemoveBookMezzoComposizione(mezzoComp, boxPartenza));
        } else {
            this.store.dispatch(new RemoveBoxPartenza(boxPartenza));
        }
        this.onClearDirection();
    }

    dopoAggiungiBoxPartenza(): void {
        this.boxPartenzaList.forEach(boxPartenza => {
            if (boxPartenza.mezzoComposizione) {
                // const mezzoComp = boxPartenza.mezzoComposizione;
                this.store.dispatch(new DeselectBoxPartenza(boxPartenza));
            }
            this.onClearDirection();
        });
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
}
