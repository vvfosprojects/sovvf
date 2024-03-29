import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { BoxPartenzaPreAccoppiati } from '../interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { DirectionInterface } from '../../../maps/maps-interface/direction.interface';
import { Composizione } from '../../../../shared/enum/composizione.enum';
import { Store } from '@ngxs/store';
import { ConfirmPartenze, SetVisualizzaPercosiRichiesta } from '../../store/actions/composizione-partenza/composizione-partenza.actions';
import {
    ClearPreaccoppiati,
    ClearPreAccoppiatiSelezionatiComposizione,
    GetListaComposizioneVeloce,
    HoverInPreAccoppiatoComposizione,
    HoverOutPreAccoppiatoComposizione,
    SelectPreAccoppiatoComposizione,
    UnselectPreAccoppiatoComposizione
} from '../../store/actions/composizione-partenza/composizione-veloce.actions';
import { makeCopy } from '../../../../shared/helper/function-generiche';
import { ConfermaPartenze } from '../interface/conferma-partenze-interface';
import { ComposizionePartenzaState } from '../../store/states/composizione-partenza/composizione-partenza.state';
import { TurnoState } from '../../../navbar/store/states/turno.state';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { BoxPartenzaHover } from '../interface/composizione/box-partenza-hover-interface';
import { StatoMezzo } from '../../../../shared/enum/stato-mezzo.enum';
import { ResetPaginationPreaccoppiati } from '../../../../shared/store/actions/pagination-composizione-partenza/pagination-composizione-partenza.actions';
import { TriageSummary } from '../../../../shared/interface/triage-summary.interface';
import { NecessitaSoccorsoAereoEnum } from '../../../../shared/enum/necessita-soccorso-aereo.enum';
import { getSoccorsoAereoTriage } from '../../../../shared/helper/function-triage';
import { Partenza } from '../../../../shared/model/partenza.model';
import { SquadraComposizione } from '../../../../shared/interface/squadra-composizione-interface';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import RouteTask from '@arcgis/core/tasks/RouteTask';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import { TravelModeService } from '../../../maps/map-service/travel-mode.service';
import { DeleteConcorrenza } from '../../../../shared/store/actions/concorrenza/concorrenza.actions';
import { TipoConcorrenzaEnum } from '../../../../shared/enum/tipo-concorrenza.enum';

@Component({
    selector: 'app-composizione-veloce',
    templateUrl: './composizione-veloce.component.html',
    styleUrls: ['./composizione-veloce.component.css']
})
export class FasterComponent implements OnChanges, OnDestroy {

    // Percorsi richiesta
    @Input() visualizzaPercorsiRichiesta: boolean;

    @Input() filtri: any;

    // Loading Lista Preaccoppiati
    @Input() loadingPreaccoppiati: boolean;

    @Input() richiesta: SintesiRichiesta;
    @Input() loadingInvioPartenza: boolean;
    @Input() boxAttivi: boolean;
    @Input() nightMode: boolean;
    @Input() triageSummary: TriageSummary[];

    @Input() preAccoppiati: BoxPartenzaPreAccoppiati[];
    @Input() idPreAccoppiatoSelezionato: string;
    @Input() idPreAccoppiatiSelezionati: string[];
    @Input() idPreAccoppiatiOccupati: string[];
    @Input() idPreaccoppiatoHover: string;

    // Paginazione
    @Input() currentPagePreaccoppiati: number;
    @Input() totalItemsPreaccoppiati: number;
    @Input() pageSizePreaccoppiati: number;

    @Output() sendDirection: EventEmitter<DirectionInterface> = new EventEmitter();
    @Output() clearDirection: EventEmitter<any> = new EventEmitter();
    @Output() centraMappa = new EventEmitter();

    Composizione = Composizione;

    partenzeRichiesta: Partenza[];

    constructor(private store: Store,
                private travelModeService: TravelModeService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.richiesta?.currentValue) {
            const richiesta = changes?.richiesta?.currentValue;
            this.partenzeRichiesta = richiesta.partenze;
        }

        if (changes?.preAccoppiati?.currentValue) {
            this.preAccoppiati = makeCopy(changes.preAccoppiati.currentValue);
            this.preAccoppiati?.forEach((p: BoxPartenzaPreAccoppiati) => {
                if (!p.km || !p.tempoPercorrenza) {
                    const pointPartenza = new Point({
                        longitude: +p.coordinate.longitudine,
                        latitude: +p.coordinate.latitudine,
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
                        travelMode: this.travelModeService.getTravelModeByGenereMezzo(p.genereMezzo)
                    });

                    routeTask.solve(routeParams).then((data: any) => {
                        if (!p.km || p.km === '0') {
                            const km = data.routeResults[0]?.route?.attributes?.Total_Kilometers;
                            p.km = km.toFixed(2);
                        }
                        if (!p.tempoPercorrenza) {
                            const tempoPercorrenza = data.routeResults[0]?.route?.attributes?.Total_TravelTime ? data.routeResults[0].route.attributes.Total_TravelTime : data.routeResults[0]?.route?.attributes?.Total_TruckTravelTime;
                            p.tempoPercorrenza = tempoPercorrenza.toFixed(2);
                        }
                    });
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.preAccoppiati?.forEach((p: BoxPartenzaPreAccoppiati) => {
            if (this.idPreAccoppiatiSelezionati.includes(p.id)) {
                console.log('remove mezzo', p.codiceMezzo);
                this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Mezzo, [p.codiceMezzo]));
                const idSquadre = p.squadre.map((sC: SquadraComposizione) => sC.idSquadra);
                this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Squadra, idSquadre));
            }
        });
        this.store.dispatch([
            new ClearPreAccoppiatiSelezionatiComposizione(),
            new ClearPreaccoppiati(),
            new ResetPaginationPreaccoppiati()
        ]);
    }

    getSoccorsoAereoTriage(triageSummary: TriageSummary[]): { desc: NecessitaSoccorsoAereoEnum | string, value: number } {
        return getSoccorsoAereoTriage(triageSummary);
    }

    onToggleVisualizzaPercorsi(value: boolean): void {
        this.store.dispatch(new SetVisualizzaPercosiRichiesta(value));
    }

    selezionaPreaccoppiato(preAcc: BoxPartenzaPreAccoppiati): void {
        this.mezzoCoordinate(preAcc.coordinate);
        if (preAcc?.statoMezzo === StatoMezzo.InSede) {
            this.store.dispatch(new SelectPreAccoppiatoComposizione(preAcc));
        }
    }

    deselezionaPreaccoppiato(preAcc: BoxPartenzaPreAccoppiati): void {
        this.onClearDirection();
        this.store.dispatch(new UnselectPreAccoppiatoComposizione(preAcc));
    }

    mezzoCoordinate(event: Coordinate): void {
        if (this.richiesta) {
            if (event && this.richiesta.localita.coordinate) {
                const direction: DirectionInterface = {
                    origin: {
                        lat: event.latitudine,
                        lng: event.longitudine
                    },
                    destination: {
                        lat: this.richiesta.localita.coordinate.latitudine,
                        lng: this.richiesta.localita.coordinate.longitudine
                    },
                    isVisible: true
                };

                this.sendDirection.emit(direction);
            } else {
                console.error('coordinate mezzo / coordinate richiesta non presenti');
                this.onClearDirection();
            }
        }
    }

    confermaPartenzeInViaggio(): void {
        const boxPartenzaList: BoxPartenzaPreAccoppiati[] = [];
        this.preAccoppiati.forEach(result => {
            if (this.idPreAccoppiatiSelezionati.includes(result.id)) {
                boxPartenzaList.push(result);
            }
        });
        const partenze = makeCopy(boxPartenzaList);
        const partenzeMappedArray = partenze.map((obj: BoxPartenzaPreAccoppiati) => {
            const rObj = {
                mezzo: {
                    codice: null,
                    descrizione: null,
                    stato: null,
                    genere: null,
                    distaccamento: {
                        descrizione: null,
                    },
                    appartenenza: null
                },
                squadre: null
            };
            if (obj.codiceMezzo) {
                obj.statoMezzo = StatoMezzo.InViaggio;
                rObj.mezzo.codice = obj.codiceMezzo;
                rObj.mezzo.descrizione = obj.descrizioneMezzo;
                rObj.mezzo.stato = obj.statoMezzo;
                rObj.mezzo.genere = obj.genereMezzo;
                rObj.mezzo.distaccamento.descrizione = obj.distaccamento;
                rObj.mezzo.appartenenza = obj.appartenenza;
            } else {
                rObj.mezzo = null;
            }
            if (obj.squadre.length > 0) {
                rObj.squadre = obj.squadre.map((squadraComp: SquadraComposizione) => {
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
        this.store.dispatch(new ConfirmPartenze(partenzeObj));
    }

    onClearDirection(): void {
        this.clearDirection.emit();
        this.centraMappa.emit();
    }

    onHoverIn(id: BoxPartenzaHover): void {
        this.store.dispatch(new HoverInPreAccoppiatoComposizione(id));
    }

    onHoverOut(): void {
        this.store.dispatch(new HoverOutPreAccoppiatoComposizione());
    }

    preAccoppiatiPageChange(pagePreaccoppiati: number): void {
        const options = {
            page: pagePreaccoppiati
        };
        this.store.dispatch(new GetListaComposizioneVeloce(options));
    }
}
