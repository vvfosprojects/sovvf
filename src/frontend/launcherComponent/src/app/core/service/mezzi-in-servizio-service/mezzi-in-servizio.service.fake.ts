import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MezzoInServizio } from '../../../shared/interface/mezzo-in-servizio.interface';
import { StatoSquadra } from '../../../shared/enum/stato-squadra.enum';

interface MezziInServizioFakeResponse {
    listaMezzi: MezzoInServizio[];
}

@Injectable({
    providedIn: 'root'
})
export class MezziInServizioFakeService {

    constructor() {
    }

    getMezziInServizio(): Observable<MezziInServizioFakeResponse> {
        let res = {} as MezziInServizioFakeResponse;
        const mezzi = [
            {
                mezzo: {
                    coordinate: { latitudine: 1, longitudine: 1 },
                    mezzo: {
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
                        },
                        coordinate: { latitudine: 1, longitudine: 1 }
                    },
                    infoRichiesta: {
                        codiceRichiesta: 'RM1900000',
                        indirizzo: 'Via Ignorasi, 47a'
                    }
                },
                squadre: [
                    {
                        id: '1',
                        nome: 'Rossa',
                        stato: StatoSquadra.InSede,
                        componenti: [
                            { descrizioneQualifica: 'CP', nominativo: 'Mario Verdi', tooltip: '', capoPartenza: true, autista: false, rimpiazzo: false },
                            { descrizioneQualifica: 'CP', nominativo: 'Francesco Rossi', tooltip: '', capoPartenza: false, autista: true, rimpiazzo: false },
                            { descrizioneQualifica: 'CP', nominativo: 'Mario Verna', tooltip: '', capoPartenza: false, autista: false, rimpiazzo: true }
                        ],
                        distaccamento: {
                            codice: '1',
                            descrizione: 'Tuscolana II',
                            coordinate: { latitudine: 1, longitudine: 1 },
                            indirizzo: 'Via Prova, 1',
                            tipo: 'Distaccamento',
                            regione: 'Lazio',
                            provincia: 'Roma'
                        }
                    }
                ]
            },
            {
                mezzo: {
                    coordinate: { latitudine: 1, longitudine: 1 },
                    mezzo: {
                        codice: '2',
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
                        },
                        coordinate: { latitudine: 1, longitudine: 1 }
                    },
                    infoRichiesta: null
                },
                squadre: null
            }
        ];
        res = {
            'listaMezzi': mezzi
        };
        return of(res);
    }
}
