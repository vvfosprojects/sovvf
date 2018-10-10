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
import { Mezzo } from '../../shared/model/mezzo.model';

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
      );
    this.newRichiesta$.next(newRichiesta);
  }
}
