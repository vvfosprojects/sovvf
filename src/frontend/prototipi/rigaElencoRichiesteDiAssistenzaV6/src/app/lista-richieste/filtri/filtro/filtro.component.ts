import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { VoceFiltro } from "./voce-filtro.model";

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss']
})
export class FiltroComponent implements OnInit {
  @Input() titolo: string;
  @Input() vociFiltro: VoceFiltro[];
  @Output() nuovaSelezione: EventEmitter<Object[]> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  public selezione(codice) {
    this.vociFiltro.find(vf => vf.codice === codice).selezionato = !this.vociFiltro.find(vf => vf.codice === codice).selezionato;
    /* console.log(this.vociFiltro.find(vf => vf.codice === codice).selezionato); */
    this.nuovaSelezione.emit(
      this.vociFiltro
        .filter(v => v.selezionato)
        .map(v => v.codice)
    );
  }
}
