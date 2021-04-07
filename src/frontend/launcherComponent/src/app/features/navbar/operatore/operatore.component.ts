import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Ruolo, Utente } from '../../../shared/model/utente.model';
import { NotificaInterface } from '../../../shared/interface/notifica.interface';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';

@Component({
    selector: 'app-operatore',
    templateUrl: './operatore.component.html',
    styleUrls: ['./operatore.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperatoreComponent {

    @Input() user: Utente;
    @Input() ruoliUtenteLoggato: Ruolo[];
    @Input() url: string;
    @Input() listaNotifiche: NotificaInterface[];
    @Input() nuoveNotifiche: number;

    @Output() notificheLette: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() logout = new EventEmitter();

    RoutesPath = RoutesPath;

    setNotificheLette(): void {
        this.notificheLette.emit();
    }
}
