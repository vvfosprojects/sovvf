import { Component, OnDestroy } from '@angular/core';
import { UnitaAttualeService } from './features/navbar/navbar-service/unita-attuale/unita-attuale.service';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from './core/auth/_services';
import { RoutesPath } from './shared/enum/routes-path.enum';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { SignalRState } from './core/signalr/store/signalR.state';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

    subscription = new Subscription();

    _signalR = false;
    @Select(SignalRState.statusSignalR) _signalR$: Observable<boolean>;

    _opened = false;
    _toggle = false;
    RoutesPath = RoutesPath;
    private deniedPath = [RoutesPath.NotFound.toString(), RoutesPath.Login.toString()];

    constructor(public fakeCambioSede: UnitaAttualeService,
                private router: Router,
                private authService: AuthenticationService) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                !this.deniedPath.includes(val.urlAfterRedirects.slice(1)) && authService._isLogged() ? this._toggle = true : this._toggle = false;
            }
        });
        this.subscription.add(this._signalR$.subscribe((r: boolean) => this._signalR = r));
    }

    _toggleOpened() {
        this._opened = !this._opened;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}

