import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SintesiRichiesta } from "app/sintesi-richiesta/sintesi-richiesta.model";

@Component({
  selector: 'lista-richieste',
  templateUrl: './lista-richieste.component.html',
  styleUrls: ['./lista-richieste.component.css']
})
export class ListaRichiesteComponent implements OnInit {
  @Input() richieste: SintesiRichiesta[];
  @Output() showDettagli: EventEmitter<SintesiRichiesta> = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }

}
