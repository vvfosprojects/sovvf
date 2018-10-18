import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DispatcherListaRichiesteService } from '../../dispatcher-lista-richieste.service';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';


@Injectable({
    providedIn: 'root'
})
export class ListaRichiesteManagerService {

    richieste: SintesiRichiesta[];

    constructor(private dispatcher: DispatcherListaRichiesteService) {

        this.dispatcher.onNewRichiesteList().subscribe((richieste: SintesiRichiesta[]) => {
            this.richieste = richieste;
        });

        this.dispatcher.onNewRichiesta().subscribe((richiesta: SintesiRichiesta) => {
            this.richieste.unshift(richiesta);
        });

        this.dispatcher.onUpdateRichiesta().subscribe((richiesta: SintesiRichiesta) => {
            this.richieste = this.richieste.map(r => r.id === richiesta.id ? richiesta : r);
            console.log(this.richieste);
        });

        this.dispatcher.onDeleteRichiesta().subscribe((richiesta: SintesiRichiesta) => {
            this.richieste = this.richieste.filter(x => x.id === richiesta.id);
        });

    }

    getData(): Observable<SintesiRichiesta[]> {
        return of(this.richieste);
    }

    // nuoveRichieste() {
    //     let nuoveRichieste;
    //     this.dispatcher.onNewSRichiesteListScroll().subscribe(r => {
    //         nuoveRichieste = r;
    //     });
    //     return of(nuoveRichieste);
    // }

    getRichiestaFromId(id) {
        return this.richieste.find(x => x.id === id);
    }
}
