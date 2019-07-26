import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MezziInServizioFakeService {

    constructor() { }

    getMezziInServizio(): Observable<any> {
        const mezzi = [
            {
                codice: '1',
                idRichiesta: 'RM-022',
                descrizione: 'A1',
                genere: 'APS',
                stato: 'In Viaggio',
                appartenenza: 0,
                distaccamento: {
                    codice: '1',
                    descrizione: 'Tuscolano II',
                    coordinate: { latitudine: 1, longitudine: 1 },
                    indirizzo: 'Via Prova, 2',
                    tipo: 'Distaccamento',
                    regione: 'Lazio',
                    provincia: 'Roma'
                }
            },
            {
                codice: '2',
                idRichiesta: 'RM-022',
                descrizione: 'A2',
                genere: 'APS',
                stato: 'In Sede',
                appartenenza: 0,
                distaccamento: {
                    codice: '1',
                    descrizione: 'Tuscolano II',
                    coordinate: { latitudine: 1, longitudine: 1 },
                    indirizzo: 'Via Prova, 2',
                    tipo: 'Distaccamento',
                    regione: 'Lazio',
                    provincia: 'Roma'
                }
            },
            {
                codice: '3',
                idRichiesta: 'RM-021',
                descrizione: 'A3',
                genere: 'APS',
                stato: 'In Sede',
                appartenenza: 0,
                distaccamento: {
                    codice: '1',
                    descrizione: 'Tuscolano II',
                    coordinate: { latitudine: 1, longitudine: 1 },
                    indirizzo: 'Via Prova, 2',
                    tipo: 'Distaccamento',
                    regione: 'Lazio',
                    provincia: 'Roma'
                }
            }
        ];
        const obj = {
            'listaMezzi': mezzi
        };
        return of(obj);
    }
}
