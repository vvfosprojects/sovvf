import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DispatcherService } from '../../dispatcher/dispatcher.service';
import { Richiesta } from '../../shared/model/richiesta.model';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';

@Injectable({
  providedIn: 'root'
})
export class ListaRichiesteManagerService {
  richieste: SintesiRichiesta[];

  constructor(private dispatcherService: DispatcherService) {

    this.dispatcherService.onNewSRichiesteList().subscribe((richieste: SintesiRichiesta[]) => {
      console.log(richieste);
      this.richieste = richieste;
    });

    /* this.dispatcherService.onNewRichiesta().subscribe(richiesta => {
      this.richieste.unshift(richiesta.sRichiesta);
    });

    this.dispatcherService.onDeleteRichiesta().subscribe(richiesta => {
      this.richieste = this.richieste.filter(x => x.id === richiesta.id);
    });

    this.dispatcherService.onUpdateRichiesta().subscribe(richiesta => {
      this.richieste = this.richieste.map(r => r.id === richiesta.id ? richiesta : r);
    }); */
  }

  getData(): Observable<SintesiRichiesta[]> {
    return of(this.richieste);
  }
}
