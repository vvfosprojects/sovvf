import { Injectable } from '@angular/core';
import { of, Observable, Subject } from 'rxjs';
import * as moment from 'moment';
import { Richiesta } from './richiesta.model';
import { RichiesteServiceFake } from '../service/richieste.service.fake';
import { SintesiRichiesta } from '../shared/model/sintesi-richiesta.model';
import { RichiestaMarker } from '../maps/maps-model/richiesta-marker.model';

@Injectable({
  providedIn: 'root'
})
export class DispatcherService {
  private updateRichiesta$ = new Subject<Richiesta>();
  private newRichiesta$ = new Subject<Richiesta>();
  private deleteRichiesta$ = new Subject<Richiesta>();

  richieste: Richiesta[];
  sRichieste: SintesiRichiesta[];
  mRichieste: RichiestaMarker[];

  constructor(private richiesteService: RichiesteServiceFake) {
    setTimeout(() => {
      this.newRichiesta();
    }, 5000);
  }

  onNewSintesiRichiesteList(): Observable<SintesiRichiesta[]> {
    this.richiesteService.getRichieste().subscribe((richieste: Richiesta[]) => {
      this.richieste = richieste;
    });
    this.sRichieste = this.richieste.map(r => r.sRichiesta);
    // console.log(this.sRichieste);
    return of(this.sRichieste);
  }

  onNewRichiesteMarkersList(): Observable<RichiestaMarker[]> {
    this.richiesteService.getRichieste().subscribe((richieste: Richiesta[]) => {
      this.richieste = richieste;
    });
    this.mRichieste = this.richieste.map(r => r.mRichiesta);
    // console.log(this.mRichieste);
    return of(this.mRichieste);
  }

  onNewRichiesta(): Observable<Richiesta> {
    return this.newRichiesta$;
  }

  onUpdateRichiesta(): Observable<Richiesta> {
    return this.updateRichiesta$;
  }

  onDeleteRichiesta(): Observable<Richiesta> {
    return this.deleteRichiesta$;
  }

  /* TESTING METHODS */
  newRichiesta() {
    /* const nuovaRichiesta = ...
    this.newRichiesta$.next(nuovaRichiesta); */
  }
}
