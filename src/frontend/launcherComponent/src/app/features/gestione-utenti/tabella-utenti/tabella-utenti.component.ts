import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Role } from '../../../shared/model/utente.model';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { RicercaUtentiState } from '../store/states/ricerca-utenti/ricerca-utenti.state';
import { FilterPipe } from 'ngx-filter-pipe';
import { makeCopy } from '../../../shared/helper/function';
import { TabellaUtentiState } from '../store/states/tabella-utenti/tabella-utenti.state';
import { SetPage, SetPageSize, SetUtentiFiltrati } from '../store/actions/tabella-utenti/tabella-utenti.actons';
import { Sede } from '../../../shared/model/sede.model';
import { GestioneUtentiState } from '../store/states/gestione-utenti/gestione-utenti.state';
import { GestioneUtente } from '../../../shared/model/gestione-utente.model';


@Component({
    selector: 'app-tabella-utenti',
    templateUrl: './tabella-utenti.component.html',
    providers: [DecimalPipe]
})
export class TabellaUtentiComponent implements OnInit {
    @Select(RicercaUtentiState.ricerca) ricerca$: Observable<any>;
    ricercaUtenti: any;

    @Select(GestioneUtentiState.lista_gestione_utenti) lista_gestione_utenti$: Observable<GestioneUtente[]>;
    lista_gestione_utenti: GestioneUtente[];

    @Select(TabellaUtentiState.utentiFiltrati) utentiFiltrati$: Observable<GestioneUtente[]>;
    utentiFiltrati: GestioneUtente[];

    @Select(TabellaUtentiState.pageSize) pageSize$: Observable<number>;
    pageSize: number;

    @Select(TabellaUtentiState.page) page$: Observable<number>;
    page: number;

    @Input() ruoli: Array<any>;

    @Output() setRuolo: EventEmitter<any> = new EventEmitter();

    subscription = new Subscription();

    get utentiPaginati(): GestioneUtente[] {
        return this.utentiFiltrati
            .map((utente, i) => ({id: i + 1, ...utente}))
            .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }

    constructor(private store: Store,
                private filter: FilterPipe) {
        this.subscription.add(
            this.lista_gestione_utenti$.subscribe((utenti: GestioneUtente[]) => {
                this.lista_gestione_utenti = makeCopy(utenti);
                this.lista_gestione_utenti.map(r => {
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
            this.utentiFiltrati$.subscribe((utentiFiltrati: GestioneUtente[]) => {
                this.utentiFiltrati = utentiFiltrati;
            })
        );
    }

    ngOnInit(): void {
        console.log('Ruoli', this.ruoli);
    }

    filtraRichieste(ricerca: any): any {
        const utentiFiltrati = this.filter.transform(this.lista_gestione_utenti, ricerca);
        this.setUtentiFiltrati(utentiFiltrati);
    }

    setUtentiFiltrati(utentiFIltrati: GestioneUtente[]) {
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

    onSetRuolo(utente: GestioneUtente, ruolo: any, sede: Sede) {
        const nuovoRuolo = {
            utente: utente,
            ruolo: ruolo,
            sede: sede
        };
        this.setRuolo.emit(nuovoRuolo);
    }
}
