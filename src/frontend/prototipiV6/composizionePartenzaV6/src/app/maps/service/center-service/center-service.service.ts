import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CentroMappa } from '../../maps-model/centro-mappa.model';

@Injectable({
    providedIn: 'root'
})
export class CenterService {

    private subject = new Subject<CentroMappa>();

    centroMappaIniziale: CentroMappa;
    currentZoom = 12;

    constructor() {
    }

    sendCentro(centro: CentroMappa) {
        /* tolto perchè non serve nel prototipo di composizione
        this.currentZoom = centro.zoom;
        this.subject.next(centro);
        */
    }

    clearCentro() {
        this.subject.next();
    }

    getCentro(): Observable<CentroMappa> {
        return this.subject.asObservable();
    }

    getCurrentZoom(): number {
        return this.currentZoom;
    }

}
