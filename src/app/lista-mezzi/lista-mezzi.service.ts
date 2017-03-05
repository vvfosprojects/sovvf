import { Injectable } from '@angular/core';

import { Mezzo } from '../mezzo/mezzo.model';

@Injectable()
export class ListaMezziService {
  private _mezzi: Mezzo[];
  constructor() { 
    this._mezzi = [
      new Mezzo("APS 14335"),
      new Mezzo("APS 32131"),
      new Mezzo("APS 24196"),
      new Mezzo("AS 31840"),
      new Mezzo("AS 27591"),
      new Mezzo("ABP 38514"),
      new Mezzo("ABP 41328"),
    ];
  }

  public get mezzi() {
    return this._mezzi;
  }

  public impegnaAPS() {
    this._mezzi[0].impegna("Intervento 337.776.443", "XYZ");
  }

  public disimpegnaAPS() {
    this._mezzi[0].disimpegna();
  }

  public APSInPartenza() {
    this._mezzi[0].inPartenza = true;
  }

  public APSFuoriPartenza() {
    this._mezzi[0].inPartenza = false;
  }
}
