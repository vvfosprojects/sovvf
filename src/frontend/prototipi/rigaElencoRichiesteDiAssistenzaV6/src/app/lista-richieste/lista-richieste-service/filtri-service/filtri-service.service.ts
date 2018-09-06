import { Injectable } from '@angular/core';
import { VoceFiltro } from '../../filtri-richieste/voce-filtro.model';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

const API_URL = environment.apiUrl.elencoFiltri.fake;

@Injectable({
  providedIn: 'root'
})
export class FiltriService {
  filtriSelezionati: VoceFiltro[] = [];

  constructor(private http: HttpClient) { }

  getFiltri(): Observable<any> {
    return this.http.get(API_URL).pipe(
      catchError(this.handleErrorObs)
    );
  }

  getFiltriSelezionati(): Observable<any> {
    return of(this.filtriSelezionati);
  }

  filtroSelezionato(filtro: VoceFiltro) {
    if (filtro.selezionato === true) {
      this.filtroDeselezionato(filtro);
    } else {
      filtro.selezionato = true;
      this.filtriSelezionati.push(filtro);
      /* TEST console.log('Sono il service, ho aggiunto il filtro ricevuto');
      console.log(this.filtriSelezionati); */
    }
  }

  filtroDeselezionato(filtro: VoceFiltro) {
    filtro.selezionato = false;
    this.filtriSelezionati.forEach((filtroSelezionato, index) => {
      if (filtroSelezionato.codice === filtro.codice) {
        this.filtriSelezionati.splice(index, 1);
        /* TEST console.log('Sono il service, ho rimosso il filtro deselezionato');
        console.log(this.filtriSelezionati); */
      }
    });
  }

  filtroRicercaRilevato(filtro: VoceFiltro) {
    if (!filtro.selezionato) {
      console.log('undefined');
      filtro.selezionato = false;
    }
    if (filtro.selezionato === false) {
      console.log('false');
      filtro.selezionato = true;
      this.filtriSelezionati.push(filtro);
    }
  }

  private handleErrorObs(error: any) {
    console.error('Si è verificato un errore', error);
    return throwError(error.message || error);
  }
}
