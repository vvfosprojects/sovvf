import { Injectable } from '@angular/core';

import { ComponenteSquadra } from '../componente-squadra/componente-squadra.model';
import { Squadra } from '../squadra/squadra.model';
import { Mezzo } from '../mezzo/mezzo.model';
import { MezzoInPartenza } from '../mezzo-in-partenza/mezzo-in-partenza.model';
import { ComponenteInPartenza } from '../componente-in-partenza/componente-in-partenza.model';

@Injectable()
export class CompositoreService {
  private _mezziInPartenza: MezzoInPartenza[] = [];
  private _componentiSenzaMezzo: ComponenteInPartenza[] = [];

  constructor() {}

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

  /**
   * Aggiunge un mezzo alla composizione
   * @param mezzo Il modello del mezzo da aggiungere
   */
  public addMezzo(mezzo: Mezzo): MezzoInPartenza {
    let mezzoInPartenza = new MezzoInPartenza(mezzo, this);
    this._mezziInPartenza.unshift(mezzoInPartenza);
    mezzo.inPartenza = true;
    return mezzoInPartenza;
  }

  /**
   * Rimuove un mezzo in partenza dalla lista
   * @param mezzo Il mezzo da rimuovere
   */
  public removeMezzo(mezzo: MezzoInPartenza): void {
    mezzo.svuota();
    mezzo.mezzo.inPartenza = false;
    this._mezziInPartenza = this._mezziInPartenza.filter(m => m !== mezzo);
  }

  /**
   * Aggiunge ad una composizione un mezzo ed una squadra.
   * @param squadra La squadra da aggiungere
   * @param mezzo Il mezzo da aggiungere
   */
  public addSquadraEMezzo(squadra: Squadra, mezzo: Mezzo): void {
    let mezzoInPartenza = this.addMezzo(mezzo);
    mezzoInPartenza.addSquadra(squadra);
  }

  /**
   * Aggiunge una squadra ad un mezzo in partenza
   * @param squadra La squadra da aggiungere
   * @param mezzo Il mezzo in partenza al quale la squadra si aggiunge
   */
  public addSquadraAMezzo(squadra: Squadra, mezzo: MezzoInPartenza): void {
    mezzo.addSquadra(squadra);
  }
}
