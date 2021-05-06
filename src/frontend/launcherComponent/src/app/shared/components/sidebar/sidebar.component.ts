import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoutesPath } from '../../enum/routes-path.enum';
import { Ruolo, Utente } from '../../model/utente.model';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    @Input() user: Utente;
    @Input() ruoliUtenteLoggato: Ruolo[];
    @Input() url: string;

    @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() logout = new EventEmitter();

    RoutesPath = RoutesPath;

    constructor() {
    }

    ngOnInit(): void {
    }

    onLogout(): void {
        this.logout.emit();
    }

}
