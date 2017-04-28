import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { Intervento } from "./intervento.model";

@Injectable()
export class InterventiService {
  private interventi: Intervento[] = [
    new Intervento("322.434.212", "Incendio", "Via Cavour, 5", "Incendio in stanza 39 II piano", 0, 0),
    new Intervento("435.933.003", "Soccorso a persona", "Piazza Bologna, 1", "Persona dispersa da ieri", 0, 0),
    new Intervento("564.995.837", "Danni d'acqua", "Via Nomentana, 35", "Rottura tubazione al III piano", 0, 0),
    new Intervento("953.302.182", "Incendio", "Via Salaria, 12", "Incendio cassonetto", 0, 0),
    new Intervento("212.789.482", "Recupero aeromobile", "Piazza Cavour, 12", "Aeromobile telecomandato rotto", 0, 0),
    new Intervento("771.555.231", "Incidente stradale", "Via C. Colombo, 39", "Incidente tra due smart che parcheggiavano nell'unico posto disponibile", 0, 0),
  ];
  constructor() { }

  public getInterventi(): Observable<Intervento[]> {
    return Observable.of(this.interventi);
  }

  public eliminaIntervento(codice: string): void {
    this.interventi = this.interventi.filter(i => i.codice != codice);
  }
}
