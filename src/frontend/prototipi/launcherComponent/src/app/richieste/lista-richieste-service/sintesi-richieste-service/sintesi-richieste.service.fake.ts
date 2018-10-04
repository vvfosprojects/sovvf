import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import * as moment from 'moment';

import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { Squadra } from '../../../shared/model/squadra.model';
import { Componente } from '../../../shared/model/componente.model';
import { Mezzo } from '../../../shared/model/mezzo.model';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { Richiedente } from '../../../shared/model/richiedente.model';
import { Localita } from '../../../shared/model/localita.model';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { Operatore } from '../../../shared/model/operatore.model';
import { Sede } from '../../../shared/model/sede.model';
import { Fonogramma } from '../../../shared/model/fonogramma.model';
import { Complessita } from '../../../shared/model/complessita.model';
import { Partenza } from '../../../shared/model/partenza.model';

@Injectable({
    providedIn: 'root'
})
export class SintesiRichiesteServiceFake {
    richieste: SintesiRichiesta[];
    constructor() {
    }

    public getSintesiRichieste(): Observable<SintesiRichiesta[]> {
        this.richieste = [
            new SintesiRichiesta(
                'R0',
                'RM-24759',
                new Operatore('Mario', 'Verdi', 'HGM3NS'),
                false,
                new Date,
                new Date,
                'presidiato',
                2,
                [new Tipologia(1, 'Allagamento', 'fa fa-exclamation-triangle')],
                'Allagamento cantina',
                new Richiedente('Mario Rossi', 3202676253),
                new Localita( new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
                [
                    new Sede(1, 'Tuscolana', new Coordinate(3.423423, 4.423423), 'Comando'),
                    new Sede(2, 'Ostiense', new Coordinate(3.423423, 4.423423), 'Comando'),
                    new Sede(3, 'Tuscolana 2', new Coordinate(3.423423, 4.423423), 'Comando'),
                ],
                null,
                new Date, // incrementare di qualche minuto
                'NUE00006',
                new Fonogramma(1, 'non inviato'),
                new Complessita('100', 0, 'Alto'),
                [
                    new Partenza(
                        [
                            new Mezzo('M1', 'A1', 'Autopompa', 'In viaggio', 1),
                        ],
                        [
                            new Squadra('Squadra1', new Date, null),
                        ]
                    ),
                ],
                ['Tag1', 'Tag2']
            ),
            new SintesiRichiesta(
                'R2',
                'RM-24759',
                new Operatore('Mario', 'Verdi', 'HGM3NS'),
                false,
                new Date,
                new Date,
                'presidiato',
                2,
                [new Tipologia(1, 'Allagamento', 'fa fa-exclamation-triangle')],
                'Allagamento cantina',
                new Richiedente('Mario Rossi', 3202676253),
                new Localita( new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
                [
                    new Sede(1, 'Tuscolana', new Coordinate(3.423423, 4.423423), 'Comando'),
                    new Sede(2, 'Ostiense', new Coordinate(3.423423, 4.423423), 'Comando'),
                    new Sede(3, 'Tuscolana 2', new Coordinate(3.423423, 4.423423), 'Comando'),
                ],
                null,
                new Date, // incrementare di qualche minuto
                'NUE00006',
                new Fonogramma(1, 'non inviato'),
                new Complessita('100', 0, 'Alto'),
                [
                    new Partenza(
                        [
                            new Mezzo('M1', 'A1', 'Autopompa', 'In viaggio', 1),
                        ],
                        [
                            new Squadra('Squadra1', new Date, null),
                        ]
                    ),
                ],
                ['Tag1', 'Tag2']
            ),
            new SintesiRichiesta(
                'R3',
                'RM-24759',
                new Operatore('Mario', 'Verdi', 'HGM3NS'),
                false,
                new Date,
                new Date,
                'presidiato',
                2,
                [new Tipologia(1, 'Allagamento', 'fa fa-exclamation-triangle')],
                'Allagamento cantina',
                new Richiedente('Mario Rossi', 3202676253),
                new Localita( new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
                [
                    new Sede(1, 'Tuscolana', new Coordinate(3.423423, 4.423423), 'Comando'),
                    new Sede(2, 'Ostiense', new Coordinate(3.423423, 4.423423), 'Comando'),
                    new Sede(3, 'Tuscolana 2', new Coordinate(3.423423, 4.423423), 'Comando'),
                ],
                null,
                new Date, // incrementare di qualche minuto
                'NUE00006',
                new Fonogramma(1, 'non inviato'),
                new Complessita('100', 0, 'Alto'),
                [
                    new Partenza(
                        [
                            new Mezzo('M1', 'A1', 'Autopompa', 'In viaggio', 1),
                        ],
                        [
                            new Squadra('Squadra1', new Date, null),
                        ]
                    ),
                ],
                ['Tag1', 'Tag2']
            ),
            new SintesiRichiesta(
                'R4',
                'RM-24759',
                new Operatore('Mario', 'Verdi', 'HGM3NS'),
                false,
                new Date,
                new Date,
                'presidiato',
                2,
                [new Tipologia(1, 'Allagamento', 'fa fa-exclamation-triangle')],
                'Allagamento cantina',
                new Richiedente('Mario Rossi', 3202676253),
                new Localita( new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
                [
                    new Sede(1, 'Tuscolana', new Coordinate(3.423423, 4.423423), 'Comando'),
                    new Sede(2, 'Ostiense', new Coordinate(3.423423, 4.423423), 'Comando'),
                    new Sede(3, 'Tuscolana 2', new Coordinate(3.423423, 4.423423), 'Comando'),
                ],
                null,
                new Date, // incrementare di qualche minuto
                'NUE00006',
                new Fonogramma(1, 'non inviato'),
                new Complessita('100', 0, 'Alto'),
                [
                    new Partenza(
                        [
                            new Mezzo('M1', 'A1', 'Autopompa', 'In viaggio', 1),
                        ],
                        [
                            new Squadra('Squadra1', new Date, null),
                        ]
                    ),
                ],
                ['Tag1', 'Tag2']
            ),
            new SintesiRichiesta(
                'R5',
                'RM-24759',
                new Operatore('Mario', 'Verdi', 'HGM3NS'),
                false,
                new Date,
                new Date,
                'presidiato',
                2,
                [new Tipologia(1, 'Allagamento', 'fa fa-exclamation-triangle')],
                'Allagamento cantina',
                new Richiedente('Mario Rossi', 3202676253),
                new Localita( new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
                [
                    new Sede(1, 'Tuscolana', new Coordinate(3.423423, 4.423423), 'Comando'),
                    new Sede(2, 'Ostiense', new Coordinate(3.423423, 4.423423), 'Comando'),
                    new Sede(3, 'Tuscolana 2', new Coordinate(3.423423, 4.423423), 'Comando'),
                ],
                null,
                new Date, // incrementare di qualche minuto
                'NUE00006',
                new Fonogramma(1, 'non inviato'),
                new Complessita('100', 0, 'Alto'),
                [
                    new Partenza(
                        [
                            new Mezzo('M1', 'A1', 'Autopompa', 'In viaggio', 1),
                        ],
                        [
                            new Squadra('Squadra1', new Date, null),
                        ]
                    ),
                ],
                ['Tag1', 'Tag2']
            ),
            new SintesiRichiesta(
                'R6',
                'RM-24759',
                new Operatore('Mario', 'Verdi', 'HGM3NS'),
                false,
                new Date,
                new Date,
                'presidiato',
                2,
                [new Tipologia(1, 'Allagamento', 'fa fa-exclamation-triangle')],
                'Allagamento cantina',
                new Richiedente('Mario Rossi', 3202676253),
                new Localita( new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
                [
                    new Sede(1, 'Tuscolana', new Coordinate(3.423423, 4.423423), 'Comando'),
                    new Sede(2, 'Ostiense', new Coordinate(3.423423, 4.423423), 'Comando'),
                    new Sede(3, 'Tuscolana 2', new Coordinate(3.423423, 4.423423), 'Comando'),
                ],
                null,
                new Date, // incrementare di qualche minuto
                'NUE00006',
                new Fonogramma(1, 'non inviato'),
                new Complessita('100', 0, 'Alto'),
                [
                    new Partenza(
                        [
                            new Mezzo('M1', 'A1', 'Autopompa', 'In viaggio', 1),
                        ],
                        [
                            new Squadra('Squadra1', new Date, null),
                        ]
                    ),
                ],
                ['Tag1', 'Tag2']
            ),
            new SintesiRichiesta(
                'R7',
                'RM-24759',
                new Operatore('Mario', 'Verdi', 'HGM3NS'),
                false,
                new Date,
                new Date,
                'presidiato',
                2,
                [new Tipologia(1, 'Allagamento', 'fa fa-exclamation-triangle')],
                'Allagamento cantina',
                new Richiedente('Mario Rossi', 3202676253),
                new Localita( new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
                [
                    new Sede(1, 'Tuscolana', new Coordinate(3.423423, 4.423423), 'Comando'),
                    new Sede(2, 'Ostiense', new Coordinate(3.423423, 4.423423), 'Comando'),
                    new Sede(3, 'Tuscolana 2', new Coordinate(3.423423, 4.423423), 'Comando'),
                ],
                null,
                new Date, // incrementare di qualche minuto
                'NUE00006',
                new Fonogramma(1, 'non inviato'),
                new Complessita('100', 0, 'Alto'),
                [
                    new Partenza(
                        [
                            new Mezzo('M1', 'A1', 'Autopompa', 'In viaggio', 1),
                        ],
                        [
                            new Squadra('Squadra1', new Date, null),
                        ]
                    ),
                ],
                ['Tag1', 'Tag2']
            )
        ];

        return of(this.richieste);
    }
}
