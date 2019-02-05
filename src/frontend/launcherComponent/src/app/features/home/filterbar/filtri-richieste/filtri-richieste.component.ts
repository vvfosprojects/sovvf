import { Component, OnInit, Input } from '@angular/core';
import { VoceFiltro } from './voce-filtro.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FiltriRichiesteState } from './store/states/filtri-richieste.state';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AddFiltroSelezionato, RemoveFiltroSelezionato, SetFiltroSelezionato, ResetFiltriSelezionati } from './store/actions/filtri-richieste.actions';

@Component({
  selector: 'app-filtri-richieste',
  templateUrl: './filtri-richieste.component.html',
  styleUrls: ['./filtri-richieste.component.css']
})
export class FiltriRichiesteComponent implements OnInit {
  @Select(FiltriRichiesteState.filtriTipologie) filtri$: Observable<VoceFiltro[]>;
  @Select(FiltriRichiesteState.filtriSelezionati) filtriSelezionati$: Observable<VoceFiltro[]>;
  filtri: VoceFiltro[];
  filtriSelezionati: VoceFiltro[];

  categorie: Array<String> = [];
  categoriaSelezionata = 'Presidiato';

  filtersSearch = { descrizione: '' };

  constructor(private store: Store,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.getFiltri();
    this.getFiltriSelezionati();
  }

  getFiltri() {
    this.filtri$.subscribe((filtri: VoceFiltro[]) => {
      this.filtri = filtri;
      this.setCategorie(this.filtri);
      // console.log('Filtri', this.filtri);
    });
  }

  getFiltriSelezionati() {
    this.filtriSelezionati$.subscribe((fS: VoceFiltro[]) => {
      this.filtriSelezionati = fS;
      // console.log('Filtri Selezionati', this.filtriSelezionati);
    });
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
    // console.log(this.categorie);
  }

  onSelezioneCategoria(categoria: any) {
    this.categoriaSelezionata = categoria;
    // console.log(this.categoriaSelezionata);
  }

  openFiltersModal(content: any) {
    this.filtersSearch = { descrizione: '' };
    this.modalService.open(content, { backdropClass: 'light-blue-backdrop', size: 'lg', centered: true });
  }

  onSelezioneFiltro(filtro: VoceFiltro) {
    this.store.dispatch(new SetFiltroSelezionato(filtro));
    this.store.dispatch(new AddFiltroSelezionato(filtro));
    // console.log('Selezionato');
  }

  onDeselezioneFiltro(filtro: VoceFiltro) {
    this.store.dispatch(new SetFiltroSelezionato(filtro));
    this.store.dispatch(new RemoveFiltroSelezionato(filtro));
    // console.log('Deselezionato');
  }

  eliminaFiltriAttivi() {
    this.store.dispatch(new ResetFiltriSelezionati());
    // console.log('reset filtri');
  }
}
