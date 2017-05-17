import { Component, OnInit } from '@angular/core';

import { MezzoInServizio } from './mezzoinservizio.model';
import { MezzoInServizioService } from './mezzo-in-servizio.service';
import { DescStatoMap } from './desc-stato-map.class';

@Component({
  selector: 'app-mezzoinservizio',
  templateUrl: './mezzoinservizio.component.html',
  styleUrls: ['./mezzoinservizio.component.css']
})
export class MezzoinservizioComponent implements OnInit {
  private mapperDescStato = new DescStatoMap();
  private _mostraPersone: boolean = false;

  constructor(private mezzoInServizioService: MezzoInServizioService) { }

  ngOnInit() {
  }

  get fs(): MezzoInServizio {

    return this.mezzoInServizioService.Get();

  }

  private getDescrizioneStato(codice: string): string {
    return this.mapperDescStato.map(codice);
  }

  private setDisponibile(isSet: boolean): void {
    this.fs.Disponibile = isSet;
  }
  private setCodiceStato(isSet: string): void {
    this.fs.CodiceStato = isSet;
  }

  private numeroPersone(): number {
    return this.fs.personeSulMezzo.length;
  }

  public hideMostraPersone(): void {
    this._mostraPersone = !this._mostraPersone;
  }

  get mostraPersone(): boolean {
    return this._mostraPersone;
  }

}



