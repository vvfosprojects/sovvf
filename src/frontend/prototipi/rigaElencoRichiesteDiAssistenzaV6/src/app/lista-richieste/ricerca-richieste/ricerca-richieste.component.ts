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
  text: string;
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

  search() {
    let count = 0;
    const arrText = this.text.split(' ');
    const arrFilters = [];
    this.filtri.forEach(filtro => {
      arrFilters.push(filtro.descrizione.split(' '));
    });

    /* Sanificare la stringa di ricerca da eventuali simboli (',' '!') */
    arrText.forEach(word => {
      arrFilters.forEach((filtro, indexFiltro) => {
        /* if (this.arrCounters[indexFiltro] === undefined) {
          this.arrCounters[indexFiltro] = 0;
        }
        filtro.forEach((parolaFiltro, indexParolaFiltro) => {
          if (word.toLowerCase() === parolaFiltro.toLowerCase()) {
            this.arrCounters[indexFiltro]++;
            console.log('Word: \'' + word.toLowerCase() + '\' corrisponde a: \'' + parolaFiltro.toLowerCase() + '\'');
            console.log('Ho incrementato arrCounters[' + indexFiltro + '], il suo valore ora è: ' + this.arrCounters[indexFiltro]);
          }
        }); */
        /* CONTROLLO SE LA PAROLA SI TROVA NEI FILTRI (DA FARE INDEXOF) */
        if (word.toLowerCase() === filtro.descrizione.toLowerCase()) {

          const filtriSelezionati = this.filtriS.filtriSelezionati;
          if (filtriSelezionati.length > 0) {
            filtriSelezionati.forEach(filtroAttivo => {
              if (word.toLowerCase() !== filtroAttivo.descrizione.toLowerCase()) {
                this.filtriS.filtroRicercaRilevato(filtro);
              } else {
                console.log('Il filtro era attivo');
              }
            });
          } else {
            this.filtriS.filtroRicercaRilevato(filtro);
            count++;
          }
        }
        /*
         if (this.arrCounters) {
           console.log(this.arrCounters[indexFiltro] + 'Indice: ' + indexFiltro);
         }
        */
      });
      console.log(this.arrCounters);
    });

    console.log('Stringa di ricerca: ' + arrText);
    // console.log(count);
    console.log('Filtri applicati alla ricerca:');
    console.log(this.filtriS.filtriSelezionati);
  }
}
