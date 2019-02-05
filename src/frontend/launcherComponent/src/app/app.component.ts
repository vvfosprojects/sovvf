import { Component } from '@angular/core';
import { UnitaAttualeService } from './features/navbar/navbar-service/unita-attuale/unita-attuale.service';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from './core/auth/_services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    _opened = false;
    _toggle = false;
    private deniedPath = ['/404', '/login'];

    constructor(public fakeCambioSede: UnitaAttualeService,
                private router: Router,
                private authService: AuthenticationService) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                !this.deniedPath.includes(val.urlAfterRedirects) && authService._isLogged() ? this._toggle = true : this._toggle = false;
            }
        });
    }

    _toggleOpened() {
        this._opened = !this._opened;
    }
}

