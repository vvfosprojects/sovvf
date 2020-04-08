import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { DispatcherService } from '../../dispatcher/dispatcher-lista-richieste/dispatcher-lista-richieste.service';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';


@Injectable({
    providedIn: 'root'
})
export class ListaRichiesteManagerServiceFake {
    newRichiesteList: any;
    richieste: SintesiRichiesta[] = [];

    constructor(private dispatcher: DispatcherService) {
    }

    getRichieste(idUltimaRichiesta?: any) {
        let newArr = this.richieste;
        let count = 0;
        // TEST
        // console.log('[ListaRichiesteManager] Attualmente in memoria ne ho:', this.richieste.length);
        this.dispatcher.onNewRichiesteList(idUltimaRichiesta)
            .subscribe({
                next: richieste => {
                    if (richieste.length > 0 && count === 0) {
                        newArr = this.richieste;
                        /* pusho le nuove richieste nell'array (newArr) inizializzato
                        precedentemente con le vecchie richieste */
                        richieste.forEach((item: any) => {
                            newArr.push(item);
                        });
                        this.richieste = newArr;
                        this.newRichiesteList = newArr;
                        count = 1;
                    } else if (richieste.length === 0 && count === 0) {
                        newArr = [];
                        this.newRichiesteList = newArr;
                        count = 1;
                        // TEST
                        // console.log('Le richieste sono terminate');
                    }
                    // TEST
                    // console.log('[ListaRichiesteManager] Richieste ricevute dal dispatcher:', richieste.length);
                    // console.log('[ListaRichiesteManager] Adesso in memoria ne ho:', this.richieste.length);
                },
                error: data => console.log(`Errore: + ${data}`)
            });

        return of(this.newRichiesteList);
    }

    onNewRichiesta() {
        this.dispatcher.onNewRichiesta().subscribe((richiesta: SintesiRichiesta) => {
            this.richieste.unshift(richiesta);
        });
    }

    onUpdateRichiesta() {
        this.dispatcher.onUpdateRichiesta().subscribe((richiesta: SintesiRichiesta) => {
            this.richieste = this.richieste.map(r => r.id === richiesta.id ? richiesta : r);
            console.log(this.richieste);
        });
    }
    onDeleteRichiesta() {
        this.dispatcher.onDeleteRichiesta().subscribe((richiesta: SintesiRichiesta) => {
            this.richieste = this.richieste.filter(x => x.id === richiesta.id);
        });
    }

    getRichiestaFromId(id: any, fromMap?: boolean) {
        let richiesta: any;
        richiesta = this.richieste.find(x => x.id === id);

        if (!richiesta && fromMap) {
            this.dispatcher.onNewRichiesteList().subscribe((richieste: SintesiRichiesta[]) => {
                richiesta = richieste.find(x => x.id === id);
            });
            // TEST
            // console.log('[ListaRichiesteManager] Ho preso la richiesta dal service perchè non presente nella lista.');
        }
        return richiesta;
    }
}
