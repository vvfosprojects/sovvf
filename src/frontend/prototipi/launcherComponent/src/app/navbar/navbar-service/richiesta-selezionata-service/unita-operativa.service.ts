import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UnitaOperativaService {
    unitaOperative = ['Comando di Roma', 'Comando di Latina', 'Comando di Frosinone', 'Comando di Genova'];
    private unitaAttuale = new Subject<any>();

    constructor() {
    }

    getUnitaOperative() {
        return of(this.unitaOperative);
    }

    sendUnitaOperativaAttuale(richiesta) {
        this.unitaAttuale.next(richiesta);
    }

    clearUnitaOperativaAttuale() {
        this.unitaAttuale.next();
    }

    getUnitaOperativaAttuale(): Observable<any> {
        return this.unitaAttuale.asObservable();
    }
}

