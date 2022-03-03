import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { MezzoComposizione } from '../../../../shared/interface/mezzo-composizione-interface';
import { DirectionInterface } from '../../../maps/maps-interface/direction.interface';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { Composizione } from '../../../../shared/enum/composizione.enum';
import { Store } from '@ngxs/store';
import { makeCopy } from '../../../../shared/helper/function-generiche';
import { ComposizionePartenzaState } from '../../store/states/composizione-partenza/composizione-partenza.state';
import {
    ClearListaMezziComposizione,
    ClearSelectedMezziComposizione,
    HoverInMezzoComposizione,
    HoverOutMezzoComposizione,
    ReducerSelectMezzoComposizione,
    ReducerSelectMezzoComposizioneInRientro,
    ReducerSelectMezzoComposizionePreAccoppiati,
    UnselectMezzoComposizione
} from '../../../../shared/store/actions/mezzi-composizione/mezzi-composizione.actions';
import { BoxPartenzaState } from '../../store/states/composizione-partenza/box-partenza.state';
import { BoxPartenza } from '../interface/box-partenza-interface';
import { AddBoxPartenza, ClearBoxPartenze, DeselectBoxPartenza, RemoveBoxPartenza, RemoveMezzoBoxPartenzaSelezionato, RemoveSquadraBoxPartenza, RequestAddBoxPartenza } from '../../store/actions/composizione-partenza/box-partenza.actions';
import {
    ClearListaSquadreComposizione,
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
import { ConfirmPartenze, SetVisualizzaPercosiRichiesta } from '../../store/actions/composizione-partenza/composizione-partenza.actions';
import { TurnoState } from '../../../navbar/store/states/turno.state';
import { SganciamentoInterface } from 'src/app/shared/interface/sganciamento.interface';
import { MezzoDirection } from '../../../../shared/interface/mezzo-direction';
import { ConfermaPartenze } from '../interface/conferma-partenze-interface';
import { StatoMezzo } from '../../../../shared/enum/stato-mezzo.enum';
import { GetFiltriComposizione } from '../../../../shared/store/actions/filtri-composizione/filtri-composizione.actions';
import { GetListeComposizioneAvanzata, UnselectMezziAndSquadreComposizioneAvanzata } from '../../store/actions/composizione-partenza/composizione-avanzata.actions';
import { ResetPaginationComposizionePartenza } from '../../../../shared/store/actions/pagination-composizione-partenza/pagination-composizione-partenza.actions';
import { SetRicercaMezziComposizione, SetRicercaSquadreComposizione } from '../../../../shared/store/actions/ricerca-composizione/ricerca-composizione.actions';
import { TriageSummary } from '../../../../shared/interface/triage-summary.interface';
import { NecessitaSoccorsoAereoEnum } from '../../../../shared/enum/necessita-soccorso-aereo.enum';
import { getSoccorsoAereoTriage } from '../../../../shared/helper/function-triage';
import { Partenza } from '../../../../shared/model/partenza.model';
import { SquadraComposizione } from '../../../../shared/interface/squadra-composizione-interface';
import { TravelModeService } from '../../../maps/map-service/travel-mode.service';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import RouteTask from '@arcgis/core/tasks/RouteTask';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';

@Component({
    selector: 'app-composizione-avanzata',
    templateUrl: './composizione-avanzata.component.html',
    styleUrls: ['./composizione-avanzata.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComposizioneAvanzataComponent implements OnInit, OnChanges, OnDestroy {

    // Percorsi richiesta
    @Input() visualizzaPercorsiRichiesta: boolean;

    // Mezzi Composizione
    @Input() mezziComposizione: MezzoComposizione[];
    @Input() idMezzoSelezionato: string;
    @Input() idMezziInPrenotazione: string[];
    @Input() idMezziPrenotati: string[];
    @Input() idMezziBloccati: string[];
    @Input() idMezzoHover: string;

    // Squadre Composizione
    @Input() squadreComposizione: SquadraComposizione[];
    @Input() idSquadreSelezionate: Array<string>;
    @Input() idSquadraHover: string;

    // Filtri Composizione
    @Input() filtriSelezionati: any;
    @Input() filtri: any;

    // BoxPartenza Composizione
    @Input() boxPartenzaList: BoxPartenza[];
    @Input() idBoxPartenzaSelezionato: string;

    // Loading Liste Mezzi e Squadre
    @Input() loadingSquadre: boolean;
    @Input() loadingMezzi: boolean;

    // Paginazione Mezzi
    @Input() currentPageMezzi: number;
    @Input() totalItemsMezzi: number;
    @Input() pageSizeMezzi: number;

    // Paginazione Squadre
    @Input() currentPageSquadre: number;
    @Input() totalItemsSquadre: number;
    @Input() pageSizeSquadre: number;

    // Bottoni Composizione
    @Input() disableNuovaPartenza: boolean;
    @Input() disableConfirmPartenza: boolean;

    @Input() richiesta: SintesiRichiesta;
    @Input() loadingInvioPartenza: boolean;
    @Input() boxAttivi: boolean;
    @Input() triageSummary: TriageSummary[];
    @Input() nightMode: boolean;

    @Output() centraMappa = new EventEmitter();
    @Output() sendDirection = new EventEmitter<DirectionInterface>();
    @Output() clearDirection = new EventEmitter();
    @Output() sganciamento = new EventEmitter<SganciamentoInterface>();
    @Output() changeRicercaSquadre = new EventEmitter<string>();
    @Output() changeRicercaMezzi = new EventEmitter<string>();

    statoMezzo = StatoMezzo;
    Composizione = Composizione;

    partenzeRichiesta: Partenza[];

    ricercaSquadre: string;
    ricercaMezzi: string;

    constructor(private popoverConfig: NgbPopoverConfig,
                private tooltipConfig: NgbTooltipConfig,
                private travelModeService: TravelModeService,
                private cdRef: ChangeDetectorRef,
                private store: Store) {
        // Popover options
        this.popoverConfig.container = 'body';
        this.popoverConfig.placement = 'top';
        // Tooltip options
        this.tooltipConfig.container = 'body';
        this.tooltipConfig.placement = 'top';
    }

    ngOnInit(): void {
        console.log('Componente ComposizioneAvanzata creato');
        this.store.dispatch(new GetFiltriComposizione());
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.richiesta?.currentValue) {
            const richiesta = changes?.richiesta?.currentValue;
            this.partenzeRichiesta = richiesta.partenzeRichiesta;
        }

        if (changes?.mezziComposizione?.currentValue) {
            this.mezziComposizione = makeCopy(changes.mezziComposizione.currentValue);
            this.mezziComposizione?.forEach((m: MezzoComposizione) => {
                if (!m.km || !m.tempoPercorrenza) {
                    const pointPartenza = new Point({
                        longitude: +m.mezzo.coordinateStrg[1],
                        latitude: +m.mezzo.coordinateStrg[0],
                        spatialReference: {
                            wkid: 3857
                        }
                    });

                    const pointDestinazione = new Point({
                        longitude: this.richiesta.localita.coordinate.longitudine,
                        latitude: this.richiesta.localita.coordinate.latitudine,
                        spatialReference: {
                            wkid: 3857
                        }
                    });

                    const pointPartenzaGraphic = new Graphic({
                        geometry: pointPartenza
                    });

                    const pointDestinazioneGraphic = new Graphic({
                        geometry: pointDestinazione
                    });
                    const routeTask: RouteTask = new RouteTask({
                        url: 'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World',
                    });

                    const routeParams = new RouteParameters({
                        stops: new FeatureSet({
                            features: [pointPartenzaGraphic, pointDestinazioneGraphic]
                        }),
                        travelMode: this.travelModeService.getTravelModeByGenereMezzo(m.mezzo.genere)
                    });

                    routeTask.solve(routeParams).then((data: any) => {
                        if (!m.km || m.km === '0') {
                            const km = data.routeResults[0]?.route?.attributes?.Total_Kilometers;
                            m.km = km.toFixed(2);
                        }
                        if (!m.tempoPercorrenza) {
                            const tempoPercorrenza = data.routeResults[0]?.route?.attributes?.Total_TravelTime ? data.routeResults[0].route.attributes.Total_TravelTime : data.routeResults[0]?.route?.attributes?.Total_TruckTravelTime;
                            m.tempoPercorrenza = tempoPercorrenza.toFixed(2);
                        }
                        this.cdRef.detectChanges();
                    });
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearBoxPartenze(),
            new ClearSelectedSquadreComposizione(),
            new ClearSelectedMezziComposizione(),
            new ResetPaginationComposizionePartenza(),
            new SetRicercaMezziComposizione(undefined),
            new SetRicercaSquadreComposizione(undefined),
            new ClearListaMezziComposizione(),
            new ClearListaSquadreComposizione(),
            new UnselectMezziAndSquadreComposizioneAvanzata()
        ]);
        console.log('Componente ComposizioneAvanzata distrutto');
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
            const id = box.squadreComposizione[0].codice;
            let inputVec = [];
            inputVec = this.boxPartenzaList.slice().reverse();
            const vec: BoxPartenza[] = inputVec.filter(x => x.squadreComposizione && x.squadreComposizione.length === 1 && x.squadreComposizione[0].id === id);
            return vec && vec.length > 1 && vec.reverse().findIndex(x => x === box) === 0;
        } else {
            return false;
        }
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

    getSoccorsoAereoTriage(triageSummary: TriageSummary[]): { desc: NecessitaSoccorsoAereoEnum | string, value: number } {
        return getSoccorsoAereoTriage(triageSummary);
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
        this.store.dispatch(new RemoveSquadraBoxPartenza(squadraComposizione.codice));
    }

    squadraDeselezionataInRientro(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch(new UnselectSquadraComposizioneInRientro(squadraComposizione));
        this.store.dispatch(new RemoveSquadraBoxPartenza(squadraComposizione.codice));
    }

    squadraDeselezionataPreAccoppiati(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch(new UnselectSquadraComposizionePreAccoppiati(squadraComposizione));
        this.store.dispatch(new RemoveSquadraBoxPartenza(squadraComposizione.codice));
    }

    squadraHoverIn(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch(new HoverInSquadraComposizione(squadraComposizione.codice));
    }

    squadraHoverOut(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch(new HoverOutSquadraComposizione(squadraComposizione.codice));
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

    onToggleVisualizzaPercorsi(value: boolean): void {
        // TODO: logica viualizzazione percorsi con bottone
        this.store.dispatch(new SetVisualizzaPercosiRichiesta(value));
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
        if (this.boxPartenzaList?.length === 1) {
            this.store.dispatch(new GetListeComposizioneAvanzata());
        }
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
                if (obj.mezzoComposizione.mezzo && obj.mezzoComposizione.mezzo.stato) {
                    obj.mezzoComposizione.mezzo.stato = StatoMezzo.InViaggio;
                } else {
                    obj.mezzoComposizione.stato = StatoMezzo.InViaggio;
                }
                rObj.mezzo = obj.mezzoComposizione.mezzo ? obj.mezzoComposizione.mezzo : obj.mezzoComposizione;
            } else {
                rObj.mezzo = null;
            }
            if (obj.squadreComposizione.length > 0) {
                rObj.squadre = obj.squadreComposizione.map((squadraComp: SquadraComposizione) => {
                    return squadraComp;
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
            const direction: DirectionInterface = {
                origin: {
                    lat: obj.coordinateMezzo.latitudine,
                    lng: obj.coordinateMezzo.longitudine
                },
                destination: {
                    lat: this.richiesta.localita.coordinate.latitudine,
                    lng: this.richiesta.localita.coordinate.longitudine
                },
                genereMezzo: obj.genereMezzo,
                isVisible: true
            };

            this.sendDirection.emit(direction);
        } else {
            this.onClearDirection();
            console.error('coordinate mezzo / coordinate richiesta non presenti');
        }
    }

    mezzoCoordinateClear(): void {
        this.onClearDirection();
    }
}
