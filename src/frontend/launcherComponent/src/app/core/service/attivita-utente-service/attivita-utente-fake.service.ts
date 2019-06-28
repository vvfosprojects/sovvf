import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class AttivitaUtenteFakeService {


    constructor() {
    }

    public addInLavorazione(idRichiesta: string): Observable<any> {
        /**
         * da fare
         */
        return of();
    }

    public deleteInLavorazione(idRichiesta: string): Observable<any> {
        /**
         * da fare
         */
        return of();
    }

    public addPresaInCarico(idRichiesta: string): Observable<any> {
        /**
         * da fare
         */
        return of();
    }

    public deletePresaInCarico(idRichiesta: string): Observable<any> {
        /**
         * da fare
         */
        return of();
    }

}
