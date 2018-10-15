import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { Richiesta } from '../dispatcher/richiesta.model';
import { SintesiRichiesta } from '../shared/model/sintesi-richiesta.model';
import { Operatore } from '../shared/model/operatore.model';
import { Tipologia } from '../shared/model/tipologia.model';
import { Richiedente } from '../shared/model/richiedente.model';
import { Localita } from '../shared/model/localita.model';
import { Coordinate } from '../shared/model/coordinate.model';
import { Sede } from '../shared/model/sede.model';
import { Complessita } from '../shared/model/complessita.model';
import { Partenza } from '../shared/model/partenza.model';
import { Mezzo } from '../shared/model/mezzo.model';
import { Fonogramma } from '../shared/model/fonogramma.model';
import { Squadra } from '../shared/model/squadra.model';
import { RichiestaMarker } from '../maps/maps-model/richiesta-marker.model';

import * as moment from 'moment';
import { Componente } from '../shared/model/componente.model';

@Injectable({
    providedIn: 'root'
})
export class RichiesteServiceFake {

    private richieste: Richiesta[] = [];

    constructor() {
    }

    public getRichieste(): Observable<Richiesta[]> {
        this.richieste = [
            new Richiesta(
                new SintesiRichiesta(
                    'R1',
                    'RM-24759',
                    new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X', 'CDXXH', 'password',
                        new Sede(1, 'Roma', new Coordinate(41.9004733, 12.4906652), 'Comando Provinciale')),
                    true,
                    moment().subtract(0, 'minutes').toDate(),
                    'chiamata',
                    5,
                    [new Tipologia(2, 'Incendio ed esplosione', 'fa fa-fire')],
                    'Esplosione nei pressi di un centro abitato',
                    new Richiedente('Alessandro Palletta', '3202676253'),
                    new Localita(new Coordinate(41.8624992, 12.5532867), 'Via Scribonio Curione, 22', 'nei pressi dell\'uscita della metro'),
                    [
                        new Sede(2, 'Tuscolano II', new Coordinate(41.8638843, 12.5522048), 'Distaccamento'),
                        new Sede(4, 'Ostiense', new Coordinate(41.8606045, 12.4730873), 'Distaccamento'),
                        new Sede(3, 'Tuscolana I', new Coordinate(41.8607859, 12.5226281), 'Distaccamento'),
                    ],
                    new Complessita('100', 0, 'Alto'),
                    null,
                    null,
                    null,
                    null,
                    null,
                    new Fonogramma(0, 'Non necessario'),
                    null,
                    null
                ),
                new RichiestaMarker(
                    'R1',
                    new Localita(
                        new Coordinate(41.8624992, 12.5532867),
                        'Via Scribonio Curione, 22', 'nei pressi dell\'uscita della metro'
                    ),
                    [
                        new Tipologia(2, 'Incendio ed esplosione', 'fa fa-fire')
                    ],
                    'Esplosione nei pressi di un centro abitato',
                    true,
                    5,
                    'chiamata'
                )
            ),
            new Richiesta(
                new SintesiRichiesta(
                    'R2',
                    'RM-24760',
                    new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X', 'CDXXH', 'password',
                        new Sede(1, 'Roma', new Coordinate(41.8549993, 12.5688578), 'Comando Provinciale')),
                    false,
                    moment().subtract(4, 'minutes').toDate(),
                    'assegnato',
                    3,
                    [new Tipologia(1, 'Incidente stradale generico', 'fa fa-car')],
                    'Incidente automobile ribaltata',
                    new Richiedente('Polizia', '113'),
                    new Localita(
                        new Coordinate(41.8531486, 12.5411702), 'Via Tuscolana, 1500', 'automobile ribaltata, persona anziana'),
                    [
                        new Sede(2, 'Tuscolano II', new Coordinate(41.8638843, 12.5522048), 'Distaccamento'),
                        new Sede(4, 'Ostiense', new Coordinate(41.8606045, 12.4730873), 'Distaccamento'),
                        new Sede(3, 'Tuscolana I', new Coordinate(41.8607859, 12.5226281), 'Distaccamento'),
                    ],
                    new Complessita('20', 0, 'Media'),
                    null,
                    moment().subtract(2, 'minutes').toDate(),
                    moment().subtract(1, 'minutes').toDate(),
                    null,
                    null,
                    new Fonogramma(0, 'Non necessario'),
                    null,
                    null
                ),
                new RichiestaMarker(
                    'R2',
                    new Localita(
                        new Coordinate(41.8549993, 12.5688578), 'Via Tuscolana, 1500', 'automobile ribaltata, persona anziana'),
                    [
                        new Tipologia(2, 'Incidente stradale generico', 'fa fa-car')
                    ],
                    'Incidente d\'auto persona anziana',
                    false,
                    3,
                    'assegnato'
                )
            ),
            new Richiesta(
                new SintesiRichiesta(
                    'R3',
                    'RM-24761',
                    new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X', 'CDXXH', 'password',
                        new Sede(1, 'Roma', new Coordinate(41.9161894, 12.4554147), 'Comando Provinciale')),
                    false,
                    moment().subtract(22, 'minutes').toDate(),
                    'chiamata',
                    1,
                    [new Tipologia(360, 'Messa in sicurezza impianti tecnologici di servizio (acqua, energia elettrica, gas)', '')],
                    'Scintille da palo elettrico',
                    new Richiedente('Rosalba Di Tonno', '062815692'),
                    new Localita(
                        new Coordinate(41.8607234, 12.555459), 'Viale Giuseppe Mazzini, 159', 'nelle vicinanze di un ristorante'),
                    [
                        new Sede(5, 'Prati', new Coordinate(41.9184282, 12.4635564), 'Distaccamento'),
                        new Sede(6, 'Monte Mario', new Coordinate(41.9186602, 12.4360771), 'Distaccamento'),
                    ],
                    new Complessita('20', 0, 'Media'),
                    null,
                    moment().subtract(16, 'minutes').toDate(),
                    moment().subtract(12, 'minutes').toDate(),
                    null,
                    null,
                    new Fonogramma(0, 'Non necessario'),
                    null,
                    null
                ),
                new RichiestaMarker(
                    'R3',
                    new Localita(
                        new Coordinate(41.9161894, 12.4554147), 'Viale Giuseppe Mazzini, 159', 'nelle vicinanze di un ristorante'),
                    [
                        new Tipologia(360, 'Messa in sicurezza impianti tecnologici di servizio (acqua, energia elettrica, gas)', '')
                    ],
                    'Scintille da palo elettrico',
                    false,
                    1,
                    'chiamata'
                )
            ),
            new Richiesta(
                new SintesiRichiesta(
                    'R4',
                    'RM-24762',
                    new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X', 'CDXXH', 'password',
                        new Sede(1, 'Roma', new Coordinate(41.9161894, 12.4554147), 'Comando Provinciale')),
                    false,
                    moment().subtract(25, 'minutes').toDate(),
                    'presidiato',
                    2,
                    [new Tipologia(360, 'Cedimento sede stradale', '')],
                    'Cedimento sede stradale con rimozione veicolo',
                    new Richiedente('Carabinieri', '112'),
                    new Localita(
                        new Coordinate(41.8932662, 12.5417044), 'Via di Portonaccio', 'incrocio con Via Prenestina'),
                    [
                        new Sede(7, 'La Rustica', new Coordinate(41.9073166, 12.5934988), 'Distaccamento'),
                        new Sede(2, 'Tuscolano II', new Coordinate(41.8638843, 12.5522048), 'Distaccamento'),
                        new Sede(3, 'Tuscolana I', new Coordinate(41.8607859, 12.5226281), 'Distaccamento'),
                    ],
                    new Complessita('20', 0, 'Media'),
                    null,
                    moment().subtract(18, 'minutes').toDate(),
                    moment().subtract(16, 'minutes').toDate(),
                    null,
                    null,
                    new Fonogramma(0, 'Non necessario'),
                    [
                        new Partenza(
                            [
                                new Mezzo('COD2',
                                    'AS1',
                                    'AS',
                                    'SulPosto',
                                    0)
                            ],
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
                            ]
                        )
                    ],
                    null
                ),
                new RichiestaMarker(
                    'R4',
                    new Localita(
                        new Coordinate(41.8932662, 12.5417044), 'Via di Portonaccio', 'incrocio con Via Prenestina'),
                    [
                        new Tipologia(360, 'Cedimento sede stradale', '')
                    ],
                    'Cedimento sede stradale con rimozione veicolo',
                    false,
                    2,
                    'presidiato'
                )
            ),
            new Richiesta(
                new SintesiRichiesta(
                    'R5',
                    'RM-24762',
                    new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X', 'CDXXH', 'password',
                        new Sede(1, 'Roma', new Coordinate(41.9161894, 12.4554147), 'Comando Provinciale')),
                    true,
                    moment().subtract(35, 'minutes').toDate(),
                    'sospeso',
                    4,
                    [new Tipologia(360, 'Salvataggio persone', '')],
                    'Persona che minaccia di buttarsi da un tetto',
                    new Richiedente('Carabinieri', '112'),
                    new Localita(
                        new Coordinate(41.8311007, 12.4683518), 'Viale Europa, 184', 'dal palazzo delle Poste Italiane'),
                    [
                        new Sede(8, 'EUR', new Coordinate(41.8315918, 12.4666971), 'Distaccamento'),
                        new Sede(4, 'Ostiense', new Coordinate(41.8606045, 12.4730873), 'Distaccamento'),
                    ],
                    new Complessita('80', 0, 'Alta'),
                    null,
                    moment().subtract(30, 'minutes').toDate(),
                    moment().subtract(29, 'minutes').toDate(),
                    null,
                    null,
                    new Fonogramma(0, 'Non necessario'),
                    [
                        new Partenza(
                            [
                                new Mezzo('COD3',
                                    'AS1',
                                    'AS',
                                    'InRientro',
                                    0)
                            ],
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
                            ]
                        )
                    ],
                    null
                ),
                new RichiestaMarker(
                    'R5',
                    new Localita(
                        new Coordinate(41.8311007, 12.4683518), 'Viale Europa, 184', 'dal palazzo delle Poste Italiane'),
                    [
                        new Tipologia(360, 'Salvataggio persone', '')
                    ],
                    'Persona che minaccia di buttarsi da un tetto',
                    true,
                    4,
                    'sospeso'
                )
            ),
            new Richiesta(
                new SintesiRichiesta(
                    'R6',
                    'RM-24759',
                    new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X', 'CDXXH', 'password',
                        new Sede(1, 'Roma', new Coordinate(41.9004733, 12.4906652), 'Comando Provinciale')),
                    true,
                    moment().subtract(0, 'minutes').toDate(),
                    'chiamata',
                    5,
                    [new Tipologia(2, 'Incendio ed esplosione', 'fa fa-fire')],
                    'Esplosione nei pressi di un centro abitato',
                    new Richiedente('Alessandro Palletta', '3202676253'),
                    new Localita(new Coordinate(41.8624992, 12.5532867), 'Via Scribonio Curione, 22', 'nei pressi dell\'uscita della metro'),
                    [
                        new Sede(2, 'Tuscolano II', new Coordinate(41.8638843, 12.5522048), 'Distaccamento'),
                        new Sede(4, 'Ostiense', new Coordinate(41.8606045, 12.4730873), 'Distaccamento'),
                        new Sede(3, 'Tuscolana I', new Coordinate(41.8607859, 12.5226281), 'Distaccamento'),
                    ],
                    new Complessita('100', 0, 'Alto'),
                    null,
                    null,
                    null,
                    null,
                    null,
                    new Fonogramma(0, 'Non necessario'),
                    null,
                    null
                ),
                new RichiestaMarker(
                    'R6',
                    new Localita(
                        new Coordinate(41.8624992, 12.6532867),
                        'Via Scribonio Curione, 22', 'nei pressi dell\'uscita della metro'
                    ),
                    [
                        new Tipologia(2, 'Incendio ed esplosione', 'fa fa-fire')
                    ],
                    'Esplosione nei pressi di un centro abitato',
                    true,
                    5,
                    'chiamata'
                )
            ),
            new Richiesta(
                new SintesiRichiesta(
                    'R7',
                    'RM-24760',
                    new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X', 'CDXXH', 'password',
                        new Sede(1, 'Roma', new Coordinate(41.8549993, 12.5688578), 'Comando Provinciale')),
                    false,
                    moment().subtract(4, 'minutes').toDate(),
                    'assegnato',
                    3,
                    [new Tipologia(1, 'Incidente stradale generico', 'fa fa-car')],
                    'Incidente automobile ribaltata',
                    new Richiedente('Polizia', '113'),
                    new Localita(
                        new Coordinate(41.8531486, 12.5411702), 'Via Tuscolana, 1500', 'automobile ribaltata, persona anziana'),
                    [
                        new Sede(2, 'Tuscolano II', new Coordinate(41.8638843, 12.5522048), 'Distaccamento'),
                        new Sede(4, 'Ostiense', new Coordinate(41.8606045, 12.4730873), 'Distaccamento'),
                        new Sede(3, 'Tuscolana I', new Coordinate(41.8607859, 12.5226281), 'Distaccamento'),
                    ],
                    new Complessita('20', 0, 'Media'),
                    null,
                    moment().subtract(2, 'minutes').toDate(),
                    moment().subtract(1, 'minutes').toDate(),
                    null,
                    null,
                    new Fonogramma(0, 'Non necessario'),
                    null,
                    null
                ),
                new RichiestaMarker(
                    'R7',
                    new Localita(
                        new Coordinate(41.8549993, 12.5688578), 'Via Tuscolana, 1500', 'automobile ribaltata, persona anziana'),
                    [
                        new Tipologia(2, 'Incidente stradale generico', 'fa fa-car')
                    ],
                    'Incidente d\'auto persona anziana',
                    false,
                    3,
                    'assegnato'
                )
            ),
            new Richiesta(
                new SintesiRichiesta(
                    'R8',
                    'RM-24761',
                    new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X', 'CDXXH', 'password',
                        new Sede(1, 'Roma', new Coordinate(41.9161894, 12.4554147), 'Comando Provinciale')),
                    false,
                    moment().subtract(22, 'minutes').toDate(),
                    'chiamata',
                    1,
                    [new Tipologia(360, 'Messa in sicurezza impianti tecnologici di servizio (acqua, energia elettrica, gas)', '')],
                    'Scintille da palo elettrico',
                    new Richiedente('Rosalba Di Tonno', '062815692'),
                    new Localita(
                        new Coordinate(41.8607234, 12.555459), 'Viale Giuseppe Mazzini, 159', 'nelle vicinanze di un ristorante'),
                    [
                        new Sede(5, 'Prati', new Coordinate(41.9184282, 12.4635564), 'Distaccamento'),
                        new Sede(6, 'Monte Mario', new Coordinate(41.9186602, 12.4360771), 'Distaccamento'),
                    ],
                    new Complessita('20', 0, 'Media'),
                    null,
                    moment().subtract(16, 'minutes').toDate(),
                    moment().subtract(12, 'minutes').toDate(),
                    null,
                    null,
                    new Fonogramma(0, 'Non necessario'),
                    null,
                    null
                ),
                new RichiestaMarker(
                    'R8',
                    new Localita(
                        new Coordinate(41.9161894, 12.5554147), 'Viale Giuseppe Mazzini, 159', 'nelle vicinanze di un ristorante'),
                    [
                        new Tipologia(360, 'Messa in sicurezza impianti tecnologici di servizio (acqua, energia elettrica, gas)', '')
                    ],
                    'Scintille da palo elettrico',
                    false,
                    1,
                    'chiamata'
                )
            ),
            new Richiesta(
                new SintesiRichiesta(
                    'R9',
                    'RM-24762',
                    new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X', 'CDXXH', 'password',
                        new Sede(1, 'Roma', new Coordinate(41.9161894, 12.4554147), 'Comando Provinciale')),
                    false,
                    moment().subtract(25, 'minutes').toDate(),
                    'presidiato',
                    2,
                    [new Tipologia(360, 'Cedimento sede stradale', '')],
                    'Cedimento sede stradale con rimozione veicolo',
                    new Richiedente('Carabinieri', '112'),
                    new Localita(
                        new Coordinate(41.8932662, 12.5417044), 'Via di Portonaccio', 'incrocio con Via Prenestina'),
                    [
                        new Sede(7, 'La Rustica', new Coordinate(41.9073166, 12.5934988), 'Distaccamento'),
                        new Sede(2, 'Tuscolano II', new Coordinate(41.8638843, 12.5522048), 'Distaccamento'),
                        new Sede(3, 'Tuscolana I', new Coordinate(41.8607859, 12.5226281), 'Distaccamento'),
                    ],
                    new Complessita('20', 0, 'Media'),
                    null,
                    moment().subtract(18, 'minutes').toDate(),
                    moment().subtract(16, 'minutes').toDate(),
                    null,
                    null,
                    new Fonogramma(0, 'Non necessario'),
                    [
                        new Partenza(
                            [
                                new Mezzo('COD2',
                                    'AS1',
                                    'AS',
                                    'SulPosto',
                                    0)
                            ],
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
                            ]
                        )
                    ],
                    null
                ),
                new RichiestaMarker(
                    'R9',
                    new Localita(
                        new Coordinate(41.8932662, 12.6417044), 'Via di Portonaccio', 'incrocio con Via Prenestina'),
                    [
                        new Tipologia(360, 'Cedimento sede stradale', '')
                    ],
                    'Cedimento sede stradale con rimozione veicolo',
                    false,
                    2,
                    'presidiato'
                )
            ),
            new Richiesta(
                new SintesiRichiesta(
                    'R10',
                    'RM-24762',
                    new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X', 'CDXXH', 'password',
                        new Sede(1, 'Roma', new Coordinate(41.9161894, 12.4554147), 'Comando Provinciale')),
                    true,
                    moment().subtract(35, 'minutes').toDate(),
                    'sospeso',
                    4,
                    [new Tipologia(360, 'Salvataggio persone', '')],
                    'Persona che minaccia di buttarsi da un tetto',
                    new Richiedente('Carabinieri', '112'),
                    new Localita(
                        new Coordinate(41.8311007, 12.4683518), 'Viale Europa, 184', 'dal palazzo delle Poste Italiane'),
                    [
                        new Sede(8, 'EUR', new Coordinate(41.8315918, 12.4666971), 'Distaccamento'),
                        new Sede(4, 'Ostiense', new Coordinate(41.8606045, 12.4730873), 'Distaccamento'),
                    ],
                    new Complessita('80', 0, 'Alta'),
                    null,
                    moment().subtract(30, 'minutes').toDate(),
                    moment().subtract(29, 'minutes').toDate(),
                    null,
                    null,
                    new Fonogramma(0, 'Non necessario'),
                    [
                        new Partenza(
                            [
                                new Mezzo('COD3',
                                    'AS1',
                                    'AS',
                                    'InRientro',
                                    0)
                            ],
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
                            ]
                        )
                    ],
                    null
                ),
                new RichiestaMarker(
                    'R10',
                    new Localita(
                        new Coordinate(41.8311007, 12.5683518), 'Viale Europa, 184', 'dal palazzo delle Poste Italiane'),
                    [
                        new Tipologia(360, 'Salvataggio persone', '')
                    ],
                    'Persona che minaccia di buttarsi da un tetto',
                    true,
                    4,
                    'sospeso'
                )
            )
        ];

        return of(this.richieste);
    }

}
