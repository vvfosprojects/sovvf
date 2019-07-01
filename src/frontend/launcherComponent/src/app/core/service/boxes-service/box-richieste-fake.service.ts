import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BoxInterventi } from '../../../features/home/boxes/boxes-model/box-interventi.model';
import { Store } from '@ngxs/store';
import { SetBoxRichieste } from '../../../features/home/store/actions/boxes/box-richieste.actions';

@Injectable()
export class BoxRichiesteFakeService {

    count = 0;
    interventiFake = [
        new BoxInterventi(3, 3, 1, 2, 9, 20, 'B', 30, 'A', 2018, 12.842),
        new BoxInterventi(4, 3, 1, 2, 9, 21, 'B', 30, 'A', 2018, 12.843),
        new BoxInterventi(3, 4, 1, 2, 9, 21, 'B', 30, 'A', 2018, 12.843)
    ];

    constructor(private store: Store) {
        setInterval(() => {
            this.store.dispatch(new SetBoxRichieste(this.interventiFake[this.count]));
            this.count++;
            if (this.count === this.interventiFake.length) {
                this.count = 0;
            }
        }, 15000);
    }

    public getInterventi(): Observable<BoxInterventi> {
        this.store.dispatch(new SetBoxRichieste(this.interventiFake[this.count]));
        return of();
    }

}
