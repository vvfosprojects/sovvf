import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BoxClickInterface, BoxClickMezzi, BoxClickRichieste } from './box-click-interface';

@Injectable({
    providedIn: 'root'
})
export class BoxClickService {

    boxClickRichieste: BoxClickRichieste = {
        chiamate: false,
        sospesi: false,
        assegnati: false,
        presidiati: false
    };

    boxClickMezzi: BoxClickMezzi = {
        inSede: false,
        inRientro: false,
        inViaggio: false,
        sulPosto: false,
        istituto: false
    };

    boxClickState: BoxClickInterface = {
        richieste: this.boxClickRichieste,
        mezzi: this.boxClickMezzi
    };

    private clickSubject = new Subject<BoxClickInterface>();

    constructor() {
    }

    sendBoxClick(status: BoxClickInterface) {
        this.boxClickState = status;
        this.clickSubject.next(status);
    }

    getBoxClick(): Observable<BoxClickInterface> {
        return this.clickSubject.asObservable();
    }

    allTrue() {
        const allSelected: BoxClickInterface = {
            richieste: {
                chiamate: true,
                sospesi: false,
                assegnati: false,
                presidiati: false
            },
            mezzi: {
                inSede: true,
                inRientro: true,
                inViaggio: true,
                sulPosto: true,
                istituto: true
            }
        };
        this.clickSubject.next(allSelected);
    }

    allFalse() {
        const allSelected: BoxClickInterface = {
            richieste: {
                chiamate: false,
                sospesi: false,
                assegnati: false,
                presidiati: false
            },
            mezzi: {
                inSede: false,
                inRientro: false,
                inViaggio: false,
                sulPosto: false,
                istituto: false
            }
        };
        this.clickSubject.next(allSelected);
    }
}


