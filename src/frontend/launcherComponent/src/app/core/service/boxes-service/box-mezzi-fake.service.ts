import { Injectable } from '@angular/core';
import { BoxMezzi } from '../../../features/home/boxes/boxes-model/box-mezzi.model';
import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetBoxMezzi } from '../../../features/home/store/actions/boxes/box-mezzi.actions';

@Injectable()
export class BoxMezziFakeService {

    count = 0;

    mezziFake = [
        new BoxMezzi(89, 2, 2, 1, 3, 94),
        new BoxMezzi(90, 1, 1, 2, 3, 94),
        new BoxMezzi(92, 1, 1, 2, 1, 96),
        new BoxMezzi(89, 3, 1, 2, 1, 96),
        new BoxMezzi(88, 4, 1, 2, 1, 96),
        new BoxMezzi(88, 3, 2, 2, 1, 96),
        new BoxMezzi(88, 3, 2, 2, 2, 95),
        new BoxMezzi(89, 3, 2, 1, 2, 95),
        new BoxMezzi(89, 2, 2, 1, 1, 95)
    ];

    constructor(private store: Store) {
        setInterval(() => {
            this.store.dispatch(new SetBoxMezzi(this.mezziFake[this.count++]));
            this.count++;
            if (this.count === this.mezziFake.length) {
                this.count = 0;
            }
        }, 20000);
    }


    public getMezzi(): Observable<BoxMezzi> {
        this.store.dispatch(new SetBoxMezzi(this.mezziFake[this.count]));
        return of();
    }

}


