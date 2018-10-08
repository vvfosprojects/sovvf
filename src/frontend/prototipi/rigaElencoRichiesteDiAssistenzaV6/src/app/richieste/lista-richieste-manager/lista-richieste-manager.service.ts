import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { DispatcherFakeService } from '../dispatcher/dispatcher-fake.service';

@Injectable({
  providedIn: 'root'
})
export class ListaRichiesteManagerService {
  richieste: SintesiRichiesta[];

  constructor(private dispatcherFakeS: DispatcherFakeService) {
    this.dispatcherFakeS.onNewSRichiesta().subscribe(richiesta => {
      this.richieste.unshift(richiesta);
    });

    this.dispatcherFakeS.onDeleteSRichiesta().subscribe(richiesta => {
      this.richieste = this.richieste.filter(x => x.id === richiesta.id);
    });

    this.dispatcherFakeS.onUpdateSRichiesta().subscribe(richiesta => {
      this.richieste = this.richieste.map(r => r.id === richiesta.id ? richiesta : r);
    });
  }

  getData(): Observable<SintesiRichiesta[]> {
    this.dispatcherFakeS.onNewSRichiesteList().subscribe(richieste => {
      this.richieste = richieste;
    });
    return of(this.richieste);
  }

  nuoveRichieste() {
    let nuoveRichieste;
    this.dispatcherFakeS.onNewSRichiesteListScroll().subscribe(r => {
      nuoveRichieste = r;
    });
    return of(nuoveRichieste);
  }
}
