import {Component, OnChanges, SimpleChanges} from '@angular/core';
import {UtentiState} from 'src/app/features/home/store/states/utenti/utenti.state';
import {Utente} from 'src/app/shared/model/utente.model';
import {Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {GetUtenti} from 'src/app/features/home/store/actions/utenti/utenti.actions';
import {SetRicercaUtenti} from './store/actions/ricerca-utenti/ricerca-utenti.actons';
import {makeCopy} from '../../shared/helper/function';
import {RicercaUtentiState} from './store/states/ricerca-utenti/ricerca-utenti.state';

@Component({
    selector: 'app-gestione-utenti',
    templateUrl: './gestione-utenti.component.html',
    styleUrls: ['./gestione-utenti.component.css']
})
export class GestioneUtentiComponent {

    @Select(UtentiState.utenti) utenti$: Observable<Utente[]>;
    @Select(RicercaUtentiState.ricerca) ricerca$: Observable<any>;

    constructor(private store: Store) {
        this.store.dispatch(new GetUtenti());
    }

    onRicercaUtenti(ricerca: any) {
        this.store.dispatch(new SetRicercaUtenti(makeCopy(ricerca)));
    }
}
