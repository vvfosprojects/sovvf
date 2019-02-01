import { Injectable } from '@angular/core';
import { VoceFiltro } from '../voce-filtro.model';
import { Observable, of, throwError } from 'rxjs';
import { APP_TIPOLOGIE } from '../../../../../core/settings/tipologie';


@Injectable({
    providedIn: 'root'
})
export class FiltriService {
    filtriSelezionati: VoceFiltro[] = [];

    constructor() {
    }

    getFiltri() {
        const filtriTipologie: VoceFiltro[] = [];
        const filtriStatici: VoceFiltro[] = [
            new VoceFiltro('1', 'Presidiato', 'Presidiato', true),
            new VoceFiltro('2', 'Presidiato', 'Non Presidiato', true),
            new VoceFiltro('3', 'Rilevante', 'Rilevante', true),
            new VoceFiltro('4', 'Rilevante', 'Non Rilevante', true)
        ];
        filtriTipologie.push(...filtriStatici);
        APP_TIPOLOGIE.forEach(tipologie => {
            filtriTipologie.push(new VoceFiltro(tipologie.codice, tipologie.categoria, tipologie.descrizione, tipologie.star));
        });
        return of(filtriTipologie);
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
