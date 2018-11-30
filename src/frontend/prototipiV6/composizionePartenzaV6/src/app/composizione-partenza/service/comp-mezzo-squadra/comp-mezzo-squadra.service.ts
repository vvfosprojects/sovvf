import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

// Model
import { Squadra } from 'src/app/shared/model/squadra.model';
import { MezzoComposizione } from '../../model/mezzo-composizione.model';
import { BoxPartenza } from '../../model/box-partenza.model';

@Injectable({
  providedIn: 'root'
})
export class CompMezzoSquadraService {
  private mezzo$ = new Subject<MezzoComposizione>();
  private squadra$ = new Subject<Squadra>();
  private partenze$ = new Subject<BoxPartenza[]>();

  constructor() { }

  setMezzo(mezzo) {
    this.mezzo$.next(mezzo);
  }
  getMezzo(): Observable<any> {
    return this.mezzo$.asObservable();
  }
  clearMezzo() {
    this.mezzo$.next();
  }

  setSquadra(squadra) {
    this.squadra$.next(squadra);
  }
  getSquadra(): Observable<any> {
    return this.squadra$.asObservable();
  }
  clearSquadra() {
    this.squadra$.next();
  }

  setPartenze(partenze) {
    this.partenze$.next(partenze);
  }
  getPartenze(): Observable<any> {
    return this.partenze$.asObservable();
  }
  clearPartenze() {
    this.partenze$.next();
  }
}
