import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

// Model
import { Mezzo } from 'src/app/shared/model/mezzo.model';
import { Squadra } from 'src/app/shared/model/squadra.model';
import { MezzoComposizione } from '../../model/mezzo-composizione.model';

@Injectable({
  providedIn: 'root'
})
export class CompMezzoSquadraService {
  private mezzo$ = new Subject<MezzoComposizione>();
  private squadra$ = new Subject<Squadra>();

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
}
