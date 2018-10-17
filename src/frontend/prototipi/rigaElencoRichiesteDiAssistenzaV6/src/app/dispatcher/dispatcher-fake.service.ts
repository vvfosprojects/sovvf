import { Injectable } from '@angular/core';
import { SintesiRichiesteService } from './data/sintesi-richieste-service/sintesi-richieste.service';
import { of, Observable, Subject } from 'rxjs';
import * as moment from 'moment';

import { SintesiRichiesta } from '../shared/model/sintesi-richiesta.model';
import { Operatore } from '../shared/model/operatore.model';
import { Tipologia } from '../shared/model/tipologia.model';
import { Richiedente } from '../shared/model/richiedente.model';
import { Sede } from '../shared/model/sede.model';
import { Localita } from '../shared/model/localita.model';
import { Coordinate } from '../shared/model/coordinate.model';
import { Complessita } from '../shared/model/complessita.model';
import { Fonogramma } from '../shared/model/fonogramma.model';
import { Partenza } from '../shared/model/partenza.model';
import { Squadra } from '../shared/model/squadra.model';
import { Mezzo } from '../shared/model/mezzo.model';

@Injectable({
  providedIn: 'root'
})
export class DispatcherFakeService {
  private updateRichiesta$ = new Subject<SintesiRichiesta>();
  private newRichiesta$ = new Subject<SintesiRichiesta>();
  private deleteRichiesta$ = new Subject<SintesiRichiesta>();

  richieste: SintesiRichiesta[];

  constructor(private sintesiRichiesteService: SintesiRichiesteService) {
    setTimeout(() => {
      this.addRichiesta();
    }, 3000);
  }

  onNewSRichiesteList(): Observable<SintesiRichiesta[]> {
    this.sintesiRichiesteService.getSintesiRichieste().subscribe((richieste: SintesiRichiesta[]) => {
      this.richieste = richieste;
    });
    return of(this.richieste);
  }

  onNewSRichiesteListScroll(): Observable<SintesiRichiesta[]> {
    const nuoveRichieste = this.sintesiRichiesteService.nuoveRichieste();
    return of(nuoveRichieste);
  }

  onNewSRichiesta(): Observable<SintesiRichiesta> {
    return this.newRichiesta$;
  }

  onUpdateSRichiesta(): Observable<SintesiRichiesta> {
    return this.updateRichiesta$;
  }

  onDeleteSRichiesta(): Observable<SintesiRichiesta> {
    return this.deleteRichiesta$;
  }

  /* TESTING METHODS */
  private addRichiesta() {
    const newRichiesta = new SintesiRichiesta(
        'R1',
        'RM-24759',
        new Operatore('Mario76', 'Mario', 'Rossi', 'RSSMRA67A01H501X'),
        new Date,
        'chiamata',
        2,
        [new Tipologia('1', 'Allagamento', 'fa fa-exclamation-triangle')],
        'Allagamento cantina',
        new Richiedente('Mario Rossi', '3202676253'),
        new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
        [
            new Sede('1', 'Tuscolana', new Coordinate(3.423423, 4.423423), 'Comando'),
            new Sede('2', 'Ostiense', new Coordinate(3.423423, 4.423423), 'Comando'),
            new Sede('3', 'Tuscolana 2', new Coordinate(3.423423, 4.423423), 'Comando'),
        ],
        new Complessita('100', 'Alto'),
        new Date, // incrementare di qualche minuto
        new Date,
        new Date,
        'NUE00006',
        null,
        new Fonogramma('1', 'non inviato'),
        [
            new Partenza(
                [
                    new Mezzo('M1', 'A1', 'Autopompa', 'In viaggio', 1),
                ],
                [
                    new Squadra('Squadra1', 'Stato', null, new Date),
                ]
            ),
        ],
        ['Tag1', 'Tag2']
    );
    this.newRichiesta$.next(newRichiesta);
  }
}
