import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { CasLogout } from '../store/auth.actions';
import { StopBigLoading } from '../../../shared/store/actions/loading/loading.actions';
import { LSNAME } from '../../../core/settings/config';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';

@Component({
    selector: 'app-utente-non-abilitato',
    templateUrl: './utente-non-abilitato.component.html',
    styleUrls: ['./utente-non-abilitato.component.css']
})
export class UtenteNonAbilitatoComponent implements OnInit {

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        const userLogged = sessionStorage.getItem(LSNAME.currentUser);
        const token = sessionStorage.getItem(LSNAME.token);
        if (userLogged && token) {
            this.store.dispatch(new Navigate(['/' + RoutesPath.Home]));
        } else {
            this.store.dispatch(new Navigate(['/' + RoutesPath.Login]));
        }
        this.store.dispatch(new StopBigLoading());
    }

    clearCas(): void {
        this.store.dispatch(new CasLogout());
    }

}
