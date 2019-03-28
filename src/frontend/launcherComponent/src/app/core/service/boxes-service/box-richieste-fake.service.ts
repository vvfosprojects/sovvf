import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BoxInterventi } from '../../../features/home/boxes/boxes-model/box-interventi.model';

@Injectable()
export class BoxRichiesteFakeService {

    interventi: BoxInterventi;

    constructor() {
    }

    public getInterventi(): Observable<BoxInterventi> {
        this.interventi = new BoxInterventi(3, 3, 1, 2, 9, 20, 'B', 30, 'A', 2018, 12.842);
        return of(this.interventi);
    }

}
