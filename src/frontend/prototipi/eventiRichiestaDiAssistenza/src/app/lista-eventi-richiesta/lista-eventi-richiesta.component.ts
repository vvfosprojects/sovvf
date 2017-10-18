import { Component, OnInit, Input } from '@angular/core';
import { EventoRichiesta } from '../evento-richiesta/evento-richiesta.model';

@Component({
  selector: 'app-lista-eventi-richiesta',
  templateUrl: './lista-eventi-richiesta.component.html',
  styleUrls: ['./lista-eventi-richiesta.component.css']
})
export class ListaEventiRichiestaComponent implements OnInit {
  @Input() elencoEventi : EventoRichiesta[];
  
  constructor() { }

  ngOnInit() {
  }

}
