import { Component, OnInit } from '@angular/core';
import { UtentiState } from 'src/app/shared/store/states/lista-utenti.state';
import { Utente } from 'src/app/shared/model/utente.model';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { GetUtenti } from 'src/app/shared/store/actions/lista-utenti.actions';

@Component({
  selector: 'app-gestione-utenti',
  templateUrl: './gestione-utenti.component.html',
  styleUrls: ['./gestione-utenti.component.css']
})
export class GestioneUtentiComponent implements OnInit {

  @Select(UtentiState.utenti) utenti$: Observable<Utente[]>;

  ricercaUtenti: string;

  constructor(private store: Store) { }

  ngOnInit() {
      this.store.dispatch(new GetUtenti());
  }

}
