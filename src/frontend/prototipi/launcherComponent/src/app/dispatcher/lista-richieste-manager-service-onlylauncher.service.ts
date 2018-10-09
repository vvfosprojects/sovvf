import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DispatcherService } from './dispatcher.service';
import { SintesiRichiesta } from '../shared/model/sintesi-richiesta.model';
import { Richiesta } from './richiesta.model';


@Injectable({
    providedIn: 'root'
})
export class ListaRichiesteManagerServiceOnlylauncher {

    richieste: SintesiRichiesta[];

    constructor(private dispatcher: DispatcherService) {

        this.dispatcher.onNewSintesiRichiesteList().subscribe(richieste => {
            this.richieste = richieste;
        });

        this.dispatcher.onNewRichiesta().subscribe(richiesta => {
            this.richieste.unshift(richiesta.sRichiesta);
        });

        this.dispatcher.onUpdateRichiesta().subscribe((richiesta: Richiesta) => {
            this.richieste = this.richieste.map(r => r.id === richiesta.sRichiesta.id ? richiesta.sRichiesta : r);
            console.log(this.richieste);
        });

        this.dispatcher.onDeleteRichiesta().subscribe(richiesta => {
            this.richieste = this.richieste.filter(x => x.id === richiesta.sRichiesta.id);
        });

    }

    getData(): Observable<SintesiRichiesta[]> {
        return of(this.richieste);
    }
}
