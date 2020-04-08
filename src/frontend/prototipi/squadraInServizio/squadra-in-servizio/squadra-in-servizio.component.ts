import { Component, OnInit } from '@angular/core';

import { SquadraInServizio } from './squadrainservizio.model';
import { SquadraInServizioService } from './squadra-in-servizio.service';
import { DescStatoMap } from './desc-stato-map.class';

@Component({
  selector: 'app-squadrainservizio',
  templateUrl: './squadra-in-servizio.component.html',
  styleUrls: ['./squadra-in-servizio.component.css']
})
export class SquadraInServizioComponent implements OnInit {
  private mapperDescStato = new DescStatoMap();
  constructor(private squadraInServizioService: SquadraInServizioService) { }

  ngOnInit() {
  }

  get fs(): SquadraInServizio {

    return this.squadraInServizioService.Get();

  }

  private getDescrizioneStato(codice: string): string {
    return this.mapperDescStato.map(codice);
  }

 /* private setDisponibile(isSet: boolean): void {
    this.fs.Disponibile = isSet;
  } */
 private setCodiceStato(isSet: string): void {
    this.fs.CodiceStato = isSet;
  }
 
  private numeroPersone(): number {
    return this.fs.personeDellaSquadra.length;
  }

}



