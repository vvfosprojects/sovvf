import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { DispatcherService } from '../../dispatcher/dispatcher-lista-richieste/dispatcher-lista-richieste.service';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';


@Injectable()
export class ListaRichiesteManagerService {
    private newRichiesteList$ = new Subject<SintesiRichiesta[]>();
    richieste: SintesiRichiesta[] = [];

    constructor(private dispatcher: DispatcherService) {
    }

    getRichieste(idUltimaRichiesta?: any) {
        let newArr = this.richieste;
        let count = 0;
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
                        this.newRichiesteList$.next(newArr);
                        count = 1;
                        // TEST
                        console.log('[Manager] Lista Richieste:', richieste.length);
                    } else if (richieste.length === 0 && count === 0) {
                        newArr = [];
                        this.newRichiesteList$.next(newArr);
                        count = 1;
                        // TEST
                        // console.log('Le richieste sono terminate');
                    }
                },
                error: data => console.log(`Errore: + ${data}`)
            });

        return this.newRichiesteList$.asObservable();
    }

    getRichiestaFromId(id: any, fromMap?: boolean) {
        let richiesta: any;
        if (this.richieste) {
            richiesta = this.richieste.find(x => x.id === id);
        }

        if (!richiesta && fromMap) {
            /* Chiamare il server per prendere (by id) la richiesta che mi serve */
            console.log('Ho preso la richiesta dal service perchè non presente nella lista.');
        }

        return richiesta;
    }
}
