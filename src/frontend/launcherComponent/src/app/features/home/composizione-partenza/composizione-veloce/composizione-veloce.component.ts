import { Component, Input, EventEmitter, Output, OnInit, OnDestroy, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { BoxPartenza } from '../interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { DirectionInterface } from '../../maps/maps-interface/direction-interface';
import { Composizione } from '../../../../shared/enum/composizione.enum';
import { Store } from '@ngxs/store';
import { ConfirmPartenze } from '../../store/actions/composizione-partenza/composizione-partenza.actions';
import {
    ClearPreAccoppiatiSelezionatiComposizione,
    GetListaComposizioneVeloce,
    HoverInPreAccoppiatoComposizione,
    HoverOutPreAccoppiatoComposizione,
    SelectPreAccoppiatoComposizione,
    UnselectPreAccoppiatoComposizione
} from '../../store/actions/composizione-partenza/composizione-veloce.actions';
import { makeCopy } from '../../../../shared/helper/function-generiche';
import { SquadraComposizione } from '../../../../shared/interface/squadra-composizione-interface';
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

@Component({
    selector: 'app-composizione-veloce',
    templateUrl: './composizione-veloce.component.html',
    styleUrls: ['./composizione-veloce.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FasterComponent implements OnInit, OnChanges, OnDestroy {

    @Input() richiesta: SintesiRichiesta;
    @Input() loadingInvioPartenza: boolean;
    @Input() boxAttivi: boolean;
    @Input() nightMode: boolean;
    @Input() triageSummary: TriageSummary[];

    @Input() preAccoppiati: BoxPartenza[];
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
            this.partenzeRichiesta = richiesta.partenzeRichiesta;
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

    selezionaPreaccoppiato(preAcc: BoxPartenza): void {
        if (!preAcc.mezzoComposizione.mezzo.coordinateFake) {
            this.mezzoCoordinate(preAcc.mezzoComposizione.mezzo.coordinate);
        }
        if (preAcc && preAcc.mezzoComposizione && preAcc.mezzoComposizione.mezzo && preAcc.mezzoComposizione.mezzo.stato === 'In Sede') {
            this.store.dispatch(new SelectPreAccoppiatoComposizione(preAcc));
        }
    }

    deselezionaPreaccoppiato(preAcc: BoxPartenza): void {
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
        const boxPartenzaList: BoxPartenza[] = [];
        this.preAccoppiati.forEach(result => {
            if (this.idPreAccoppiatiSelezionati.includes(result.id)) {
                boxPartenzaList.push(result);
            }
        });
        const partenze = makeCopy(boxPartenzaList);
        const partenzeMappedArray = partenze.map((obj: BoxPartenza) => {
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
        // console.log('mappedArray', partenzeMappedArray);
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
