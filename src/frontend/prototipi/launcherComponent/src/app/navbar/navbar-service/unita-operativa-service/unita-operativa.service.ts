import {Injectable} from '@angular/core';
import {Observable, Subject, of} from 'rxjs';
import {Sede} from '../../../shared/model/sede.model';
import {Coordinate} from '../../../shared/model/coordinate.model';
import {Localita} from '../../../shared/model/localita.model';

@Injectable({
    providedIn: 'root'
})
export class UnitaOperativaService {

    private unitaAttuale = new Subject<any>();
    startCount = 0;
    unitaOperative: Sede[];
    preLoader: boolean;
    unitaS: Sede;

    constructor() {
        this.preLoader = true;
        this.unitaOperative = [
            new Sede('1', 'Comando di Roma', new Localita(new Coordinate(41.899940, 12.491270)), 'Comando'),
            new Sede('2', 'Comando di Latina', new Localita(new Coordinate(41.474258, 12.903250)), 'Comando'),
            new Sede('3', 'Comando di Frosinone', new Localita(new Coordinate(41.616320, 13.310050)), 'Comando'),
            new Sede('4', 'Comando di Rieti', new Localita(new Coordinate(42.397678, 12.858020)), 'Comando'),
            new Sede('5', 'Comando di Viterbo', new Localita(new Coordinate(42.482290, 12.069130)), 'Comando')
        ];
    }

    getUnitaOperative() {
        return of(this.unitaOperative);
    }

    sendUnitaOperativaAttuale(sede: Sede) {
        this.unitaAttuale.next(sede);
        if (this.startCount > 0) {
            this.preloading();
        }
    }

    clearUnitaOperativaAttuale() {
        this.unitaAttuale.next();
    }

    getUnitaOperativaAttuale(): Observable<any> {
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
        }, 1500);
    }
}

