import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetRichieste } from '../../../features/home/store/actions/richieste/richieste.actions';
import { GetBoxRichieste } from '../../../features/home/store/actions/boxes/box-richieste.actions';
import { GetBoxMezzi } from '../../../features/home/store/actions/boxes/box-mezzi.actions';
import { GetBoxPersonale } from '../../../features/home/store/actions/boxes/box-personale.actions';
import { GetChiamateMarkers } from '../../../features/home/store/actions/maps/chiamate-markers.actions';
import { of } from 'rxjs';

@Injectable()
export class HomeServiceFake {

    constructor(private store: Store) {
    }

    getHome() {
        this.store.dispatch([
            new GetRichieste(),
            new GetBoxRichieste(),
            new GetBoxMezzi(),
            new GetBoxPersonale(),
            new GetChiamateMarkers()
        ]);

        return of();
    }
}
