import { Component, OnInit, Input } from '@angular/core';
import { VoceFiltro } from './voce-filtro.model';
import { FiltriService } from '../lista-richieste-service/filtri-service/filtri-service.service';

@Component({
  selector: 'app-filtri-richieste',
  templateUrl: './filtri-richieste.component.html',
  styleUrls: ['./filtri-richieste.component.css']
})
export class FiltriRichiesteComponent implements OnInit {
  filtri: VoceFiltro[] = [];
  filtriSelezionati: VoceFiltro[];
  filtriAttivi = 0;

  constructor(private filtriS: FiltriService) { }

  ngOnInit() {
    this.getFiltriTipologia();
    this.getFiltriSelezionati();
  }

  getFiltriTipologia() {
    this.filtriS.getTipologie().subscribe((filtri: VoceFiltro[]) => {
      filtri.forEach(filtro => {
        this.filtri.push(filtro);
      });
    });
  }

  getFiltriSelezionati() {
    this.filtriS.getFiltriSelezionati().subscribe((filtri: VoceFiltro[]) => {
      this.filtriSelezionati = filtri;
    });
  }

  selezione(filtro) {
    this.filtriS.filtroSelezionato(filtro);
    /* TEST console.log('Selezione inviata al service:');
    console.log(filtro);
    console.log('Sono di nuovo io, ecco il nuovo filtriSelezionati del component:');
    console.log(this.filtriSelezionati); */
  }

  deselezione(filtro) {
    this.filtriS.filtroDeselezione(filtro);
  }

  eliminaFiltriAttivi() {
    this.filtri.forEach(filtro => {
      if (filtro.selezionato === true) {
        this.deselezione(filtro);
      }
    });
    this.filtriAttivi = 0;
  }
}
