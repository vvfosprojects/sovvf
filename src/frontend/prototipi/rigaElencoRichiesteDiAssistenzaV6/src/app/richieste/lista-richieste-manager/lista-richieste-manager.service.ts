import { Injectable, OnInit } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { DispatcherFakeService } from '../dispatcher/dispatcher-fake.service';

@Injectable({
  providedIn: 'root'
})
export class ListaRichiesteManagerService {
  richieste: SintesiRichiesta[];

  constructor(private dispatcherFakeS: DispatcherFakeService) {

    this.dispatcherFakeS.onNewSRichiesteArray().subscribe(richieste => {
      this.richieste = richieste;
    });

    this.dispatcherFakeS.onNewSRichiesta().subscribe(richiesta => {
      this.richieste.unshift(richiesta);
    });

    this.dispatcherFakeS.onDeleteSRichiesta().subscribe(richiesta => {
      /* const index = this.richieste.indexOf(richiesta);
      this.richieste = this.richieste.splice(index, 1); */
      this.richieste = this.richieste.filter(x => x.id === richiesta.id);
    });

    this.dispatcherFakeS.onUpdateSRichiesta().subscribe(richiesta => {
      this.richieste = this.richieste.map(r => r.id === richiesta.id ? richiesta : r);
    });
  }

  getData(): Observable<SintesiRichiesta[]> {
    return of(this.richieste);
  }
}
