import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VoceFiltro } from './voce-filtro.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filtri-richieste',
  templateUrl: './filtri-richieste.component.html',
  styleUrls: ['./filtri-richieste.component.css']
})
export class FiltriRichiesteComponent implements OnInit {
  @Input() filtri: VoceFiltro[];
  @Input() filtriSelezionati: VoceFiltro[];

  // Events
  @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
  @Output() filtroDeselezionato: EventEmitter<VoceFiltro> = new EventEmitter();
  @Output() filtriReset: EventEmitter<any> = new EventEmitter();

  categorie: Array<String> = [];
  categoriaSelezionata = 'Presidiato';
  filtersSearch = { descrizione: '' };

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    this.setCategorie(this.filtri);
  }

  setCategorie(filtri: VoceFiltro[]) {
    let count = -1;
    filtri.forEach(filtro => {
      if (this.categorie) {
        count = this.categorie.indexOf(filtro.categoria);
      }
      if (count <= -1) {
        this.categorie.push(filtro.categoria);
      }
    });
  }

  onSelezioneCategoria(categoria: any) {
    this.categoriaSelezionata = categoria;
  }

  openFiltersModal(content: any) {
    this.filtersSearch = { descrizione: '' };
    this.modalService.open(content, { backdropClass: 'light-blue-backdrop', size: 'lg', centered: true });
  }

  onSelezioneFiltro(filtro: VoceFiltro) {
    this.filtroSelezionato.emit(filtro);
  }

  onDeselezioneFiltro(filtro: VoceFiltro) {
    this.filtroDeselezionato.emit(filtro);
  }

  eliminaFiltriAttivi() {
    this.filtriReset.emit();
  }
}
