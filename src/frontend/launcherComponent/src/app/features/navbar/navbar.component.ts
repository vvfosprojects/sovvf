import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ClockService } from './clock/clock-service/clock.service';
import { Store, Select } from '@ngxs/store';
import { TurnoState } from './store/states/turno.state';
import { Ruolo, Utente } from '../../shared/model/utente.model';
import { TurnoExtra } from './turno/turno-extra.model';
import { ClearDataNavbar, GetDataNavbar } from './store/actions/navbar.actions';
import { SediTreeviewState } from '../../shared/store/states/sedi-treeview/sedi-treeview.state';
import { TurnoCalendario } from './turno/turno-calendario.model';
import { calcolaTurnoCalendario } from 'src/app/shared/helper/calcola-turno';
import { SetTurnoCalendario } from './store/actions/turno.actions';
import { AuthService } from '../../core/auth/auth.service';
import { NewVersionState } from '../../shared/store/states/nuova-versione/nuova-versione.state';
import { GetNewVersion, OpenModalNewFeaturesInfo, OpenModalNewVersionSoon } from '../../shared/store/actions/nuova-versione/nuova-versione.actions';
import { SetNotificheLette } from '../../shared/store/actions/notifiche/notifiche.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { RouterState } from '@ngxs/router-plugin';
import { Logout } from '../auth/store/auth.actions';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

    @Input() user: Utente;
    @Input() ruoliUtenteLoggato: Ruolo[];

    @Output() openedSidebar = new EventEmitter<any>();

    @Select(TurnoState.turnoCalendario) turnoCalendario$: Observable<TurnoCalendario>;
    turnoCalendario: TurnoCalendario;
    @Select(TurnoState.turnoExtra) turnoExtra$: Observable<TurnoExtra>;
    turnoExtra: TurnoExtra;
    @Select(NewVersionState.newVersion) newVersion$: Observable<boolean>;
    newVersion: boolean;
    @Select(NewVersionState.newVersionSoon) newVersionSoon$: Observable<boolean>;
    newVersionSoon: boolean;
    @Select(NewVersionState.newFeaturesInfo) newFeaturesInfo$: Observable<boolean>;
    newFeaturesInfo: boolean;

    @Select(SediTreeviewState.listeSediNavbarLoaded) listeSediNavbarLoaded$: Observable<boolean>;

    @Select(RouterState.url) url$: Observable<string>;
    url: string;

    clock$: Observable<Date>;
    time: Date;

    colorButton = 'btn-dark';
    RoutesPath = RoutesPath;

    private subscription = new Subscription();

    constructor(private store: Store,
                private authenticationService: AuthService,
                private clock: ClockService) {
        this.setTime();
        this.getClock();
        this.getTurnoCalendario();
        this.getTurnoExtra();
        this.getNewVersion();
        this.getNewVersionSoon();
        this.getNewFeaturesInfo();
        this.getUrl();
    }

    ngOnInit(): void {
        console.log('Componente Navbar creato');
    }

    ngOnDestroy(): void {
        console.log('Componente Navbar distrutto');
        this.subscription.unsubscribe();
        this.store.dispatch(new ClearDataNavbar());
    }

    setTime(): void {
        this.time = new Date();
    }

    getClock(): void {
        this.clock$ = this.clock.getClock();
        this.subscription.add(
            this.clock$.subscribe((tick: Date) => {
                this.time = tick;
                this.checkTurno();
            })
        );
    }

    getTurnoCalendario(): void {
        this.subscription.add(
            this.turnoCalendario$.subscribe((turnoC: TurnoCalendario) => {
                this.turnoCalendario = turnoC;
            })
        );
    }

    getTurnoExtra(): void {
        this.subscription.add(
            this.turnoExtra$.subscribe((turnoExtra: TurnoExtra) => {
                this.turnoExtra = turnoExtra;
                if (turnoExtra) {
                    this.colorButton = 'btn-danger';
                }
            })
        );
    }

    getNewVersion(): void {
        this.subscription.add(
            this.newVersion$.subscribe((newVersion: boolean) => {
                this.newVersion = newVersion;
            })
        );
    }

    getNewVersionSoon(): void {
        this.subscription.add(
            this.newVersionSoon$.subscribe((newVersionSoon: boolean) => {
                this.newVersionSoon = newVersionSoon;
            })
        );
    }

    getNewFeaturesInfo(): void {
        this.subscription.add(
            this.newFeaturesInfo$.subscribe((newFeaturesInfo: boolean) => {
                this.newFeaturesInfo = newFeaturesInfo;
            })
        );
    }

    getUrl(): void {
        this.subscription.add(
            this.url$.subscribe((url: string) => {
                this.url = url;
                if ((url && url !== '/login' && url !== '/auth/caslogout' && url.indexOf('/auth?ticket=') === -1 && url !== '/auth/utente-non-abilitato') && !this.url.includes('/changelog#')) {
                    this.store.dispatch(new GetDataNavbar());
                }
            })
        );
    }

    checkTurno(): void {
        if (!this.turnoCalendario) {
            this.setTurno();
        } else {
            const turno = calcolaTurnoCalendario();
            if (this.turnoCalendario.corrente !== turno.corrente) {
                this.setTurno();
            }
        }
    }

    setTurno(): void {
        this.store.dispatch(new SetTurnoCalendario());
    }

    onGetNewVersion(): void {
        this.store.dispatch(new GetNewVersion());
    }

    onNewVersionSoon(): void {
        this.store.dispatch(new OpenModalNewVersionSoon());
    }

    onNewFeaturesInfo(): void {
        this.store.dispatch(new OpenModalNewFeaturesInfo());
    }

    logout(): void {
        const homeUrl = this.store.selectSnapshot(RouterState.url);
        this.store.dispatch(new Logout(homeUrl));
    }

    setNotificheLette(): void {
        this.store.dispatch(new SetNotificheLette());
    }

}
