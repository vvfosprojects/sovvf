import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CentroMappa } from '../../maps-model/centro-mappa.model';

@Injectable()
export class CenterService {

    private subject = new Subject<CentroMappa>();

    centroMappaIniziale: CentroMappa;
    currentZoom = 12;

    constructor() {
    }

    sendCentro(centro: CentroMappa) {
        this.currentZoom = centro.zoom;
        this.subject.next(centro);
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
