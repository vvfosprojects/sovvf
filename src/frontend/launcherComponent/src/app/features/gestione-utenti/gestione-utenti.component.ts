import { Component } from '@angular/core';
import { UtentiState } from 'src/app/shared/store/states/utenti.state';
import { Utente } from 'src/app/shared/model/utente.model';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { GetUtenti } from 'src/app/shared/store/actions/utenti.actions';

@Component({
    selector: 'app-gestione-utenti',
    templateUrl: './gestione-utenti.component.html',
    styleUrls: ['./gestione-utenti.component.css']
})
export class GestioneUtentiComponent {

    @Select(UtentiState.utenti) utenti$: Observable<Utente[]>;

    // Todo: da definire
    ricercaUtenti: string;

    constructor(private store: Store) {
        this.store.dispatch(new GetUtenti());
    }

}
