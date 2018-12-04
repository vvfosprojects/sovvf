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
  private squadra$ = new Subject<Squadra[]>();
  squadreSelezionate: Squadra[] = [];

  private partenze$ = new Subject<BoxPartenza[]>();

  constructor() { }

  /* Mezzi */
  setMezzo(mezzo) {
    this.mezzo$.next(mezzo);
  }
  getMezzo(): Observable<any> {
    return this.mezzo$.asObservable();
  }
  clearMezzo() {
    this.mezzo$.next();
  }

  /* Squadre */
  setSquadra(squadra) {
    if (squadra) {
      this.squadreSelezionate.push(squadra);
      this.clearSquadra();
      this.squadra$.next(this.squadreSelezionate);
    }
  }
  getSquadra(): Observable<any> {
    return this.squadra$.asObservable();
  }
  clearSquadra() {
    this.squadra$.next();
  }
  clearSingleSquadra(squadra) {
    this.squadreSelezionate.forEach((ss: Squadra, index) => {
      if (squadra === ss) {
        console.log(squadra, index);
        this.squadreSelezionate.splice(index, 1);
      }
    });
    this.squadra$.next(this.squadreSelezionate);
  }

  /* Partenze */
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
