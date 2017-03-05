import { Injectable } from '@angular/core';

import { ComponenteSquadra } from '../componente-squadra/componente-squadra.model';
import { Mezzo } from '../mezzo/mezzo.model';
import { MezzoInPartenza } from '../mezzo-in-partenza/mezzo-in-partenza.model';
import { ComponenteInPartenza } from '../componente-in-partenza/componente-in-partenza.model';

@Injectable()
export class CompositoreService {
  private _mezziInPartenza: MezzoInPartenza[] = [];
  private _componentiSenzaMezzo: ComponenteInPartenza[] = [];

  constructor() {
    this.addMezzo(new Mezzo("12345"));
    this.addMezzo(new Mezzo("54321"));
    this.addMezzo(new Mezzo("99999"));

    let cs = new ComponenteSquadra("Pippo", "XXX", false, true);
    let com = new ComponenteInPartenza(cs);
    this._mezziInPartenza[0].addAutista(com);
  }

  public get mezziInPartenza() {
    return this._mezziInPartenza;
  }

  public get personeSenzaMezzo() {
    return this._componentiSenzaMezzo;
  }

  /**
   * Sposta un componente nella lista dei componenti senza mezzo
   * @param oldIndex E' l'indice del componente da spostare
   * @param newIndex E' il nuovo indice acquisito dal componente dopo lo spostamento
   */
  public moveComponente(oldIndex: number, newIndex: number): void {
    var comps = this._componentiSenzaMezzo.splice(oldIndex, 1);
    this._componentiSenzaMezzo.splice(newIndex, 0, ...comps);
  }

  public addMezzo(mezzo: Mezzo): void {
    this._mezziInPartenza.unshift(new MezzoInPartenza(mezzo));
  }
}
