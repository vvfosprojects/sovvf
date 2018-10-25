import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {EventoRichiesta} from '../../../eventi-richiesta/eventi-model/evento-richiesta.model';

@Injectable()
export class EventiRichiestaServiceFake {

    constructor() {
    }

    public getEventiRichiesta(): Observable<EventoRichiesta[]> {
        const elencoEventiRichiesta: EventoRichiesta[] = [
            new EventoRichiesta(
                '6',
                'RiaperturaRichiesta',
                new Date('2017-10-20T12:54:00'),
                '',
                'dall\'operatore UTENTE1',
                'http://about:blank'),
            new EventoRichiesta(
                '6',
                'ChiusuraRichiesta',
                new Date('2017-10-20T12:44:00'),
                '',
                'dall\'operatore UTENTE1',
                'http://about:blank'),
            new EventoRichiesta(
                '5',
                'PartenzaRientrata',
                new Date('2017-10-20T12:34:00'),
                '45678',
                'nel Distaccamento Centrale',
                'http://about:blank'),
            new EventoRichiesta(
                '4',
                'PartenzaInRientro',
                new Date('2017-10-20T11:54:00'),
                '45678',
                'da Via Cavour, 5 - Roma',
                'http://about:blank'),
            new EventoRichiesta(
                '3',
                'VaInFuoriServizio',
                new Date('2017-10-20T10:40:14'),
                '45678',
                'movimento GAC',
                'http://about:blank'),
            new EventoRichiesta(
                '3',
                'RevocaPerAltraMotivazione',
                new Date('2017-10-20T10:40:13'),
                '45678',
                'rifornimento carburante',
                'http://about:blank'),
            new EventoRichiesta(
                '3',
                'RevocaPerFuoriServizio',
                new Date('2017-10-20T10:40:12'),
                '45678',
                'movimento GAC',
                'http://about:blank'),
            new EventoRichiesta(
                '3',
                'RevocaPerInterventoNonPiuNecessario',
                new Date('2017-10-20T10:40:11'),
                '45678',
                'dall\'operatore UTENTE2',
                'http://about:blank'),
            new EventoRichiesta(
                '3',
                'RevocaPerRiassegnazione',
                new Date('2017-10-20T10:40:10'),
                '45678',
                'assegnato alla richiesta 345.433.890',
                'http://about:blank'),
            new EventoRichiesta(
                '3',
                'ArrivoSulPosto',
                new Date('2017-10-20T10:40:00'),
                '45678',
                'in Via Cavour, 5 - Roma',
                'http://about:blank'),
            new EventoRichiesta(
                '2',
                'UscitaPartenza',
                new Date('2017-10-20T10:11:00'),
                '45678',
                'dal Distaccamento Centrale',
                'http://about:blank'),
            new EventoRichiesta(
                '1',
                'ComposizionePartenza',
                new Date('2017-10-20T10:09:00'),
                '45678',
                'dall\'operatore UTENTE1',
                'http://about:blank'),
            new EventoRichiesta(
                '0b',
                'InviareFonogramma',
                new Date('2017-10-20T10:05:55'),
                '',
                'dall\'operatore UTENTE3',
                'http://about:blank'),
            new EventoRichiesta(
                '0b',
                'MarcaNonRilevante',
                new Date('2017-10-20T10:05:50'),
                '',
                'dall\'operatore UTENTE1',
                'http://about:blank'),
            new EventoRichiesta(
                '0b',
                'MarcaRilevante',
                new Date('2017-10-20T10:05:40'),
                '',
                'dall\'operatore UTENTE1',
                'http://about:blank'),
            new EventoRichiesta(
                '0a',
                'AssegnazionePriorita',
                new Date('2017-10-20T10:05:10'),
                '',
                'priorità Alta',
                'http://about:blank'),
            new EventoRichiesta(
                '0a',
                'InizioPresaInCarico',
                new Date('2017-10-20T10:04:10'),
                '',
                'dall\'operatore UTENTE1',
                'http://about:blank'),
            new EventoRichiesta(
                '0',
                'Telefonata',
                new Date('2017-10-20T10:04:00'),
                '',
                'richiesta da 118',
                'http://about:blank')
        ];

        return of(elencoEventiRichiesta);

    }

}
