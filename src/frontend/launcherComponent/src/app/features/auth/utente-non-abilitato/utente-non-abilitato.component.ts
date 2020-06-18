import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { CasLogout } from '../store/auth.actions';

@Component({
    selector: 'app-utente-non-abilitato',
    templateUrl: './utente-non-abilitato.component.html',
    styleUrls: ['./utente-non-abilitato.component.css']
})
export class UtenteNonAbilitatoComponent implements OnInit {

    constructor(private store: Store) {
    }

    ngOnInit() {
    }

    clearCas() {
        this.store.dispatch(new CasLogout());
    }

}
