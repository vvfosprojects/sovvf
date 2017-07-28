import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FiltriRichieste } from "app/comp-filtri/filtri-richieste.model";

@Component({
  selector: 'app-comp-filtri',
  templateUrl: './comp-filtri.component.html',
  styleUrls: ['./comp-filtri.component.css']
})
export class CompFiltriComponent implements OnInit {
  @Input() chiaveDiRicerca: string;
  @Output() nuovoIntervento = new EventEmitter();
  @Output() nuovoFiltro: EventEmitter<FiltriRichieste> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
