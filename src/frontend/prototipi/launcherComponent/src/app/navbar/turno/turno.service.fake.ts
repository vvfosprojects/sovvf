import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Turno } from './turno.model';
import * as moment from 'moment';


@Injectable({
    providedIn: 'root'
})
export class TurnoServiceFake {

    private turni: Turno = null;

    constructor() {
    }

    public getTurni(): Observable<Turno> {
        this.turni = new Turno(['A', 'B', 'C']);
        return of(this.turni);
    }

}
