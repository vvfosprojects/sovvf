import { Component, OnInit, Input } from '@angular/core';
import { FiltriService } from '../lista-richieste-service/filtri-service/filtri-service.service';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { VoceFiltro } from '../filtri-richieste/voce-filtro.model';

@Component({
  selector: 'app-ricerca-richieste',
  templateUrl: './ricerca-richieste.component.html',
  styleUrls: ['./ricerca-richieste.component.scss']
})
export class RicercaRichiesteComponent implements OnInit {
  filtri: VoceFiltro[];
  searchText: string;
  filtriSelezionatiBySearch: VoceFiltro[] = [];
  arrCounters: Array<number> = [];

  constructor(private filtriS: FiltriService) { }

  ngOnInit() {
    this.getFiltri();
  }

  getFiltri() {
    this.filtriS.getFiltri().subscribe((filtri: VoceFiltro[]) => {
      this.filtri = filtri;
    });
  }

  addFiltroSelezionatoBySearch(filtro: VoceFiltro) {
    this.filtriSelezionatiBySearch.push(filtro);
  }

  getFiltriSelezionatiBySearch() {
    return this.filtriSelezionatiBySearch;
  }

  search() {
  }
}
