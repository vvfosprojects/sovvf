import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BoxInterventi } from '../../../features/home/boxes/boxes-model/box-interventi.model';
import { Store } from '@ngxs/store';
import { SetBoxRichieste } from '../../../features/home/store/actions/boxes/box-richieste.actions';

@Injectable()
export class BoxRichiesteFakeService {

    interventi: BoxInterventi;

    constructor(private store: Store) {
    }

    public getInterventi(): Observable<BoxInterventi> {
        this.interventi = new BoxInterventi(3, 3, 1, 2, 9, 20, 'B', 30, 'A', 2018, 12.842);
        this.store.dispatch(new SetBoxRichieste(this.interventi));
        return of(this.interventi);
    }

}
