import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Sede } from '../../../shared/model/sede.model';

@Injectable({
    providedIn: 'root'
})
export class UnitaAttualeService {

    private unitaAttuale = new Subject<Sede[]>();
    startCount = 0;
    preLoader: boolean;
    unitaSelezionata: Sede[] = [];

    constructor() {
        this.preLoader = true;
    }

    sendUnitaOperativaAttuale(sede: Sede[]) {
        this.unitaAttuale.next(sede);
        if (this.startCount > 0) {
            this.preloading();
        }
    }

    getUnitaOperativaAttuale(): Observable<Sede[]> {
        return this.unitaAttuale.asObservable();
    }

    preloading() {
        /**
         * preloader fake, simula il ricaricamento dell'applicazione
         */
        this.preLoader = false;
        console.log('inizio riavvio applicazione(fake)');
        setTimeout(() => {
            this.preLoader = true;
            console.log('fine riavvio applicazione(fake)');
        }, 1000);
    }

}
