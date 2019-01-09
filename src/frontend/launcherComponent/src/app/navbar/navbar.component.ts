import { Component, OnInit, EventEmitter, Output, isDevMode, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

    @Output() openedSidebar: EventEmitter<any> = new EventEmitter();

    constructor() {
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

}
