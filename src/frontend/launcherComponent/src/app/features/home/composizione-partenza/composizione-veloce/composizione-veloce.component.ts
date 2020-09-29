import { Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { BoxPartenza } from '../interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { Observable, Subscription } from 'rxjs';
import { DirectionInterface } from '../../maps/maps-interface/direction-interface';
import { Composizione } from '../../../../shared/enum/composizione.enum';
import { Select, Store } from '@ngxs/store';
import { ConfirmPartenze } from '../../store/actions/composizione-partenza/composizione-partenza.actions';
import { ComposizioneVeloceState } from '../../store/states/composizione-partenza/composizione-veloce.state';
import {
    HoverInPreAccoppiatoComposizione,
    HoverOutPreAccoppiatoComposizione,
    SelectPreAccoppiatoComposizione,
    UnselectPreAccoppiatoComposizione
} from '../../store/actions/composizione-partenza/composizione-veloce.actions';
import { makeCopy } from '../../../../shared/helper/function';
import { SquadraComposizione } from '../../../../shared/interface/squadra-composizione-interface';
import { ConfermaPartenze } from '../interface/conferma-partenze-interface';
import { ComposizionePartenzaState } from '../../store/states/composizione-partenza/composizione-partenza.state';
import { TurnoState } from '../../../navbar/store/states/turno.state';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { BoxPartenzaHover } from '../interface/composizione/box-partenza-hover-interface';
import { StatoMezzo } from '../../../../shared/enum/stato-mezzo.enum';
import { GetFiltriComposizione } from '../../../../shared/store/actions/filtri-composizione/filtri-composizione.actions';

@Component({
    selector: 'app-composizione-veloce',
    templateUrl: './composizione-veloce.component.html',
    styleUrls: ['./composizione-veloce.component.css']
})
export class FasterComponent implements OnInit, OnDestroy {

    @Input() richiesta: SintesiRichiesta;
    @Input() disablePrenota: boolean;
    @Input() prenotato: boolean;
    @Input() loadingInvioPartenza: boolean;
    @Input() boxAttivi: boolean;

    @Select(ComposizioneVeloceState.preAccoppiati) preAccoppiati$: Observable<BoxPartenza[]>;
    preAccoppiati: BoxPartenza[];

    @Select(ComposizioneVeloceState.idPreAccoppiatoSelezionato) idPreAccoppiatoSelezionato$: Observable<string>;
    idPreAccoppiatoSelezionato: string;

    @Select(ComposizioneVeloceState.idPreAccoppiatiSelezionati) idPreAccoppiatiSelezionati$: Observable<string[]>;
    idPreAccoppiatiSelezionati: string[];

    @Select(ComposizioneVeloceState.idPreAccoppiatiOccupati) idPreAccoppiatiOccupati$: Observable<string[]>;
    idPreAccoppiatiOccupati: string[];

    @Select(ComposizioneVeloceState.idPreAccoppiatoHover) idPreaccoppiatoHover$: Observable<string>;
    idPreaccoppiatoHover: string;

    Composizione = Composizione;

    subscription = new Subscription();

    @Output() sendDirection: EventEmitter<DirectionInterface> = new EventEmitter();
    @Output() clearDirection: EventEmitter<any> = new EventEmitter();
    @Output() centraMappa = new EventEmitter();
    @Output() prenota = new EventEmitter<boolean>();

    constructor(private store: Store) {
        // Prendo i preaccoppiati da visualizzare nella lista
        this.subscription.add(
            this.preAccoppiati$.subscribe((preAcc: BoxPartenza[]) => {
                this.preAccoppiati = preAcc;
                console.log('preAccoppiati', this.preAccoppiati);
            })
        );
        // Prendo gli id dei preAccoppiati selezionati
        this.subscription.add(
            this.idPreAccoppiatiSelezionati$.subscribe((idPreAccoppiatiSelezionati: string[]) => {
                this.idPreAccoppiatiSelezionati = idPreAccoppiatiSelezionati;
                // console.log(this.idPreAccoppiatiSelezionati);
            })
        );
        // Prendo l'id del preAccoppiato selezionato
        this.subscription.add(
            this.idPreAccoppiatoSelezionato$.subscribe((idPreAccoppiatoSelezionato: string) => {
                this.idPreAccoppiatoSelezionato = idPreAccoppiatoSelezionato;
                // console.log(this.idPreAccoppiatoSelezionato);
            })
        );
        this.subscription.add(
            this.idPreaccoppiatoHover$.subscribe((idPreAccoppiatoHover: string) => {
                this.idPreaccoppiatoHover = idPreAccoppiatoHover;
            })
        );
        this.subscription.add(
            this.idPreAccoppiatiOccupati$.subscribe((idPreAccoppiatiOccupati: string[]) => {
                this.idPreAccoppiatiOccupati = idPreAccoppiatiOccupati;
            })
        );
    }

    ngOnInit() {
        this.store.dispatch(new GetFiltriComposizione());
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    selezionaPreaccoppiato(preAcc: BoxPartenza) {
        !preAcc.mezzoComposizione.mezzo.coordinateFake && this.mezzoCoordinate(preAcc.mezzoComposizione.mezzo.coordinate);
        this.store.dispatch(new SelectPreAccoppiatoComposizione(preAcc));
    }

    deselezionaPreaccoppiato(preAcc: BoxPartenza) {
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
        const partenzeMappedArray = partenze.map(obj => {
            const rObj = {};
            if (obj.mezzoComposizione) {
                obj.mezzoComposizione.mezzo.stato = StatoMezzo.InViaggio;
                rObj['mezzo'] = obj.mezzoComposizione.mezzo;
            } else {
                rObj['mezzo'] = null;
            }
            if (obj.squadraComposizione.length > 0) {
                rObj['squadre'] = obj.squadraComposizione.map((squadraComp: SquadraComposizione) => {
                    return squadraComp.squadra;
                });
            } else {
                rObj['squadre'] = [];
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

    confermaPartenzeInUscita(): void {
        const boxPartenzaList: BoxPartenza[] = [];
        this.preAccoppiati.forEach(result => {
            if (this.idPreAccoppiatiSelezionati.includes(result.id)) {
                boxPartenzaList.push(result);
            }
        });
        const partenze = makeCopy(boxPartenzaList);
        const partenzeMappedArray = partenze.map(obj => {
            const rObj = {};
            if (obj.mezzoComposizione) {
                obj.mezzoComposizione.mezzo.stato = StatoMezzo.InUscita;
                rObj['mezzo'] = obj.mezzoComposizione.mezzo;
            } else {
                rObj['mezzo'] = null;
            }
            if (obj.squadraComposizione.length > 0) {
                rObj['squadre'] = obj.squadraComposizione.map((squadraComp: SquadraComposizione) => {
                    return squadraComp.squadra;
                });
            } else {
                rObj['squadre'] = [];
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

}
