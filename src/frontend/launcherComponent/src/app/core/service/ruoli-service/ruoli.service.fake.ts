import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Role } from '../../../shared/model/utente.model';

@Injectable({
    providedIn: 'root'
})
export class RuoliServiceFake {

    ruoli: Array<string>;

    constructor() {
    }

    getRuoli(): Observable<string[]> {
        this.ruoli = [
            Role.CallTaker,
            Role.GestoreRichieste
        ];
        return of(this.ruoli);
    }

}
