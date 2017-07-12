import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { VoceFiltro } from "app/filtro/voce-filtro.model";

@Component({
  selector: 'filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss']
})
export class FiltroComponent implements OnInit {
  @Input() titolo: string;
  @Input() vociFiltro: VoceFiltro[];
  @Output() nuovaSelezione: EventEmitter<Object[]> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public selezione(event, codice) {
    this.vociFiltro.find(vf => vf.codice === codice).selezionato = event.target.checked;
    this.nuovaSelezione.emit(
      this.vociFiltro
        .filter(v => v.selezionato)
        .map(v => v.codice)
    );
  }
}
