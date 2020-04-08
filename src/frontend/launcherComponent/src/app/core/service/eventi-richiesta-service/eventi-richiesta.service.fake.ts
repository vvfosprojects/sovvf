import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EventoRichiesta } from '../../../shared/model/evento-richiesta.model';
import * as moment from 'moment';

@Injectable()
export class EventiRichiestaServiceFake {

    private eventiFake: EventoRichiesta[];

    constructor() {
        this.eventiFake = [
            new EventoRichiesta(
                '6',
                'ChiusuraRichiesta',
                new Date(moment().subtract(9, 'minutes').toDate()),
                '',
                'dall\'operatore UTENTE1',
                'http://about:blank'),
            new EventoRichiesta(
                '5',
                'PartenzaRientrata',
                new Date(moment().subtract(10, 'minutes').toDate()),
                '45678',
                'nel Distaccamento Centrale',
                'http://about:blank'),
            new EventoRichiesta(
                '4',
                'PartenzaInRientro',
                new Date(moment().subtract(15, 'minutes').toDate()),
                '45678',
                'da Viale Europa, 184 - Roma',
                'http://about:blank'),
            new EventoRichiesta(
                '3',
                'ArrivoSulPosto',
                new Date(moment().subtract(20, 'minutes').toDate()),
                '45678',
                'in Viale Europa, 184 - Roma',
                'http://about:blank'),
            new EventoRichiesta(
                '2',
                'UscitaPartenza',
                new Date(moment().subtract(28, 'minutes').toDate()),
                '45678',
                'dal Distaccamento Centrale',
                'http://about:blank'),
            new EventoRichiesta(
                '1',
                'ComposizionePartenza',
                new Date(moment().subtract(29, 'minutes').toDate()),
                '45678',
                'dall\'operatore UTENTE1',
                'http://about:blank'),
            new EventoRichiesta(
                '0b',
                'InviareFonogramma',
                new Date(moment().subtract(30, 'minutes').toDate()),
                '',
                'dall\'operatore UTENTE3',
                'http://about:blank'),
            new EventoRichiesta(
                '0b',
                'MarcaRilevante',
                new Date(moment().subtract(32, 'minutes').toDate()),
                '',
                'dall\'operatore UTENTE1',
                'http://about:blank'),
            new EventoRichiesta(
                '0a',
                'AssegnazionePriorita',
                new Date(moment().subtract(33, 'minutes').toDate()),
                '',
                'priorità Alta',
                'http://about:blank'),
            new EventoRichiesta(
                '0a',
                'InizioPresaInCarico',
                new Date(moment().subtract(34, 'minutes').toDate()),
                '',
                'dall\'operatore UTENTE1',
                'http://about:blank'),
            new EventoRichiesta(
                '0',
                'Telefonata',
                new Date(moment().subtract(35, 'minutes').toDate()),
                '',
                'richiesta da 118',
                'http://about:blank')
        ].reverse();
    }

    public getEventiRichiesta(idRichiesta: string): Observable<EventoRichiesta[]> {

        return of(this.eventiFake);
    }

}
