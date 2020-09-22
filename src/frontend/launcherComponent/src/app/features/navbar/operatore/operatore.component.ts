import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ruolo, Utente } from '../../../shared/model/utente.model';
import { Select } from '@ngxs/store';
import { NotificheState } from '../../../shared/store/states/notifiche/notifiche.state';
import { Observable } from 'rxjs';
import { NotificaInterface } from '../../../shared/interface/notifica.interface';

@Component({
    selector: 'app-operatore',
    templateUrl: './operatore.component.html',
    styleUrls: ['./operatore.component.css']
})
export class OperatoreComponent {

    @Input() user: Utente;
    @Input() ruoliUtenteLoggato: Ruolo[];

    @Output() notificheLette: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() _logout = new EventEmitter();

    @Select(NotificheState.listaNotifiche) listaNotifiche$: Observable<NotificaInterface[]>;
    @Select(NotificheState.nuoveNotifiche) nuoveNotifiche$: Observable<number>;

    setNotificheLette() {
        this.notificheLette.emit();
    }
}
