import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-filtri-eventi-richiesta',
  templateUrl: './filtri-eventi-richiesta.component.html',
  styleUrls: ['./filtri-eventi-richiesta.component.css']
})
export class FiltriEventiRichiestaComponent implements OnInit {

  @Input() idRichiesta: string;

  constructor() { }

  ngOnInit() {
  }

}
