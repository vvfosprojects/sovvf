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
    return this.http.get('https://api.myjson.com/bins/1fe9to').pipe(
      catchError(this.handleErrorObs)
    );
  }

  /* SELEZIONATO */
  getFiltriSelezionati(): Observable<VoceFiltro[]> {
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

  filtroDeselezione(PARAMETRO) {
    PARAMETRO.selezionato = false;
    this.filtriSelezionati.forEach((f, index) => {
      /* Creare logica per eliminare il filtro che arriva dalla funzione (PARAMETRO) */
    });
  }

  private handleErrorObs(error: any) {
    console.error('Si è verificato un errore', error);
    return throwError(error.message || error);
  }
}
