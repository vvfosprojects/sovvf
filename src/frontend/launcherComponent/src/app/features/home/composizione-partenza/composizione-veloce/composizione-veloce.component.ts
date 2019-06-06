import { Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';

// Model
import { BoxPartenza } from '../interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Service
import { Observable, Subscription } from 'rxjs';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { DirectionInterface } from '../../maps/maps-interface/direction-interface';
import { Composizione } from '../../../../shared/enum/composizione.enum';
import { GetPreAccoppiati } from '../../store/actions/composizione-partenza/pre-accoppiati.actions';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-composizione-veloce',
    templateUrl: './composizione-veloce.component.html',
    styleUrls: ['./composizione-veloce.component.css']
})
export class FasterComponent implements OnInit, OnDestroy {

    @Input() richiesta: SintesiRichiesta;
    @Input() preAccoppiati: BoxPartenza[];
    @Input() dismissEvents: Observable<boolean>;

    idPreAccoppiatiSelezionati: string[] = [];
    preAccoppiatiSelezionati: BoxPartenza[] = [];

    Composizione = Composizione;

    subscription = new Subscription();

    @Output() sendDirection: EventEmitter<DirectionInterface> = new EventEmitter();
    @Output() clearDirection: EventEmitter<any> = new EventEmitter();
    @Output() centraMappa = new EventEmitter();

    constructor(private store: Store) {
        this.store.dispatch(new GetPreAccoppiati());
    }

    ngOnInit() {
        this.subscription.add(this.dismissEvents.subscribe(
            events => this.annullaPartenza(events)
        ));
        this.deselezionaPreaccoppiati();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    preAccoppiatoSelezionato(preAcc: BoxPartenza) {
        this.selezionaPreaccoppiato(preAcc);
        if (preAcc.mezzoComposizione && preAcc.mezzoComposizione.coordinate) {
            this.mezzoCoordinate(preAcc.mezzoComposizione.coordinate);
        }
    }

    preAccoppiatoDeselezionato(preAcc: BoxPartenza) {
        this.deselezionaPreaccoppiato(preAcc);
        this.annullaPartenza(true);
        this.centraMappa.emit();
    }

    selezionaPreaccoppiato(preAcc: BoxPartenza) {
        // preAcc.selezionato = true;
        this.idPreAccoppiatiSelezionati.push(preAcc.id);
        this.preAccoppiatiSelezionati.push(preAcc);
    }

    deselezionaPreaccoppiato(preAcc: BoxPartenza) {
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

    deselezionaPreaccoppiati() {
        this.preAccoppiati.forEach(pA => {
            // pA.selezionato = false;
        });
    }

    mezzoCoordinate(event: Coordinate): void {
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

    annullaPartenza(event: boolean): void {
        if (event) {
            this.clearDirection.emit();
        }
    }
}
