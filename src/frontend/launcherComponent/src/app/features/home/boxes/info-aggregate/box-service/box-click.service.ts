import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BoxClickInterface, BoxClickMezzi, BoxClickRichieste } from './box-click-interface';

@Injectable({
    providedIn: 'root'
})
export class BoxClickService {

    boxClickRichieste: BoxClickRichieste = allFalse.richieste;

    boxClickMezzi: BoxClickMezzi = allFalse.mezzi;

    boxClickState: BoxClickInterface = {
        richieste: this.boxClickRichieste,
        mezzi: this.boxClickMezzi
    };

    private clickSubject = new Subject<BoxClickInterface>();

    constructor() {
    }

    getBoxClick(): Observable<BoxClickInterface> {
        return this.clickSubject.asObservable();
    }

    allFalse() {
        this.clickSubject.next(allFalse);
    }

    allTrueByRichiesta(statoRichiesta: string) {
        const richieste: BoxClickRichieste = Object.assign({}, allFalse.richieste);
        const mezzi: BoxClickMezzi = Object.assign({}, allTrue.mezzi);
        richieste[wipeStatoRichiesta(statoRichiesta)] = true;
        const byRichiesta: BoxClickInterface = {
            richieste: richieste,
            mezzi: mezzi
        };
        this.clickSubject.next(byRichiesta);
    }
}

const allFalse: BoxClickInterface = {
    richieste: {
        chiamate: false,
        sospesi: false,
        assegnati: false,
        presidiati: false,
        chiusi: false
    },
    mezzi: {
        inSede: false,
        inRientro: false,
        inViaggio: false,
        sulPosto: false,
        istituto: false
    }
};

const allTrue: BoxClickInterface = {
    richieste: {
        chiamate: true,
        sospesi: true,
        assegnati: true,
        presidiati: true,
        // attivo il filtro escludendo le chiamate chiuse.
        chiusi: false
    },
    mezzi: {
        inSede: true,
        inRientro: true,
        inViaggio: true,
        sulPosto: true,
        istituto: true
    }
};

function wipeStatoRichiesta(stato: string): string {
    const stati: [string, string][] = [
        ['chiam', 'chiamate'],
        ['sospe', 'sospesi'],
        ['asseg', 'assegnati'],
        ['presi', 'presidiati'],
        ['chius', 'chiusi']
    ];
    const mapTipoStato: Map<string, string> = new Map(stati);
    const wipeStato = stato.toLowerCase().substr(0, 5);
    return mapTipoStato.get(wipeStato);
}


