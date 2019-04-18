import { Injectable } from '@angular/core';
import { BoxMezzi } from '../../../features/home/boxes/boxes-model/box-mezzi.model';
import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetBoxMezzi } from '../../../features/home/store/actions/boxes/box-mezzi.actions';

@Injectable()
export class BoxMezziFakeService {

    mezzi: BoxMezzi;

    constructor(private store: Store) {
    }

    public getMezzi(): Observable<BoxMezzi> {
        this.mezzi = new BoxMezzi(89, 2, 2, 1, 1, 94);
        this.store.dispatch(new SetBoxMezzi(this.mezzi));
        return of();
    }

}
