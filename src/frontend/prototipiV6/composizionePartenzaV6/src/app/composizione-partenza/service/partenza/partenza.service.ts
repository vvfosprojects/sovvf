import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { ViewService } from 'src/app/filterbar/view-service/view-service.service';

@Injectable({
  providedIn: 'root'
})
export class PartenzaService {
  private richiestaNuovaPartenza$ = new Subject<SintesiRichiesta>();
  private compPartenzaMode = new Subject<any>();
  compPartenzaModeIniziale = 'slower';

  constructor(private viewService: ViewService) { }

  nuovaPartenza(richiesta) {
    this.richiestaNuovaPartenza$.next(richiesta);
    this.viewService.sendView({
      richieste: false,
      mappa: true,
      comp_partenza: true,
      split: true,
      chiamata: false,
    });
  }

  dismissPartenza() {
    this.viewService.sendView({
      richieste: true,
      mappa: true,
      comp_partenza: false,
      split: true,
      chiamata: false,
    });
  }

  getRichiestaPartenza(): Observable<any> {
    return this.richiestaNuovaPartenza$.asObservable();
  }

  changeCompPartenzaMode(newMode) {
    this.compPartenzaMode.next(newMode);
  }

  getCompPartenzaMode(): Observable<any> {
    return this.compPartenzaMode.asObservable();
  }
}
