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
                'RM-022',
                'RM-022',
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
                null,
                null,
                null,
                new Fonogramma('0', 'Non necessario'),
                null,
                null
            )
        ];

        return of(this.richieste);
    }

}
