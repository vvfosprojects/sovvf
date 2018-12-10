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
  partenze: BoxPartenza[] = [];

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
      if (!this.checkSquadra(squadra)) {
        this.squadreSelezionate.push(squadra);
        this.squadra$.next(this.squadreSelezionate);
      }
    }
  }
  getSquadra(): Observable<any> {
    return this.squadra$.asObservable();
  }
  clearSquadra() {
    this.squadreSelezionate = [];
    this.squadra$.next(this.squadreSelezionate);
  }
  clearSingleSquadra(squadra) {
    this.squadreSelezionate.forEach((ss: Squadra, index) => {
      if (squadra === ss) {
        /* console.log(squadra, index); */
        this.squadreSelezionate.splice(index, 1);
      }
    });
    this.squadra$.next(this.squadreSelezionate);
  }
  checkSquadra(squadra) {
    let check = false;
    if (this.squadreSelezionate.length > 0) {
      this.squadreSelezionate.forEach(sS => {
        if (squadra === sS) {
          check = true;
        }
      });
    }
    return check;
  }

  /* Partenze */
  setPartenze(partenza) {
    if (partenza) {
      this.partenze.push(partenza);
      this.partenze$.next(this.partenze);
    }
  }
  getPartenze(): Observable<any> {
    return this.partenze$.asObservable();
  }
  clearPartenze() {
    this.partenze$.next();
  }
  clearSinglePartenza(partenza) {
    this.partenze.forEach((p: BoxPartenza, index) => {
      if (partenza === p) {
        console.log(partenza, index);
        this.partenze.splice(index, 1);
      }
    });
    this.partenze$.next(this.partenze);
  }
}
