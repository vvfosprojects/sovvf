import { Component, OnInit, Input } from '@angular/core';
import { Evento } from '../evento-richiesta/evento.model';

@Component({
  selector: 'app-lista-eventi-richiesta',
  templateUrl: './lista-eventi-richiesta.component.html',
  styleUrls: ['./lista-eventi-richiesta.component.css']
})
export class ListaEventiRichiestaComponent implements OnInit {
  @Input() elencoEventi : Evento[];

  constructor() { }

  ngOnInit() {
  }

}
