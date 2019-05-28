import { Component, OnInit, EventEmitter, Output, isDevMode, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ClockService } from './clock/clock-service/clock.service';
import { AuthenticationService } from '../../core/auth/_services';
import { Turno } from './turno/turno.model';
import { Store, Select } from '@ngxs/store';
import { TurnoState } from './store/states/turno/turno.state';
import { SetTurno } from './store/actions/turno/turno.actions';
import { Utente } from '../../shared/model/utente.model';
import { ClearUtente, SetUtente } from './store/actions/operatore/utente.actions';
import { calcolaTurno } from '../../shared/helper/calcola-turno';
import { TurnoExtra } from './turno/turno-extra.model';
import { ClearDataNavbar, GetDataNavbar } from './store/actions/navbar.actions';
import { SediTreeviewState } from '../../shared/store/states/sedi-treeview/sedi-treeview.state';

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

    @Select(TurnoState.turno) turno$: Observable<Turno>;
    turno: Turno;
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
        this.subscription.add(this.turno$.subscribe((turno: Turno) => this.turno = turno));
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
    }

    checkTurno(): void {
        if (!this.turno) {
            this.setTurno();
        } else {
            const turno = calcolaTurno();
            if (this.turno.corrente !== turno.corrente) {
                this.setTurno();
            }
        }
    }

    setTurno() {
        this.store.dispatch(new SetTurno());
    }

    logout() {
        this.store.dispatch(new ClearUtente());
    }

}
