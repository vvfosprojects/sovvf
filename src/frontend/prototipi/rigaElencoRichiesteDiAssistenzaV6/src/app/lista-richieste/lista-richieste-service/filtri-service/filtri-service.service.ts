import { Injectable } from '@angular/core';
import { VoceFiltro } from '../../../shared/model/voce-filtro.model';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FiltriService {
  filtriSelezionati: VoceFiltro[] = [];

  constructor(private http: HttpClient) { }

  getTipologie() {
    return this.http.get('https://api.myjson.com/bins/rn3k4').pipe(
      catchError(this.handleErrorObs)
    );
  }

  getFiltriSelezionati(): Observable<any> {
    return of(this.filtriSelezionati);
  }

  filtroSelezionato(filtro) {
    if (filtro.selezionato === true) {
      this.filtroDeselezione(filtro);
    } else {
      filtro.selezionato = true;
      this.filtriSelezionati.push(filtro);
      /* TEST console.log('Sono il service, ho aggiunto il filtro ricevuto');
      console.log(this.filtriSelezionati); */
    }
  }

  filtroDeselezione(filtro) {
    filtro.selezionato = false;
    this.filtriSelezionati.forEach((filtroSelezionato, index) => {
      if (filtroSelezionato.codice === filtro.codice) {
        this.filtriSelezionati.splice(index, 1);
        /* TEST console.log('Sono il service, ho rimosso il filtro deselezionato');
        console.log(this.filtriSelezionati); */
      }
    });
  }

  private handleErrorObs(error: any) {
    console.error('Si è verificato un errore', error);
    return throwError(error.message || error);
  }
}
