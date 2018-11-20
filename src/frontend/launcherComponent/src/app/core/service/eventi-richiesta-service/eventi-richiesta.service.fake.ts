import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {EventoRichiesta} from '../../../eventi/eventi-model/evento-richiesta.model';
import * as moment from 'moment';

@Injectable()
export class EventiRichiestaServiceFake {

    constructor() {
    }

    public getEventiRichiesta(): Observable<EventoRichiesta[]> {
        const elencoEventiRichiesta: EventoRichiesta[] = [
            // new EventoRichiesta(
            //     '6',
            //     'RiaperturaRichiesta',
            //     new Date(moment().subtract(18, 'minutes').toDate()),
            //     '',
            //     'dall\'operatore UTENTE1',
            //     'http://about:blank'),
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
            // new EventoRichiesta(
            //     '3',
            //     'VaInFuoriServizio',
            //     new Date(moment().subtract(22, 'minutes').toDate()),
            //     '45678',
            //     'movimento GAC',
            //     'http://about:blank'),
            // new EventoRichiesta(
            //     '3',
            //     'RevocaPerAltraMotivazione',
            //     new Date(moment().subtract(23, 'minutes').toDate()),
            //     '45678',
            //     'rifornimento carburante',
            //     'http://about:blank'),
            // new EventoRichiesta(
            //     '3',
            //     'RevocaPerFuoriServizio',
            //     new Date(moment().subtract(24, 'minutes').toDate()),
            //     '45678',
            //     'movimento GAC',
            //     'http://about:blank'),
            // new EventoRichiesta(
            //     '3',
            //     'RevocaPerInterventoNonPiuNecessario',
            //     new Date(moment().subtract(25, 'minutes').toDate()),
            //     '45678',
            //     'dall\'operatore UTENTE2',
            //     'http://about:blank'),
            // new EventoRichiesta(
            //     '3',
            //     'RevocaPerRiassegnazione',
            //     new Date(moment().subtract(26, 'minutes').toDate()),
            //     '45678',
            //     'assegnato alla richiesta 345.433.890',
            //     'http://about:blank'),
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
            // new EventoRichiesta(
            //     '0b',
            //     'MarcaNonRilevante',
            //     new Date(moment().subtract(31, 'minutes').toDate()),
            //     '',
            //     'dall\'operatore UTENTE1',
            //     'http://about:blank'),
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
        ];

        return of(elencoEventiRichiesta.reverse());

    }

}
