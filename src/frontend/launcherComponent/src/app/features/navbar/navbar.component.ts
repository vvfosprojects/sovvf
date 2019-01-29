import { Component, OnInit, EventEmitter, Output, isDevMode, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TurnoService } from './navbar-service/turno-service/turno.service';
import { Turno } from './turno/turno.model';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

    @Output() openedSidebar = new EventEmitter<any>();
    turno: Turno;
    subscription = new Subscription();

    constructor(private _turno: TurnoService) {
        this.subscription.add(this._turno.getTurni().subscribe(res => this.turno = res));
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
