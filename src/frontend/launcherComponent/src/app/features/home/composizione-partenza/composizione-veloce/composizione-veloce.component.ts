import { Component, Input, EventEmitter, Output, OnInit, OnDestroy, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { BoxPartenzaPreAccoppiati } from '../interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { DirectionInterface } from '../../../maps/maps-interface/direction.interface';
import { Composizione } from '../../../../shared/enum/composizione.enum';
import { Store } from '@ngxs/store';
import { ConfirmPartenze, SetVisualizzaPercosiRichiesta } from '../../store/actions/composizione-partenza/composizione-partenza.actions';
import {
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
import { GetFiltriComposizione } from '../../../../shared/store/actions/filtri-composizione/filtri-composizione.actions';
import { ResetPaginationPreaccoppiati } from '../../../../shared/store/actions/pagination-composizione-partenza/pagination-composizione-partenza.actions';
import { TriageSummary } from '../../../../shared/interface/triage-summary.interface';
import { NecessitaSoccorsoAereoEnum } from '../../../../shared/enum/necessita-soccorso-aereo.enum';
import { getSoccorsoAereoTriage } from '../../../../shared/helper/function-triage';
import { Partenza } from '../../../../shared/model/partenza.model';
import { SquadraComposizione } from '../../../../shared/interface/squadra-composizione-interface';

@Component({
    selector: 'app-composizione-veloce',
    templateUrl: './composizione-veloce.component.html',
    styleUrls: ['./composizione-veloce.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FasterComponent implements OnInit, OnChanges, OnDestroy {

    // Percorsi richiesta
    @Input() visualizzaPercorsiRichiesta: boolean;

    @Input() filtri: any;

    // Loading Liste Mezzi e Squadre
    @Input() loadingListe: boolean;
    @Input() loadingSquadre: boolean;
    @Input() loadingMezzi: boolean;

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

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        this.store.dispatch(new GetFiltriComposizione());
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.richiesta?.currentValue) {
            const richiesta = changes?.richiesta?.currentValue;
            this.partenzeRichiesta = richiesta.partenze;
        }
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearPreAccoppiatiSelezionatiComposizione(),
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
        if (preAcc && preAcc.statoMezzo === 'In Sede') {
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
