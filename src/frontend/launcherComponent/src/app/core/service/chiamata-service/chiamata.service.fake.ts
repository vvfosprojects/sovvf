import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class ChiamataServiceFake {

    idChiamata: string;

    constructor() {
    }

    getIdChiamata(): Observable<string> {
        this.idChiamata = `RM-0${Math.floor(Math.random() * 5) + 23}`;
        return of(this.idChiamata);
    }
}
