import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

// Models
import {SintesiRichiesta} from '../../../shared/model/sintesi-richiesta.model';


@Injectable({
    providedIn: 'root'
})
export class SintesiRichiesteService {

    private richieste: SintesiRichiesta[] = [];

    /**
     *
     * questo service si connetterà al back end e cambierà tutta la logica
     */
    constructor() {
    }

    public getRichieste(): Observable<SintesiRichiesta[]> {
        return of(this.richieste);
    }

}
