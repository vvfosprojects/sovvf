import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UtentiState} from 'src/app/features/home/store/states/utenti/utenti.state';
import {Utente} from 'src/app/shared/model/utente.model';
import {Observable, Subscription} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {GetUtenti} from 'src/app/features/home/store/actions/utenti/utenti.actions';
import {SetRicercaUtenti} from './store/actions/ricerca-utenti/ricerca-utenti.actons';
import {makeCopy} from '../../shared/helper/function';
import {RicercaUtentiState} from './store/states/ricerca-utenti/ricerca-utenti.state';
import {Sede} from '../../shared/model/sede.model';
import {UnitaAttualeService} from '../navbar/navbar-service/unita-attuale/unita-attuale.service';
import {UtenteState} from '../navbar/operatore/store/states/utente.state';

@Component({
    selector: 'app-gestione-utenti',
    templateUrl: './gestione-utenti.component.html',
    styleUrls: ['./gestione-utenti.component.css']
})
export class GestioneUtentiComponent implements OnInit {

    @Select(UtentiState.utenti) utenti$: Observable<Utente[]>;
    @Select(RicercaUtentiState.ricerca) ricerca$: Observable<any>;
    @Select(UtenteState.utente) user$: Observable<Utente>;

    unitaOperativaAttuale: Sede;
    subscription = new Subscription();

    constructor(private store: Store) {
        this.store.dispatch(new GetUtenti());
    }

    onRicercaUtenti(ricerca: any) {
        this.store.dispatch(new SetRicercaUtenti(makeCopy(ricerca)));
    }

    ngOnInit(): void {
        this.user$.subscribe((utente: Utente) => {
            this.unitaOperativaAttuale = utente.sede;
        });
    }
}
