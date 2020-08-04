import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ruolo, Utente } from '../../../shared/model/utente.model';

@Component({
    selector: 'app-operatore',
    templateUrl: './operatore.component.html',
    styleUrls: ['./operatore.component.css']
})
export class OperatoreComponent {

    @Input() user: Utente;
    @Input() ruoliUtenteLoggato: Ruolo[];

    @Output() _logout = new EventEmitter();
}
