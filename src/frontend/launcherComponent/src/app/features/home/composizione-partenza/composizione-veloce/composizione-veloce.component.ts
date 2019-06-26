import { Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';

// Model
import { BoxPartenza } from '../interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Service
import { Observable, Subscription } from 'rxjs';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { DirectionInterface } from '../../maps/maps-interface/direction-interface';
import { Composizione } from '../../../../shared/enum/composizione.enum';
import { Select, Store } from '@ngxs/store';
import { GetFiltriComposizione } from '../../store/actions/composizione-partenza/composizione-partenza.actions';
import { ComposizioneVeloceState } from '../../store/states/composizione-partenza/composizione-veloce.state';
import { makeCopy } from '../../../../shared/helper/function';

@Component({
    selector: 'app-composizione-veloce',
    templateUrl: './composizione-veloce.component.html',
    styleUrls: ['./composizione-veloce.component.css']
})
export class FasterComponent implements OnInit, OnDestroy {

    @Input() richiesta: SintesiRichiesta;
    @Input() dismissEvents: Observable<boolean>;

    idPreAccoppiatiSelezionati: string[] = [];
    preAccoppiatiSelezionati: BoxPartenza[] = [];

    @Select(ComposizioneVeloceState.preAccoppiati) preAccoppiati$: Observable<BoxPartenza[]>;
    preAccoppiati: BoxPartenza[];

    Composizione = Composizione;

    subscription = new Subscription();

    @Output() sendDirection: EventEmitter<DirectionInterface> = new EventEmitter();
    @Output() clearDirection: EventEmitter<any> = new EventEmitter();
    @Output() centraMappa = new EventEmitter();

    constructor(private store: Store) {
        // Prendo i preaccoppiati da visualizzare nella lista
        this.subscription.add(
            this.preAccoppiati$.subscribe((preAcc: BoxPartenza[]) => {
                this.preAccoppiati = makeCopy(preAcc);
                // console.log(this.preAccoppiati);
            })
        );
    }

    ngOnInit() {
        this.subscription.add(this.dismissEvents.subscribe(
            events => this.annullaPartenza(events)
        ));
        this.deselezionaPreaccoppiati();
        this.store.dispatch(new GetFiltriComposizione());
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    preAccoppiatoSelezionato(preAcc: BoxPartenza) {
        if (this.preAccoppiati) {
            this.selezionaPreaccoppiato(preAcc);
            if (preAcc.mezzoComposizione && preAcc.mezzoComposizione.coordinate) {
                this.mezzoCoordinate(preAcc.mezzoComposizione.coordinate);
            }
        }
    }

    preAccoppiatoDeselezionato(preAcc: BoxPartenza) {
        if (this.preAccoppiati) {
            this.deselezionaPreaccoppiato(preAcc);
            this.annullaPartenza(true);
            this.centraMappa.emit();
        }
    }

    selezionaPreaccoppiato(preAcc: BoxPartenza) {
        if (this.preAccoppiati) {
            // preAcc.selezionato = true;
            this.idPreAccoppiatiSelezionati.push(preAcc.id);
            this.preAccoppiatiSelezionati.push(preAcc);
        }
    }

    deselezionaPreaccoppiato(preAcc: BoxPartenza) {
        if (this.preAccoppiati) {
            this.idPreAccoppiatiSelezionati.forEach((pA, index) => {
                if (preAcc.id === pA) {
                    // preAcc.selezionato = false;
                    this.idPreAccoppiatiSelezionati.splice(index, 1);
                }
            });
            this.preAccoppiatiSelezionati.forEach((pA, index) => {
                if (preAcc === pA) {
                    // preAcc.selezionato = false;
                    this.preAccoppiatiSelezionati.splice(index, 1);
                }
            });
        }
    }

    deselezionaPreaccoppiati() {
        if (this.preAccoppiati) {
            this.preAccoppiati.forEach(pA => {
                // pA.selezionato = false;
            });
        }
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
                this.clearDirection.emit();
            }
        }
    }

    annullaPartenza(event: boolean): void {
        if (event) {
            this.clearDirection.emit();
        }
    }

    confermaPartenze(): void {
        //
    }
}
