import { Component, OnInit, Input } from '@angular/core';
import { FiltriService } from '../filtri-richieste/filtri-service/filtri-service.service';
import { VoceFiltro } from '../filtri-richieste/voce-filtro.model';
import { RicercaRichiesteService } from './ricerca-richieste-service/ricerca-richieste.service';

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

  constructor(public ricercaS: RicercaRichiesteService, private filtriS: FiltriService) { }

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
