import { Component, OnInit, Input } from '@angular/core';
import { Evento } from './evento.model';

@Component({
  selector: 'app-evento-richiesta',
  templateUrl: './evento-richiesta.component.html',
  styleUrls: ['./evento-richiesta.component.css']
})
export class EventoRichiestaComponent implements OnInit {

  @Input() evento: Evento;

  constructor() {  }

  ngOnInit() {
  }

}
