import { Component, OnInit, EventEmitter, Output, isDevMode, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ClockService } from './clock/clock-service/clock.service';
import { Store, Select } from '@ngxs/store';
import { TurnoState } from './store/states/turno/turno.state';
import { Ruolo, Utente } from '../../shared/model/utente.model';
import { TurnoExtra } from './turno/turno-extra.model';
import { ClearDataNavbar, GetDataNavbar } from './store/actions/navbar.actions';
import { SediTreeviewState } from '../../shared/store/states/sedi-treeview/sedi-treeview.state';
import { TurnoCalendario } from './turno/turno-calendario.model';
import { calcolaTurnoCalendario } from 'src/app/shared/helper/calcola-turno';
import { SetTurnoCalendario } from './store/actions/turno/turno.actions';
import { AuthenticationService } from '../../core/auth/_services';
import { NewVersionState } from '../../shared/store/states/nuova-versione/nuova-versione.state';
import { GetNewVersion } from '../../shared/store/actions/nuova-versione/nuova-versione.actions';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

    subscription = new Subscription();
    clock$: Observable<Date>;
    time: Date;

    colorButton = 'btn-dark';

    @Input() user: Utente;
    @Input() ruoliUtenteLoggato: Ruolo[];
    @Output() openedSidebar = new EventEmitter<any>();

    @Select(TurnoState.turnoCalendario) turnoCalendario$: Observable<TurnoCalendario>;
    turnoCalendario: TurnoCalendario;
    @Select(TurnoState.turnoExtra) turnoExtra$: Observable<TurnoExtra>;
    turnoExtra: TurnoExtra;
    @Select(NewVersionState.newVersion) newVersion$: Observable<boolean>;
    newVersion: boolean;

    @Select(SediTreeviewState.listeSediNavbarLoaded) listeSediNavbarLoaded$: Observable<boolean>;

    constructor(private store: Store,
                private authenticationService: AuthenticationService,
                private _clock: ClockService) {
        this.time = new Date();
        this.clock$ = this._clock.getClock();
        this.subscription.add(this.clock$.subscribe((tick: Date) => {
            this.time = tick;
            this.checkTurno();
        }));
        this.subscription.add(this.turnoCalendario$.subscribe((turnoC: TurnoCalendario) => this.turnoCalendario = turnoC));
        this.subscription.add(this.turnoExtra$.subscribe((turnoExtra: TurnoExtra) => {
            this.turnoExtra = turnoExtra;
            if (turnoExtra) {
                this.colorButton = 'btn-danger';
            }
        }));
        this.subscription.add(this.newVersion$.subscribe((newVersion: boolean) => {
            this.newVersion = newVersion;
        }));
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Navbar creato');
        this.store.dispatch(new GetDataNavbar());
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        isDevMode() && console.log('Componente Navbar distrutto');
        this.store.dispatch(new ClearDataNavbar());
    }

    openSidebar() {
        this.openedSidebar.emit();
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

    setTurno() {
        this.store.dispatch(new SetTurnoCalendario());
    }

    getNewVersion() {
        this.store.dispatch(new GetNewVersion());
    }

    logout() {
        this.authenticationService.logout();
    }

}
