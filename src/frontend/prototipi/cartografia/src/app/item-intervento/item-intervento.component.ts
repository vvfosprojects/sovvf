import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Intervento } from "../interventi/intervento.model";

@Component({
  selector: 'app-item-intervento',
  templateUrl: './item-intervento.component.html',
  styleUrls: ['./item-intervento.component.css']
})
export class ItemInterventoComponent implements OnInit {
  @Input() intervento: Intervento;
  @Output() eliminaIntervento = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  private clickEliminaIntervento() {
    this.eliminaIntervento.emit(this.intervento.codice);
  }
}
