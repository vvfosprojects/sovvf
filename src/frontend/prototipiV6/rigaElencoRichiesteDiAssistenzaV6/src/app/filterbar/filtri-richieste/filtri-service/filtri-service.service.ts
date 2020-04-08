import { Injectable } from '@angular/core';
import { VoceFiltro } from '../voce-filtro.model';
import { Observable, of, throwError, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map} from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

const API_URL = environment.apiUrl.elencoTipologie;

@Injectable({
  providedIn: 'root'
})
export class FiltriService {
  private newFiltriList$ = new Subject<VoceFiltro[]>();
  filtriSelezionati: VoceFiltro[] = [];

  constructor(private http: HttpClient) { }

  getTipologie() {
    return this.http.get<VoceFiltro[]>(API_URL).pipe(
      catchError(this.handleErrorObs)
    );
  }

  getFiltri() {
    this.newFiltriList$.next();
    this.getTipologie().subscribe({
            next: (filtri: VoceFiltro[]) => {
              filtri.unshift(
                new VoceFiltro('1', 'Presidiato', 'Presidiato', true),
                new VoceFiltro('2', 'Presidiato', 'Non Presidiato', true),
                new VoceFiltro('3', 'Rilevante', 'Rilevante', true),
                new VoceFiltro('4', 'Rilevante', 'Non Rilevante', true),
              );
              this.newFiltriList$.next(filtri);
            },
            error: err => console.log(`Errore: + ${err}`)
        });
    return this.newFiltriList$.asObservable();
  }

  getFiltriSelezionati(): Observable<any> {
    return of(this.filtriSelezionati);
  }

  deleteFiltriSelezionati() {
    this.filtriSelezionati.forEach(filtroSelezionato => {
      this.setDeselezionato(filtroSelezionato);
    });
    this.filtriSelezionati = [];
    // console.log('I filtri attivi sono:');
    // console.log(this.filtriSelezionati);
  }

  addfiltroSelezionato(filtro: VoceFiltro) {
    if (filtro.selezionato === true) {
      this.deletefiltroSelezionato(filtro);
    } else {
      this.setSelezionato(filtro);
      this.filtriSelezionati.push(filtro);
      // console.log('Sono il service, ho aggiunto il filtro ricevuto');
      // console.log(this.filtriSelezionati);
    }
  }

  deletefiltroSelezionato(filtro: VoceFiltro) {
    this.setDeselezionato(filtro);
    this.filtriSelezionati.forEach((filtroSelezionato, index) => {
      if (filtroSelezionato.codice === filtro.codice) {
        this.filtriSelezionati.splice(index, 1);
        // console.log('Sono il service, ho rimosso il filtro deselezionato');
        // console.log(this.filtriSelezionati);
      }
    });
  }

  setSelezionato(filtro: VoceFiltro) {
    filtro.selezionato = true;
  }

  setDeselezionato(filtro: VoceFiltro) {
    filtro.selezionato = false;
  }

  filtroRicercaRilevato(filtro: VoceFiltro) {
    if (!filtro.selezionato) {
      filtro.selezionato = false;
    }
    if (filtro.selezionato === false) {
      filtro.selezionato = true;
      this.filtriSelezionati.push(filtro);
    }
  }

  private handleErrorObs(error: any) {
    console.error('Si è verificato un errore', error);
    return throwError(error.message || error);
  }
}
