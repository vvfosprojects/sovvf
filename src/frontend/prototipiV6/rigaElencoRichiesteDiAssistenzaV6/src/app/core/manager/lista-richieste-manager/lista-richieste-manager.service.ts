import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { DispatcherService } from '../../dispatcher/dispatcher-lista-richieste.service';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';


@Injectable({
    providedIn: 'root'
})
export class ListaRichiesteManagerService {
    private newRichiesteList$ = new Subject<SintesiRichiesta[]>();
    richieste: SintesiRichiesta[];

    constructor(private dispatcher: DispatcherService) {
    }

    getRichieste() {
        this.newRichiesteList$.next();
        this.dispatcher.onNewRichiesteList().subscribe({
            next: data => {
                this.richieste = data;
                this.newRichiesteList$.next(data);
            },
            error: data => console.log(`Errore: + ${data}`)
        });
        return this.newRichiesteList$.asObservable();
    }

    getRichiestaFromId(id, fromMap?: boolean) {
        let richiesta;
        richiesta = this.richieste.find(x => x.id === id);

        if (!richiesta && fromMap) {
            /* Chiamare il server per prendere (by id) la richiesta che mi serve */
            console.log('Ho preso la richiesta dal service perchè non presente nella lista.');
        }
        return richiesta;
    }

    onNewRichiesteList() {
        return;
    }
}
