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
    dbRichieste: SintesiRichiesta[];
    richieste: SintesiRichiesta[] = [];
    id_ultimaRichiesta = 21;

    constructor() {
        this.dbRichieste = [
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                'R8',
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                'R9',
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                'R10',
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                'R11',
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                'R12',
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                'R13',
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                'R14',
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                'R15',
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                'R16',
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                'R17',
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                'R18',
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                'R19',
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                'R20',
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
                'R21',
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
                new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
    }

    public getSintesiRichieste(): Observable<SintesiRichiesta[]> {
        if (this.richieste.length === 0) {
            this.richieste = this.dbRichieste;
        }
        return of(this.richieste);
    }

    nuoveRichieste(): Array<any> {
        console.log('Nuove richieste');
        const nuoveRichieste = [];
        for (let i = 0; i < 7; i++) {
            const id = this.id_ultimaRichiesta + 1;
            nuoveRichieste.push(
                new SintesiRichiesta(
                    'R' + id,
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
                    new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
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
            );
            this.id_ultimaRichiesta++;
        }
        return nuoveRichieste;
    }
}
