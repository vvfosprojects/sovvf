import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UnitaOperativeServiceFake {
    unitaOperative: Array<string>;
    unitaAttuale = 'Comando di Roma';

    constructor() {
    }

    getUnitaOperative(): Observable<string[]> {
        this.unitaOperative = ['Comando di Roma', 'Comando di Latina', 'Comando di Frosinone', 'Comando di Genova'];
        return of(this.unitaOperative);
    }

    getUnitaAttuale() {
        return this.unitaAttuale;
    }
}
