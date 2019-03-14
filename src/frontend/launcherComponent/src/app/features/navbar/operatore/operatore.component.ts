import { Component, Input } from '@angular/core';
import { Role, Utente } from '../../../shared/model/utente.model';
import { SignalRService } from '../../../core/signalr/signalR.service';

@Component({
    selector: 'app-operatore',
    templateUrl: './operatore.component.html',
    styleUrls: ['./operatore.component.css']
})
export class OperatoreComponent {

    constructor(private signalR: SignalRService) {

    }

    @Input() user: Utente;
    Role = Role;

    logout() {
        this.signalR.removeToGroup(this.user.sede.codice);
    }
}
