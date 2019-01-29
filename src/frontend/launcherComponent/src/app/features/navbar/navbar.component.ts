import { Component, OnInit, EventEmitter, Output, isDevMode, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TurnoService } from './navbar-service/turno-service/turno.service';
import { Turno } from './turno/turno.model';
import { ClockService } from './navbar-service/clock-service/clock.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

    @Output() openedSidebar = new EventEmitter<any>();
    turno: Turno;
    time: Date;
    subscription = new Subscription();

    constructor(private _turno: TurnoService,
                private _clock: ClockService) {
        this.subscription.add(this._turno.getTurni().subscribe(res => this.turno = res));
        this.subscription.add(this._clock.getClock().subscribe(time => this.time = time));
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Navbar creato');
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        isDevMode() && console.log('Componente Navbar distrutto');
    }

    openSidebar() {
        this.openedSidebar.emit();
    }

}
