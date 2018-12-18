import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DispatcherService } from '../../dispatcher/dispatcher-lista-richieste/dispatcher-lista-richieste.service';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';


@Injectable({
    providedIn: 'root'
})
export class ListaRichiesteManagerServiceFake {

    richieste: SintesiRichiesta[] = [];

    prossimaRichiesta = 0;
    ultima = 0;
    constructor(private dispatcher: DispatcherService) {
        this.onNewRichiesteList();
        this.onNewRichiesta();
        this.onUpdateRichiesta();
        this.onDeleteRichiesta();
    }

    onNewRichiesteList() {
        this.dispatcher.onNewRichiesteList().subscribe((richieste: SintesiRichiesta[]) => {
            const nPerPagina = 9;
            if (richieste[this.prossimaRichiesta]) {
                for (let i = this.prossimaRichiesta; i < (this.prossimaRichiesta + nPerPagina); i++) {
                    if (richieste[i]) {
                        this.richieste.push(richieste[i]);
                        this.ultima = i;
                    } else {
                        this.prossimaRichiesta = this.ultima + 1;
                        return;
                    }
                }
                this.prossimaRichiesta = this.ultima + 1;
            } else {
                console.log('Richieste Terminate');
            }
        });
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

    getRichieste(): Observable<SintesiRichiesta[]> {
        return of(this.richieste);
    }

    getRichiestaFromId(id, fromMap?: boolean) {
        let richiesta;
        richiesta = this.richieste.find(x => x.id === id);

        if (!richiesta && fromMap) {
            this.dispatcher.onNewRichiesteList().subscribe((richieste: SintesiRichiesta[]) => {
                richiesta = richieste.find(x => x.id === id);
            });
            console.log('Ho preso la richiesta dal service perchè non presente nella lista.');
        }
        return richiesta;
    }
}
