import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Turno } from '../../turno/turno.model';


@Injectable({
    providedIn: 'root'
})
export class TurnoServiceFake {

    private turni: Turno = null;

    constructor() {
    }

    public getTurni(): Observable<Turno> {
        this.turni = new Turno(['D', 'B', 'A']);
        return of(this.turni);
    }

}
