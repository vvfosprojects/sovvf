import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Role } from '../../../shared/model/utente.model';

@Injectable({
    providedIn: 'root'
})
export class RuoliServiceFake {

    ruoli: Array<any>;

    constructor() {
    }

    getRuoli(): Observable<any> {
        this.ruoli = [
            Role.Admin,
            Role.User
        ];
        return of(this.ruoli);
    }

}
