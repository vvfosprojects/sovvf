import { Injectable } from '@angular/core';

import { Squadra } from '../squadra/squadra.model';
import { ComponenteSquadra } from '../componente-squadra/componente-squadra.model';

@Injectable()
export class ListaSquadreService {
  private _squadre: Squadra[];

  constructor() {
    this._squadre = [
      new Squadra("Gialla", "EUR", [
        new ComponenteSquadra("Mario Grisi", "MRRGRS94T66H3332", true, false),
        new ComponenteSquadra("Michele Genta", "MGHYTT76T55R435E", false, true),
        new ComponenteSquadra("Antonio Falchini Moletti", "OOOGGG78Y66T454F", false, false),
        new ComponenteSquadra("Tonia Annamaria Facci", "LLLOOO98I98G656V", false, false),
        new ComponenteSquadra("Ugo Fantozzi", "KJHGFD45T62N343D", false, false)
      ]),
      new Squadra("Verde", "EUR", [
        new ComponenteSquadra("Duccio Corona", "MRRGRS94T66H3332", true, false),
        new ComponenteSquadra("Valentina Pezzoni", "GSPVGD76T55R435E", false, true),
        new ComponenteSquadra("Ciro Amato Ambrosio", "OPASGD78Y66T454F", false, true),
        new ComponenteSquadra("Sebastiano Carocci", "POAGSH98I98G656V", false, false),
        //new ComponenteSquadra("Celestino Bigi", "OPDFAG45T62N343D", false, false)
      ]),
      new Squadra("Rossa", "Trastevere", [
        new ComponenteSquadra("Ottavio Turco", "LKDTWH94T66H3332", true, false),
        new ComponenteSquadra("Daniele Mirra", "MKDFFH76T55R435E", false, true),
        new ComponenteSquadra("Mino Antonio Rettangolo", "OIDHFJ78Y66T454F", false, false),
        new ComponenteSquadra("Osvaldo Capozzi", "MKJFIR78I98G656V", false, false),
        new ComponenteSquadra("Sigismondo Ferrante", "LKAQRW45T62N343D", false, false)
      ]),
      new Squadra("Blu", "Tuscolano", [
        new ComponenteSquadra("Marina Carrisi", "MARCAR94T66H3332", true, false),
        new ComponenteSquadra("Mario Baldi", "MARBAL76T55R435E", false, true),
        new ComponenteSquadra("Giuseppe Bordoni", "GIUBOR78Y66T454F", false, false),
        new ComponenteSquadra("Giangiacomo Ginelli", "GIAGIN78I98G656V", false, true),
        new ComponenteSquadra("Mirko Ferraro", "MKKTGT78T62N343D", false, false)
      ])
    ];
  }

  get squadre(): Squadra[] {
    return this._squadre;
  }

  public impegnaMino(): void {
    this._squadre[2].componenti[2].impegna("Intervento 560.540.535", "H565");
  }

  public liberaMino(): void {
    this._squadre[2].componenti[2].disimpegna();
  }

  public minoInPartenza(): void {
    this._squadre[2].componenti[2].inPartenza = true;
  }

  public minoFuoriPartenza(): void {
    this._squadre[2].componenti[2].inPartenza = false;
  }
}
