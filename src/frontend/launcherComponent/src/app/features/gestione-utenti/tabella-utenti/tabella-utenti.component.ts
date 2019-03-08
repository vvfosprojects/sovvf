import {Component} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Utente} from '../../../shared/model/utente.model';
import {Observable, Subscription} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {UtentiState} from '../../home/store/states/utenti/utenti.state';
import {RicercaUtentiState} from '../store/states/ricerca-utenti/ricerca-utenti.state';
import {FilterPipe} from 'ngx-filter-pipe';
import {makeCopy} from '../../../shared/helper/function';
import {TabellaUtentiState} from '../store/states/tabella-utenti/tabella-utenti.state';
import {SetPage, SetPageSize, SetUtentiFiltrati} from '../store/actions/tabella-utenti/tabella-utenti.actons';


@Component({
    selector: 'app-tabella-utenti',
    templateUrl: './tabella-utenti.component.html',
    providers: [DecimalPipe]
})
export class TabellaUtentiComponent {
    @Select(RicercaUtentiState.ricerca) ricerca$: Observable<any>;
    ricercaUtenti: any;

    @Select(UtentiState.utenti) utenti$: Observable<Utente[]>;
    utenti: Utente[];

    @Select(TabellaUtentiState.utentiFiltrati) utentiFiltrati$: Observable<Utente[]>;
    utentiFiltrati: Utente[];

    @Select(TabellaUtentiState.pageSize) pageSize$: Observable<number>;
    pageSize: number;

    @Select(TabellaUtentiState.page) page$: Observable<number>;
    page: number;

    subscription = new Subscription();

    get utentiPaginati(): Utente[] {
        return this.utentiFiltrati
            .map((utente, i) => ({id: i + 1, ...utente}))
            .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }

    constructor(private store: Store,
                private filter: FilterPipe) {
        this.subscription.add(
            this.utenti$.subscribe((utenti: Utente[]) => {
                this.utenti = makeCopy(utenti);
                this.utenti.map(r => {
                    r.cognome = r.nome + ' ' + r.cognome;
                    r.nome = '';
                });
            })
        );
        this.subscription.add(
            this.ricerca$.subscribe((ricerca: any) => {
                this.ricercaUtenti = ricerca;

                this.utentiFiltrati = this.filtraRichieste(ricerca);
            })
        );
        this.subscription.add(
            this.pageSize$.subscribe((pageSize: number) => {
                this.pageSize = pageSize;
            })
        );
        this.subscription.add(
            this.page$.subscribe((page: number) => {
                this.page = page;
            })
        );
        this.subscription.add(
            this.utentiFiltrati$.subscribe((utentiFiltrati: Utente[]) => {
                this.utentiFiltrati = utentiFiltrati;
            })
        );
    }

    filtraRichieste(ricerca: any): any {
        const utentiFiltrati = this.filter.transform(this.utenti, ricerca);
        this.setUtentiFiltrati(utentiFiltrati);
    }

    setUtentiFiltrati(utentiFIltrati: Utente[]) {
        this.store.dispatch(new SetUtentiFiltrati(utentiFIltrati));
    }

    setPageSize(pageSize: number) {
        if (this.page > 1 || this.page !== 1) {
            this.store.dispatch(new SetPage(1));
        }
        this.store.dispatch(new SetPageSize(pageSize));
    }

    setPage(newPage: number) {
        this.store.dispatch(new SetPage(newPage));
    }
}
