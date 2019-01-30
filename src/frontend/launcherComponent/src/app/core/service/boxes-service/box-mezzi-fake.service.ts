import { Injectable } from '@angular/core';
import { BoxMezzi } from '../../../features/home/boxes/boxes-model/box-mezzi.model';
import { Observable, of } from 'rxjs';

@Injectable()
export class BoxMezziFakeService {

    mezzi: BoxMezzi;

    constructor() {
    }

    public getMezzi(): Observable<BoxMezzi> {
        this.mezzi = new BoxMezzi(89, 2, 2, 1, 1, 94);
        return of(this.mezzi);
    }

}
