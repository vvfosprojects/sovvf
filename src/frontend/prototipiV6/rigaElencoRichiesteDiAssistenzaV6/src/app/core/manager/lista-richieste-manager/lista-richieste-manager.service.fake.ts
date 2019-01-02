import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { DispatcherService } from '../../dispatcher/dispatcher-lista-richieste/dispatcher-lista-richieste.service';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';


@Injectable({
    providedIn: 'root'
})
export class ListaRichiesteManagerServiceFake {
    private newRichiesteList$ = new Subject<SintesiRichiesta[]>();
    richieste: SintesiRichiesta[];

    constructor(private dispatcher: DispatcherService) {
    }

    getRichieste(idUltimaRichiesta?: any) {
        this.newRichiesteList$.next();
        this.dispatcher.onNewRichiesteList(idUltimaRichiesta)
            .subscribe({
                next: data => {
                    this.richieste = data;
                    this.newRichiesteList$.next(data);
                },
                error: data => console.log(`Errore: + ${data}`)
            });
        return of(this.richieste);
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
            console.log('Ho preso la richiesta dal service perchè non presente nella lista.');
        }
        return richiesta;
    }
}
