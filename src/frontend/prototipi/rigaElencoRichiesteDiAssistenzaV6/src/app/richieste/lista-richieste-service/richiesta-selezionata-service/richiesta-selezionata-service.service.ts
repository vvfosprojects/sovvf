import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RichiestaSelezionataService {

    private richiesta = new Subject<any>();

    sendRichiesta(richiesta) {
        this.richiesta.next(richiesta);
    }

    clearRichiesta() {
        this.richiesta.next();
    }

    getRichiesta(): Observable<any> {
        return this.richiesta.asObservable();
    }
}
