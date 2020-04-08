import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { Intervento } from "./intervento.model";

@Injectable()
export class InterventiService {
  private interventi: Intervento[];
  private interventiObservable: BehaviorSubject<Intervento[]>;

  constructor() {
    this.interventi = this.getInterventiFake();
    this.interventiObservable = new BehaviorSubject<Intervento[]>(this.interventi);
  }

  public getInterventi(): Observable<Intervento[]> {
    return this.interventiObservable.asObservable();
  }

  public eliminaIntervento(codice: string): void {
    this.interventi = this.interventi.filter(i => i.codice !== codice);
    this.interventiObservable.next(this.interventi);
  }

  private getInterventiFake(): Intervento[] {
    return [
      new Intervento("322.434.212", "Incendio", "Via Cavour, 5", "Incendio in stanza 39 II piano", 0, 0),
      new Intervento("435.933.003", "Soccorso a persona", "Piazza Bologna, 1", "Persona dispersa da ieri", 0, 0),
      new Intervento("564.995.837", "Danni d'acqua", "Via Nomentana, 35", "Rottura tubazione al III piano", 0, 0),
      new Intervento("953.302.182", "Incendio", "Via Salaria, 12", "Incendio cassonetto", 0, 0),
      new Intervento("212.789.482", "Recupero aeromobile", "Piazza Cavour, 12", "Aeromobile telecomandato rotto", 0, 0),
      new Intervento("771.555.231", "Incidente stradale", "Via C. Colombo, 39", "Incidente tra due smart che parcheggiavano nell'unico posto disponibile", 0, 0),
    ];
  }
}
