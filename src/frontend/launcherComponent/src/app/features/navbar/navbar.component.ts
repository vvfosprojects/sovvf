import { Component, OnInit, EventEmitter, Output, isDevMode, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ClockService } from './clock/clock-service/clock.service';
import { AuthenticationService } from '../../core/auth/_services';
import { Store, Select } from '@ngxs/store';
import { TurnoState } from './store/states/turno/turno.state';
import { Utente } from '../../shared/model/utente.model';
import { ClearUtente, SetUtente } from './store/actions/operatore/utente.actions';
import { TurnoExtra } from './turno/turno-extra.model';
import { ClearDataNavbar, GetDataNavbar } from './store/actions/navbar.actions';
import { SediTreeviewState } from '../../shared/store/states/sedi-treeview/sedi-treeview.state';
import { SetCodiceSede, SetIdUtente } from '../../core/signalr/store/signalR.actions';
import { TurnoCalendario } from './turno/turno-calendario.model';
import { calcolaTurnoCalendario } from 'src/app/shared/helper/calcola-turno';
import { SetTurnoCalendario } from './store/actions/turno/turno.actions';

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
    @Output() openedSidebar = new EventEmitter<any>();

    @Select(TurnoState.turnoCalendario) turnoCalendario$: Observable<TurnoCalendario>;
    turnoCalendario: TurnoCalendario;
    @Select(TurnoState.turnoExtra) turnoExtra$: Observable<TurnoExtra>;
    turnoExtra: TurnoExtra;

    @Select(SediTreeviewState.listeSediNavbarLoaded) listeSediNavbarLoaded$: Observable<boolean>;

    constructor(private store: Store,
        private _clock: ClockService,
        private authService: AuthenticationService) {
        this.time = new Date();
        this.clock$ = this._clock.getClock();
        this.setUtente();
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

    setUtente() {
        this.store.dispatch(new SetUtente(this.authService.currentUserValue));
        this.store.dispatch(new SetCodiceSede(this.authService.currentUserValue.sede.codice));
        this.store.dispatch(new SetIdUtente(this.authService.currentUserValue.id));
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

    logout() {
        this.store.dispatch(new ClearUtente());
    }

}
