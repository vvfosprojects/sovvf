import { Component, Input } from '@angular/core';
import { Role, Utente } from '../../../shared/model/utente.model';
import { SignalRService } from '../../../core/signalr/signalR.service';
import { SignalRNotification } from '../../../core/signalr/model/signalr-notification.model';

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

        this.signalR.removeToGroup(new SignalRNotification(
            this.user.sede.codice,
            this.user.id,
            `${this.user.nome} ${this.user.cognome}`
            )
        );
    }
}
