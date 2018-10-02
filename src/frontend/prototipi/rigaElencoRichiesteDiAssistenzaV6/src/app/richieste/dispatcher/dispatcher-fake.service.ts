import { Injectable } from '@angular/core';
import { SintesiRichiesteService } from '../lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service';
import { of, Observable, Subject } from 'rxjs';
import * as moment from 'moment';

import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { Operatore } from '../../shared/model/operatore.model';
import { Tipologia } from '../../shared/model/tipologia.model';
import { Richiedente } from '../../shared/model/richiedente.model';
import { Sede } from '../../shared/model/sede.model';
import { Localita } from '../../shared/model/localita.model';
import { Coordinate } from '../../shared/model/coordinate.model';
import { Complessita } from '../../shared/model/complessita.model';
import { Fonogramma } from '../../shared/model/fonogramma.model';
import { Partenza } from '../../shared/model/partenza.model';
import { Squadra } from '../../shared/model/squadra.model';

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
    setTimeout(() => {
      this.updateRichiesta();
    }, 5000);
    setTimeout(() => {
      this.deleteRichiesta();
    }, 9000);
  }

  onNewSRichiesteList(): Observable<SintesiRichiesta[]> {
    this.sintesiRichiesteService.getSintesiRichieste().subscribe((richieste: SintesiRichiesta[]) => {
      this.richieste = richieste;
    });
    return of(this.richieste);
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
      'RM-24760',
      new Operatore('Mario', 'Verdi', 'HGM3NS'),
      true,
      new Date,
      new Date,
      'presidiato',
      2,
      [new Tipologia(1, 'Allagamento', 'fa fa-exclamation-triangle')],
      'Allagamento cantina (Testing)',
      new Richiedente('Mario Rossi', 3202676253),
      new Localita(new Coordinate(2.324234, 3.424234), 'Via Cavour, 5', 'Note test'),
      [
        new Sede(1, 'Tuscolana', new Coordinate(3.423423, 4.423423), 'Comando'),
        new Sede(2, 'Ostiense', new Coordinate(3.423423, 4.423423), 'Comando'),
        new Sede(3, 'Tuscolana 2', new Coordinate(3.423423, 4.423423), 'Comando'),
      ],
      null,
      new Date, // incrementare di qualche minuto
      'NUE00347',
      new Fonogramma(1, 'Fonogramma Test'),
      new Complessita('Alto', 1, 'Descrizione Complessita test'),
      [
        new Partenza(
          [
          ],
          [
            new Squadra('Squadra1', new Date, null)
          ]
        ),
      ],
      ['Tag1', 'Tag2']
    );
    this.newRichiesta$.next(newRichiesta);
  }

  private updateRichiesta() {
    const newRichiesta = this.richieste[0];
    newRichiesta.rilevanza = true;
    setTimeout(() => {
      newRichiesta.stato = 'presidiato';
      newRichiesta.istantePresaInCarico = new Date();
      newRichiesta.istantePrimaAssegnazione = new Date();
    }, 3000);
    this.updateRichiesta$.next(newRichiesta);
  }

  private deleteRichiesta() {
    const newRichiesta = this.richieste[0];
    this.deleteRichiesta$.next(newRichiesta);
  }
}
