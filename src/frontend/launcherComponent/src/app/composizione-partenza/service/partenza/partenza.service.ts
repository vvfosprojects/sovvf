import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { FilterbarService } from 'src/app/filterbar/filterbar-service/filterbar-service.service';

@Injectable({
  providedIn: 'root'
})
export class PartenzaService {
  private richiestaNuovaPartenza$ = new Subject<SintesiRichiesta>();
  private viewMode$ = new Subject<any>();

  constructor(private viewService: FilterbarService) { }

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

  changeViewMode(newMode) {
    this.viewMode$.next(newMode);
  }

  getViewMode(): Observable<any> {
    return this.viewMode$.asObservable();
  }
}
