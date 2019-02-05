import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { VoceFiltro } from '../../../../../shared/model/voce-filtro.model';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent implements OnInit {
  @Input() filtro: VoceFiltro;
  @Output() filtroSelezionato: EventEmitter<any> = new EventEmitter();
  @Output() filtroDeselezionato: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSelezione(filtro: VoceFiltro) {
    if (!filtro.selezionato) {
      this.filtroSelezionato.emit(filtro);
    } else {
      this.filtroDeselezionato.emit(filtro);
    }
  }

}
