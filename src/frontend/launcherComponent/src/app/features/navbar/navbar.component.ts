import { Component, OnInit, EventEmitter, Output, isDevMode, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ClockService } from './navbar-service/clock-service/clock.service';
import { AuthenticationService, UserService } from '../../core/auth/_services';
import { Turno } from './turno/turno.model';
import { User } from '../../core/auth/_models';
import { Store, Select } from '@ngxs/store';
import { TurnoState } from './turno/store/states/turno.state';
import { GetTurno } from './turno/store/actions/turno.actions';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

    time: Date;
    currentUser: User;
    userFromApi: User;
    // user: User[] = [];

    subscription = new Subscription();

    @Output() openedSidebar = new EventEmitter<any>();
    @Select(TurnoState.turno) turno$: Observable<Turno>;

    constructor(private store: Store,
        private _clock: ClockService,
        private _user: UserService,
        private authenticationService: AuthenticationService) {
        this.currentUser = this.authenticationService.currentUserValue;
        this.subscription.add(this._clock.getClock().subscribe(time => this.time = time));
        // this.subscription.add(this._user.getAll().pipe(first()).subscribe(users => this.user = users));

        this.getTurno();
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Navbar creato');
        this.subscription.add(this._user.getById(this.currentUser.id).pipe(first()).subscribe(user => this.userFromApi = user));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        isDevMode() && console.log('Componente Navbar distrutto');
    }

    openSidebar() {
        this.openedSidebar.emit();
    }

    getTurno() {
        this.store.dispatch(new GetTurno());
    }
}
