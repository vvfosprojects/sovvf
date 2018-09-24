import { Injectable } from '@angular/core';
import { SintesiRichiesteService } from '../lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { of, Observable, Subject } from 'rxjs';
import * as moment from 'moment';

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

  onNewSRichiesteArray(): Observable<SintesiRichiesta[]> {
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
      'R10',
      'RM-23456',
      false,
      new Date(),
      null,
      'chiamata',
      3,
      [{ 'codice': 2, 'descrizione': 'Allagamento', 'icona': 'fa fa-exclamation-triangle' }],
      'Allagamento del secondo piano del condominio per rottura tubazione',
      'Mario Rossi',
      '06 41 42 342',
      { 'indirizzo': 'Piazza dell\'indipendenza, 40', 'coordinate': [12.502470, 41.904380] },
      [{ 'codice': 1, 'descrizione': 'Tuscolana', 'coordinate': [123, 256] }, {
        'codice': 2,
        'descrizione': 'Eur',
        'coordinate': [123, 256]
      }, { 'codice': 3, 'descrizione': 'Ostiense', 'coordinate': [123, 256] }],
      'Vicino pompa di benzina',
      ['Sisma'],
      moment().add(10, 'minutes').toDate(),
      '333444999',
      1,
      'Da inviare',
      133,
      0,
      'Alta',
      [],
      [],
      ['pagamento']
    );
    this.newRichiesta$.next(newRichiesta);
  }

  private updateRichiesta() {
    const newRichiesta = this.richieste[0];
    newRichiesta.rilevante = true;
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
