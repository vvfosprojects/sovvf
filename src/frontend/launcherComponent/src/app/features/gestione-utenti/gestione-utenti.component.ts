import {Component, OnChanges, SimpleChanges} from '@angular/core';
import {UtentiState} from 'src/app/features/home/store/states/utenti/utenti.state';
import {Utente} from 'src/app/shared/model/utente.model';
import {Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {GetUtenti} from 'src/app/features/home/store/actions/utenti/utenti.actions';

@Component({
  selector: 'app-gestione-utenti',
  templateUrl: './gestione-utenti.component.html',
  styleUrls: ['./gestione-utenti.component.css']
})
export class GestioneUtentiComponent {

  @Select(UtentiState.utenti) utenti$: Observable<Utente[]>;

  ricercaUtenti = { cognome: '' };

  constructor(private store: Store) {
    this.store.dispatch(new GetUtenti());
  }
}
