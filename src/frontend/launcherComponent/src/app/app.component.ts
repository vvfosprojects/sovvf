import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from './core/auth/_services';
import { RoutesPath } from './shared/enum/routes-path.enum';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { SignalRState } from './core/signalr/store/signalR.state';
import { AppState } from './shared/store/states/app/app.state';
import { OFFSET_SYNC_TIME } from './core/settings/referral-time';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

    subscription = new Subscription();

    @Select(SignalRState.statusSignalR) _signalR$: Observable<boolean>;
    _signalR = false;

    @Select(AppState.appIsLoaded) _isLoaded$: Observable<boolean>;
    _isLoaded: boolean;

    @Select(AppState.offsetTimeSync) offsetTime$: Observable<number>;

    _opened = false;
    _toggle = false;
    RoutesPath = RoutesPath;
    private deniedPath = [RoutesPath.NotFound.toString(), RoutesPath.Login.toString()];

    constructor(private router: Router,
                private authService: AuthenticationService) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                !this.deniedPath.includes(val.urlAfterRedirects.slice(1)) && authService._isLogged() ? this._toggle = true : this._toggle = false;
            }
        });
        this.subscription.add(this._signalR$.subscribe((r: boolean) => this._signalR = r));
        this.subscription.add(this._isLoaded$.subscribe((r: boolean) => this._isLoaded = r));
        this.subscription.add(this.offsetTime$.subscribe((serverTime: number) => OFFSET_SYNC_TIME.unshift(serverTime)));
    }

    _toggleOpened() {
        this._opened = !this._opened;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}

