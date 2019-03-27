import { Component, OnInit, EventEmitter, Output, isDevMode, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { ClockService } from './navbar-service/clock-service/clock.service';
import { AuthenticationService } from '../../core/auth/_services';
import { Turno } from './turno/turno.model';
import { Store, Select } from '@ngxs/store';
import { TurnoState } from './store/states/turno/turno.state';
import { GetTurno } from './store/actions/turno/turno.actions';
import { Utente } from '../../shared/model/utente.model';
import { UtenteState } from './store/states/operatore/utente.state';
import { GetUtente } from './store/actions/operatore/utente.actions';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

    time$: Observable<Date>;

    @Output() openedSidebar = new EventEmitter<any>();
    @Select(TurnoState.turno) turno$: Observable<Turno>;
    @Select(UtenteState.utente) user$: Observable<Utente>;

    constructor(private store: Store,
                private _clock: ClockService,
                private authService: AuthenticationService) {
        this.time$ = this._clock.getClock();
        this.dispatchStates();
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Navbar creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Navbar distrutto');
    }

    openSidebar() {
        this.openedSidebar.emit();
    }

    dispatchStates() {
        this.store.dispatch(new GetUtente(this.authService.currentUserValue));
        this.store.dispatch(new GetTurno());
    }

}
