import { Component, OnInit } from '@angular/core';

import { Intervento } from "../interventi/intervento.model";
import { InterventiService } from "../interventi/interventi.service";

@Component({
  selector: 'app-lista-interventi',
  templateUrl: './lista-interventi.component.html',
  styleUrls: ['./lista-interventi.component.css']
})
export class ListaInterventiComponent implements OnInit {
  private interventi: Intervento[];

  constructor(private interventiService: InterventiService) { }

  ngOnInit() {
    this.interventiService.getInterventi()
      .subscribe(lista => this.interventi = lista);
  }

  private handleEliminaIntervento(codice) {
    console.log("Eliminazione intervento", codice);
    this.interventiService.eliminaIntervento(codice);
  }

}
