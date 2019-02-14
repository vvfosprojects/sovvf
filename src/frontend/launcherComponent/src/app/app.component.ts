import { Component, OnInit } from '@angular/core';
import { UnitaAttualeService } from './features/navbar/navbar-service/unita-attuale/unita-attuale.service';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from './core/auth/_services';
import { RoutesPath } from './shared/enum/routes-path.enum';
import { Store, Select } from '@ngxs/store';
import { GetUtenti } from './shared/store/actions/lista-utenti.actions';
import { UtentiState } from './shared/store/states/lista-utenti.state';
import { Observable } from 'rxjs';
import { Utente } from './shared/model/utente.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    _opened = false;
    _toggle = false;
    RoutesPath = RoutesPath;
    private deniedPath = [RoutesPath.NotFound.toString(), RoutesPath.Login.toString()];

    @Select(UtentiState.utenti) utenti$: Observable<Utente[]>;

    constructor(public fakeCambioSede: UnitaAttualeService,
        private store: Store,
        private router: Router,
        private authService: AuthenticationService) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                !this.deniedPath.includes(val.urlAfterRedirects.slice(1)) && authService._isLogged() ? this._toggle = true : this._toggle = false;
            }
        });
    }

    ngOnInit() {
        this.store.dispatch(new GetUtenti());
    }

    _toggleOpened() {
        this._opened = !this._opened;
    }
}

