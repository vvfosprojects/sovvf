import { Component, OnInit, Input } from '@angular/core';

import { MezzoInServizio } from './mezzoinservizio.model';
import { DescStatoMap } from './desc-stato-map.class';

@Component({
  selector: 'app-mezzoinservizio',
  templateUrl: './mezzoinservizio.component.html',
  styleUrls: ['./mezzoinservizio.component.css']
})
export class MezzoinservizioComponent implements OnInit {
  private mapperDescStato = new DescStatoMap();
  private _mostraPersone: boolean = false;
  @Input() mezzo: MezzoInServizio;

  constructor() { }

  ngOnInit() {
  }

  get fs(): MezzoInServizio {

    return this.mezzo;

  }

  public getDescrizioneStato(codice: string): string {
    return this.mapperDescStato.map(codice);
  }

  setDisponibile(isSet: boolean): void {
    this.fs.disponibile = isSet;
  }
  setCodiceStato(isSet: string): void {
    this.fs.codiceStato = isSet;
  }

  numeroPersone(): number {
    return !!this.fs.personeSulMezzo && this.fs.personeSulMezzo.length;
  }

  hideMostraPersone(): void {
    this._mostraPersone = !this._mostraPersone;
  }

  get mostraPersone(): boolean {
    return this._mostraPersone;
  }

}



