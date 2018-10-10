import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

// Models
import {Richiesta} from '../dispatcher/richiesta.model';
import {SintesiRichiesta} from '../shared/model/sintesi-richiesta.model';
import {Operatore} from '../shared/model/operatore.model';
import {Tipologia} from '../shared/model/tipologia.model';
import {Richiedente} from '../shared/model/richiedente.model';
import {Localita} from '../shared/model/localita.model';
import {Coordinate} from '../shared/model/coordinate.model';
import {Sede} from '../shared/model/sede.model';
import {Complessita} from '../shared/model/complessita.model';
import {Partenza} from '../shared/model/partenza.model';
import {Mezzo} from '../shared/model/mezzo.model';
import {Fonogramma} from '../shared/model/fonogramma.model';
import {Squadra} from '../shared/model/squadra.model';
import {RichiestaMarker} from '../maps/maps-model/richiesta-marker.model';

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
                    'R1',
                    'RM-24759',
                    new Operatore('mario.rossi.76', 'Mario', 'Rossi', 'RSSMRA67A01H501X', 'CDXXH', 'password', new Sede(1, 'Tuscolana', new Coordinate(3.423423, 4.423423), 'Comando')),
                    false,
                    moment().subtract(59, 'minutes').toDate(),
                    moment().subtract(60, 'minutes').toDate(),
                    'chiamata',
                    5,
                    [new Tipologia(1, 'Esplosione', '')],
                    'Esplosione nei pressi di un centro abitato',
                    new Richiedente('Mario Rossi', 3202676253),
                    new Localita(new Coordinate(41.8624992, 12.5532867), 'Via Scribonio Curione, 22', 'nei pressi dell\'uscita della metro'),
                    [
                        new Sede(1, 'Tuscolana', new Coordinate(3.423423, 4.423423), 'Comando'),
                        new Sede(2, 'Ostiense', new Coordinate(3.423423, 4.423423), 'Comando'),
                        new Sede(3, 'Tuscolana 2', new Coordinate(3.423423, 4.423423), 'Comando'),
                    ],
                    new Fonogramma(1, 'non inviato'),
                    new Complessita('100', 0, 'Alto'),
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                ),
                new RichiestaMarker(
                    'R1',
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
