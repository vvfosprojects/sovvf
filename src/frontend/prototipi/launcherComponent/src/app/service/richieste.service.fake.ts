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
                    'R9',
                    'RM-24759',
                    new Operatore('Mario76', 'Mario', 'Rossi', 'RSSMRA67A01H501X', 'CDXXH', 'password', new Sede(null, null, null, null)),
                    false,
                    new Date,
                    new Date,
                    'presidiato',
                    2,
                    [new Tipologia(1, 'Allagamento', '')],
                    'Allagamento cantina per rottura tubatura',
                    new Richiedente('Mario Rossi', 3202676253),
                    new Localita(new Coordinate(41.903567, 12.500859), 'Via Cavour, 5', 'Note test'),
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
                                new Squadra('Squadra1', 'Stato', new Date, null),
                            ]
                        ),
                    ],
                    ['Tag1', 'Tag2'],
                ),
                new RichiestaMarker(
                    'R9',
                    new Localita(
                        new Coordinate(41.903567, 12.500859),
                        'Via Cavour, 5',
                    ),
                    [
                        new Tipologia(1, 'allagamento', '')
                    ],
                    'Allagamento cantina per rottura tubatura',
                    false,
                    3,
                    'presidiato'
                )
            )
        ];

        return of(this.richieste);
    }

}
