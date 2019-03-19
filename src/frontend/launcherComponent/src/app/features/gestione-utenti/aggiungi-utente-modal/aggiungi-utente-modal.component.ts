import { Component, OnInit } from '@angular/core';
import { Role, Utente } from '../../../shared/model/utente.model';
import { Sede } from '../../../shared/model/sede.model';
import { Select, Store } from '@ngxs/store';
import { GetUtenti } from '../../home/store/actions/utenti/utenti.actions';
import { UtentiState } from '../../home/store/states/utenti/utenti.state';
import { Observable, Subscription } from 'rxjs';
import { makeCopy } from '../../../shared/helper/function';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-aggiungi-utente-modal',
    templateUrl: './aggiungi-utente-modal.component.html',
    styleUrls: ['./aggiungi-utente-modal.component.css']
})
export class AggiungiUtenteModalComponent implements OnInit {

    @Select(UtentiState.utenti) utenti$: Observable<Utente[]>;
    utenti: Utente[];

    utente: string;
    ruolo: Role;
    sede: Sede;
    loaded = false;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                public modal: NgbActiveModal) {
        this.store.dispatch(new GetUtenti());
        this.subscription.add(
            this.utenti$.subscribe((utenti: Utente[]) => {
                this.utenti = makeCopy(utenti);
                this.utenti.map((i) => {
                    i.cognome = i.nome + ' ' + i.cognome;
                    console.log(i.cognome);
                });
                this.loaded = true;
            })
        );
    }

    ngOnInit() {
    }

}
