import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { Operatore } from '../../../shared/model/operatore.model';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { Richiedente } from '../../../shared/model/richiedente.model';
import { Localita } from '../../../shared/model/localita.model';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { Sede } from '../../../shared/model/sede.model';
import { Complessita } from '../../../shared/model/complessita.model';
import { Partenza } from '../../../shared/model/partenza.model';
import { Mezzo } from '../../../shared/model/mezzo.model';
import { Fonogramma } from '../../../shared/model/fonogramma.model';
import { Squadra } from '../../../shared/model/squadra.model';

import * as moment from 'moment';
import { Componente } from '../../../shared/model/componente.model';


@Injectable({
    providedIn: 'root'
})
export class SintesiRichiesteServiceFake {

    private richieste: SintesiRichiesta[] = [];

    constructor() {
    }

    public getRichieste(): Observable<SintesiRichiesta[]> {
        this.richieste = [
            new SintesiRichiesta(
                'R1',
                'RM-24759',
                new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X'),
                moment().subtract(0, 'minutes').toDate(),
                'chiamata',
                5,
                [new Tipologia('2', 'Incendio ed esplosione', 'fa fa-fire')],
                'Esplosione nei pressi di un centro abitato',
                new Richiedente('Alessandro Palletta', '3202676253'),
                new Localita(new Coordinate(41.8624992, 12.5532867), 'Via Scribonio Curione, 22', 'nei pressi dell\'uscita della metro'),
                [
                    new Sede('2', 'Tuscolano II', new Coordinate(41.8638843, 12.5522048), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                    new Sede('4', 'Ostiense', new Coordinate(41.8606045, 12.4730873), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                    new Sede('3', 'Tuscolana I', new Coordinate(41.8607859, 12.5226281), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                ],
                new Complessita('100', 'Alto'),
                null,
                null,
                moment().subtract(0, 'minutes').toDate(), null,
                null,
                new Fonogramma('0', 'Non necessario'),
                null,
                null
            ),
            new SintesiRichiesta(
                'R2',
                'RM-24760',
                new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X'),
                moment().subtract(4, 'minutes').toDate(),
                'assegnato',
                3,
                [new Tipologia('1', 'Incidente stradale generico', 'fa fa-car')],
                'Incidente automobile ribaltata',
                new Richiedente('Polizia', '113'),
                new Localita(
                    new Coordinate(41.8531486, 12.5411702), 'Via Tuscolana, 1500', 'automobile ribaltata, persona anziana'),
                [
                    new Sede('2', 'Tuscolano II', new Coordinate(41.8638843, 12.5522048), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                    new Sede('4', 'Ostiense', new Coordinate(41.8606045, 12.4730873), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                    new Sede('3', 'Tuscolana I', new Coordinate(41.8607859, 12.5226281), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                ],
                new Complessita('20', 'Media'),
                moment().subtract(2, 'minutes').toDate(),
                moment().subtract(1, 'minutes').toDate(),
                null,
                null,
                null,
                new Fonogramma('0', 'Non necessario'),
                null,
                null
            ),
            new SintesiRichiesta(
                'R3',
                'RM-24761',
                new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X'),
                moment().subtract(22, 'minutes').toDate(),
                'chiamata',
                1,
                [new Tipologia('360', 'Messa in sicurezza impianti tecnologici di servizio (acqua, energia elettrica, gas)', '')],
                'Scintille da palo elettrico',
                new Richiedente('Rosalba Di Tonno', '062815692'),
                new Localita(
                    new Coordinate(41.8607234, 12.555459), 'Viale Giuseppe Mazzini, 159', 'nelle vicinanze di un ristorante'),
                [
                    new Sede('5', 'Prati', new Coordinate(41.9184282, 12.4635564), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                    new Sede('6', 'Monte Mario', new Coordinate(41.9186602, 12.4360771), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                ],
                new Complessita('20', 'Media'),
                moment().subtract(16, 'minutes').toDate(),
                moment().subtract(12, 'minutes').toDate(),
                null,
                null,
                null,
                new Fonogramma('0', 'Non necessario'),
                null,
                [
                    'Tag1',
                    'Tag2'
                ]
            ),
            new SintesiRichiesta(
                'R4',
                'RM-24762',
                new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X'),
                moment().subtract(25, 'minutes').toDate(),
                'presidiato',
                2,
                [new Tipologia('360', 'Cedimento sede stradale', '')],
                'Cedimento sede stradale con rimozione veicolo',
                new Richiedente('Carabinieri', '112'),
                new Localita(
                    new Coordinate(41.8932662, 12.5417044), 'Via di Portonaccio', 'incrocio con Via Prenestina'),
                [
                    new Sede('7', 'La Rustica', new Coordinate(41.9073166, 12.5934988), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                    new Sede('2', 'Tuscolano II', new Coordinate(41.8638843, 12.5522048), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                    new Sede('3', 'Tuscolana I', new Coordinate(41.8607859, 12.5226281), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                ],
                new Complessita('20', 'Media'),
                moment().subtract(18, 'minutes').toDate(),
                moment().subtract(16, 'minutes').toDate(),
                null,
                null,
                null,
                new Fonogramma('0', 'Non necessario'),
                [
                    new Partenza(
                        [
                            new Mezzo('COD2',
                                'AS1',
                                'AS',
                                'SulPosto',
                                [
                                    new Squadra(
                                        '2A',
                                        'SulPosto',
                                        [
                                            new Componente(
                                                'CS',
                                                'Tiziana Rossetti',
                                                'Tiziana Rossetti - RSSTZN56T56R454E',
                                                true,
                                                false,
                                                false),
                                            new Componente(
                                                'VIG',
                                                'Marco Antonio Marchi Moschetti',
                                                'Marco Antonio Marchi Moschetti - MRCMRC66T66R454F',
                                                false,
                                                true,
                                                false),
                                            new Componente(
                                                'VIG',
                                                'Raffaele Cantoni',
                                                'Raffaele Cantoni - CNTRFL66T45R343E',
                                                false,
                                                false,
                                                false),
                                            new Componente(
                                                'VIG',
                                                'Giovanni Carta',
                                                'Giovanni Carta - VRTGVN56T74H565Y',
                                                false,
                                                false,
                                                false)
                                        ]
                                    )
                                ],
                                0)
                        ]
                    )
                ],
                null
            ),
            new SintesiRichiesta(
                'R5',
                'RM-24763',
                new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X'),
                moment().subtract(35, 'minutes').toDate(),
                'sospeso',
                4,
                [new Tipologia('360', 'Salvataggio persone', '')],
                'Persona che minaccia di buttarsi da un tetto',
                new Richiedente('Carabinieri', '112'),
                new Localita(
                    new Coordinate(41.8311007, 12.4683518), 'Viale Europa, 184', 'dal palazzo delle Poste Italiane'),
                [
                    new Sede('8', 'EUR', new Coordinate(41.8315918, 12.4666971), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                    new Sede('4', 'Ostiense', new Coordinate(41.8606045, 12.4730873), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                ],
                new Complessita('80', 'Alta'),
                moment().subtract(30, 'minutes').toDate(),
                moment().subtract(29, 'minutes').toDate(),
                moment().subtract(35, 'minutes').toDate(),
                null,
                null,
                new Fonogramma('0', 'Non necessario'),
                [
                    new Partenza(
                        [
                            new Mezzo('COD3',
                                'AS1',
                                'AS',
                                'InRientro',
                                [
                                    new Squadra(
                                        '3A',
                                        'InRientro',
                                        [
                                            new Componente(
                                                'CS',
                                                'Paolo Di Tonno',
                                                'Paolo Di Tonno - RSSTZN56T56R454E',
                                                true,
                                                false,
                                                false),
                                            new Componente(
                                                'VIG',
                                                'Antonio Marsalà',
                                                'Antonio Marsalà - MRCMRC66T66R454F',
                                                false,
                                                true,
                                                false),
                                            new Componente(
                                                'VIG',
                                                'Bernardo Belli',
                                                'Bernardo Belli - CNTRFL66T45R343E',
                                                false,
                                                false,
                                                false),
                                            new Componente(
                                                'VIG',
                                                'Maurizio Cutolo',
                                                'Maurizio Cutolo - VRTGVN56T74H565Y',
                                                false,
                                                false,
                                                false)
                                        ]
                                    )
                                ],
                                0)
                        ]
                    )
                ],
                null
            ),
            new SintesiRichiesta(
                'R6',
                'RM-24764',
                new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X'),
                moment().subtract(23, 'minutes').toDate(),
                'chiamata',
                1,
                [new Tipologia('2', 'Incendio ed esplosione', 'fa fa-fire')],
                'Incendio a bordo strada',
                new Richiedente('Marco Liguori', '3245898977'),
                new Localita(new Coordinate(41.8654843, 12.5805044), 'Viale dei Romanisti, 40', 'vicino ai secchi dell\'immondizia'),
                [
                    new Sede('2', 'Tuscolano II', new Coordinate(41.8638843, 12.5522048), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                    new Sede('3', 'Tuscolana I', new Coordinate(41.8607859, 12.5226281), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                ],
                new Complessita('10', 'Basso'),
                null,
                null,
                null,
                null,
                null,
                new Fonogramma('0', 'Non necessario'),
                null,
                null
            ),
            new SintesiRichiesta(
                'R7',
                'RM-24765',
                new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X'),
                moment().subtract(6, 'minutes').toDate(),
                'assegnato',
                3,
                [new Tipologia('1', 'Danni d\'acqua in genere', 'fa fa-tint')],
                'Allagamento garage con personale da soccorrere',
                new Richiedente('Polizia', '113'),
                new Localita(
                    new Coordinate(41.82699, 12.4874854), 'Via Simone Martini, 125', 'persone all\'interno del garage'),
                [
                    new Sede('2', 'Tuscolano II', new Coordinate(41.8638843, 12.5522048), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                    new Sede('4', 'Ostiense', new Coordinate(41.8606045, 12.4730873), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                    new Sede('3', 'Tuscolana I', new Coordinate(41.8607859, 12.5226281), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                ],
                new Complessita('20', 'Media'),
                moment().subtract(12, 'minutes').toDate(),
                moment().subtract(11, 'minutes').toDate(),
                null,
                null,
                null,
                new Fonogramma('0', 'Non necessario'),
                null,
                null
            ),
            new SintesiRichiesta(
                'R8',
                'RM-24766',
                new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X'),
                moment().subtract(37, 'minutes').toDate(),
                'sospeso',
                2,
                [new Tipologia('360', 'Recupero merci e beni', '')],
                'Recupero merci e beni da camion ribaltato',
                new Richiedente('Polizia', '113'),
                new Localita(
                    new Coordinate(41.9125723, 12.4952921), 'Via Isonzo, 21', 'beni alimentari di vario tipo'),
                [
                    new Sede('8', 'EUR', new Coordinate(41.8315918, 12.4666971), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                    new Sede('4', 'Ostiense', new Coordinate(41.8606045, 12.4730873), 'Via Ignorasi', 'Distaccamento', 'Lazio', 'Roma'),
                ],
                new Complessita('19', 'Bassa'),
                moment().subtract(30, 'minutes').toDate(),
                moment().subtract(29, 'minutes').toDate(),
                null,
                'NUE4382746',
                null,
                new Fonogramma('0', 'Non necessario'),
                [
                    new Partenza(
                        [
                            new Mezzo('COD3',
                                'AS1',
                                'AS',
                                'InRientro',
                                [
                                    new Squadra(
                                        '3A',
                                        'InRientro',
                                        [
                                            new Componente(
                                                'CS',
                                                'Paolo Di Tonno',
                                                'Paolo Di Tonno - RSSTZN56T56R454E',
                                                true,
                                                false,
                                                false),
                                            new Componente(
                                                'VIG',
                                                'Antonio Marsalà',
                                                'Antonio Marsalà - MRCMRC66T66R454F',
                                                false,
                                                true,
                                                false),
                                            new Componente(
                                                'VIG',
                                                'Bernardo Belli',
                                                'Bernardo Belli - CNTRFL66T45R343E',
                                                false,
                                                false,
                                                false),
                                            new Componente(
                                                'VIG',
                                                'Maurizio Cutolo',
                                                'Maurizio Cutolo - VRTGVN56T74H565Y',
                                                false,
                                                false,
                                                false)
                                        ]
                                    )
                                ],
                                0)
                        ]
                    )
                ],
                null
            )
        ];

        return of(this.richieste);
    }

}
