import { Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';

// Model
import { BoxPartenza } from '../interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Service
import { Observable, Subscription } from 'rxjs';
import { DirectionInterface } from '../../maps/maps-interface/direction-interface';
import { Composizione } from '../../../../shared/enum/composizione.enum';
import { Select, Store } from '@ngxs/store';
import { ConfirmPartenze, GetFiltriComposizione } from '../../store/actions/composizione-partenza/composizione-partenza.actions';
import { ComposizioneVeloceState } from '../../store/states/composizione-partenza/composizione-veloce.state';
import { makeCopy } from '../../../../shared/helper/function';
import { SelectPreAccoppiatoComposizione, UnselectPreAccoppiatoComposizione } from '../../store/actions/composizione-partenza/composizione-veloce.actions';
import { ComposizionePartenzaState } from '../../store/states/composizione-partenza/composizione-partenza.state';
import { TurnoState } from '../../../navbar/store/states/turno/turno.state';
import { SquadraComposizione } from '../interface/squadra-composizione-interface';

@Component({
    selector: 'app-composizione-veloce',
    templateUrl: './composizione-veloce.component.html',
    styleUrls: ['./composizione-veloce.component.css']
})
export class FasterComponent implements OnInit, OnDestroy {

    @Input() richiesta: SintesiRichiesta;
    @Input() dismissEvents: Observable<boolean>;
    @Input() disablePrenota: boolean;
    @Input() prenotato: boolean;

    @Select(ComposizioneVeloceState.preAccoppiati) preAccoppiati$: Observable<BoxPartenza[]>;
    preAccoppiati: BoxPartenza[];

    @Select(ComposizioneVeloceState.idPreAccoppiatoSelezionato) idPreAccoppiatoSelezionato$: Observable<string>;
    idPreAccoppiatoSelezionato: string;

    @Select(ComposizioneVeloceState.idPreAccoppiatiSelezionati) idPreAccoppiatiSelezionati$: Observable<string[]>;
    idPreAccoppiatiSelezionati: string[];

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
    }

    ngOnInit() {
        this.subscription.add(this.dismissEvents.subscribe(
            events => this.annullaPartenza(events)
        ));
        this.store.dispatch(new GetFiltriComposizione());
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // preAccoppiatoSelezionato(preAcc: BoxPartenza) {
    //     if (this.preAccoppiati) {
    //         this.selezionaPreaccoppiato(preAcc);
    //         if (preAcc.mezzoComposizione && preAcc.mezzoComposizione.coordinate) {
    //             this.mezzoCoordinate(preAcc.mezzoComposizione.coordinate);
    //         }
    //     }
    // }

    // preAccoppiatoDeselezionato(preAcc: BoxPartenza) {
    //     if (this.preAccoppiati) {
    //         this.deselezionaPreaccoppiato(preAcc);
    //         this.annullaPartenza(true);
    //         this.centraMappa.emit();
    //     }
    // }

    selezionaPreaccoppiato(preAcc: BoxPartenza) {
        this.store.dispatch(new SelectPreAccoppiatoComposizione(preAcc));
    }

    deselezionaPreaccoppiato(preAcc: BoxPartenza) {
        this.store.dispatch(new UnselectPreAccoppiatoComposizione(preAcc));
    }

    // mezzoCoordinate(event: Coordinate): void {
    //     if (this.richiesta) {
    //         if (event && this.richiesta.localita.coordinate) {
    //             const direction: DirectionInterface = {
    //                 origin: {
    //                     lat: event.latitudine,
    //                     lng: event.longitudine
    //                 },
    //                 destination: {
    //                     lat: this.richiesta.localita.coordinate.latitudine,
    //                     lng: this.richiesta.localita.coordinate.longitudine
    //                 },
    //                 isVisible: true
    //             };
    //
    //             this.sendDirection.emit(direction);
    //         } else {
    //             console.error('coordinate mezzo / coordinate richiesta non presenti');
    //             this.clearDirection.emit();
    //         }
    //     }
    // }

    annullaPartenza(event: boolean): void {
        if (event) {
            this.clearDirection.emit();
        }
    }

    confermaPartenze(): void {
        const boxPartenzaList: BoxPartenza[] = [];
        this.preAccoppiati.forEach( result => {
            if (this.idPreAccoppiatiSelezionati.includes(result.id)) {
                boxPartenzaList.push(makeCopy(result));
            }
        });
        const partenzeMappedArray = boxPartenzaList.map(obj => {
            const rObj = {};
            if (obj.mezzoComposizione) {
                obj.mezzoComposizione.mezzo.stato = 'In Viaggio';
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
        const partenzeObj = {
            'partenze': partenzeMappedArray,
            'idRichiesta': this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).codice,
            'turno': this.store.selectSnapshot(TurnoState.turno).corrente
        };
        // console.log('mappedArray', partenzeMappedArray);
        this.store.dispatch(new ConfirmPartenze(partenzeObj));
    }
}
