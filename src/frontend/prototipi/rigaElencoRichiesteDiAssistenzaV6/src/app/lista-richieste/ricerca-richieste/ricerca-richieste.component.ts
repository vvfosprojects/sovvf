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
  filtriSelezionati: VoceFiltro[];
  text: string;

  constructor(private filtriS: FiltriService) { }

  ngOnInit() {
    this.getFiltri();
    this.getFiltriSelezionati();
  }

  getFiltri() {
    this.filtriS.getFiltri().subscribe((filtri: VoceFiltro[]) => {
      this.filtri = filtri;
    });
  }

  getFiltriSelezionati() {
    this.filtriS.getFiltriSelezionati().subscribe((filtri: VoceFiltro[]) => {
      this.filtriSelezionati = filtri;
    });
  }

  search() {
    let count = 0;
    const arrText = this.text.split(' ');
    arrText.forEach(word => {
      this.filtri.forEach(filtro => {
        /* TO LOWER CASE */
        word = word.toLowerCase();
        filtro.descrizione = filtro.descrizione.toLowerCase();
        /* CONTROLLO SE LA PAROLA SI TROVA NEI FILTRI (DA FARE INDEXOF)*/
        if (word.toLowerCase() === filtro.descrizione.toLowerCase()) {
          this.filtriS.filtroRicercaRilevato(filtro);
          count++;
        }
      });
    });

    console.log(arrText);
    console.log(count);
    console.log(this.filtriSelezionati);
  }
}
