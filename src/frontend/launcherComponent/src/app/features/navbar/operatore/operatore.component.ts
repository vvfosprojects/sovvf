import { Component, Input } from '@angular/core';
import { Role, Utente } from '../../../shared/model/utente.model';
import { SignalRService } from '../../../core/signalr/signalR.service';
import { SignalRNotification } from '../../../core/signalr/interface/signalr-notification.interface';

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
        const notification: SignalRNotification = {
            CodiceSede: this.user.sede.codice,
            NominativoUtente: `${this.user.nome} ${this.user.cognome}`,
            idUtente: +this.user.id
        };
        this.signalR.removeToGroup(notification);
    }
}
