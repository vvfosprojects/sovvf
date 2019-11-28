import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { VoceFiltro } from '../filtri-richieste/voce-filtro.model';
import { CategoriaFiltriSchedeContatto as Categoria } from 'src/app/shared/enum/categoria-filtri-schede-contatto';

@Component({
  selector: 'app-filtri-schede-contatto',
  templateUrl: './filtri-schede-contatto.component.html',
  styleUrls: [ './filtri-schede-contatto.component.css' ]
})
export class FiltriSchedeContattoComponent implements OnInit {

  @HostBinding('class') classes = 'input-group-append';

  @Input() filtri: VoceFiltro[];
  @Input() filtriSelezionati: VoceFiltro[];

  @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
  @Output() filtriReset: EventEmitter<any> = new EventEmitter();

  Categoria = Categoria;

  constructor() {
  }

  ngOnInit() {
  }


  onSelezioneFiltro(filtro: VoceFiltro) {
    this.filtroSelezionato.emit(filtro);
  }

  eliminaFiltriAttivi() {
    this.filtriReset.emit();
  }

}
