import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DispatcherFakeService } from '../../dispatcher-fake.service';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';


@Injectable({
    providedIn: 'root'
})
export class ListaRichiesteManagerService {

    richieste: SintesiRichiesta[] = [];

    prossimaRichiesta = 0;
    ultima = 0;
    constructor(private dispatcher: DispatcherFakeService) {
        this.onNewRichiesteList();
        this.onNewRichiesta();
        this.onUpdateRichiesta();
        this.onDeleteRichiesta();
    }

    onNewRichiesteList() {
        this.dispatcher.onNewRichiesteList().subscribe((richieste: SintesiRichiesta[]) => {
            const nPerPagina = 10;
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

    getData(): Observable<SintesiRichiesta[]> {
        return of(this.richieste);
    }

    getRichiestaFromId(id) {
        let allRichieste;
        this.dispatcher.onNewRichiesteList().subscribe((richieste: SintesiRichiesta[]) => {
            allRichieste = richieste;
        });
        return allRichieste.find(x => x.id === id);
    }
}
