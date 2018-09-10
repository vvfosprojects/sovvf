import { Component, OnInit, Input } from '@angular/core';
import { VoceFiltro } from './voce-filtro.model';
import { FiltriService } from '../lista-richieste-service/filtri-service/filtri-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filtri-richieste',
  templateUrl: './filtri-richieste.component.html',
  styleUrls: ['./filtri-richieste.component.css']
})
export class FiltriRichiesteComponent implements OnInit {
  filtri: VoceFiltro[];
  filtersSearch = { descrizione: '' };

  constructor(public filtriS: FiltriService, private modalService: NgbModal) { }

  open(content) {
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop', size: 'lg'});
  }

  ngOnInit() {
    this.getFiltri();
  }

  getFiltri() {
    this.filtriS.getFiltri().subscribe((filtri: VoceFiltro[]) => {
      this.filtri = filtri;
    });
  }

  selezione(filtro) {
    this.filtriS.setfiltroSelezionati(filtro);
    /* TEST console.log('Selezione inviata al service:');
    console.log(filtro);
    console.log('Sono di nuovo io, ecco il nuovo filtriSelezionati del component:');
    console.log(this.filtriSelezionati); */
  }

  eliminaFiltriAttivi() {
    this.filtri.forEach(filtro => {
      filtro.selezionato = false;
    });
    this.filtriS.deleteFiltriSelezionati();
  }
}
