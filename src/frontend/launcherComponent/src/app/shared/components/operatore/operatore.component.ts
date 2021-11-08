import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Ruolo, Utente } from '../../model/utente.model';
import { RoutesPath } from '../../enum/routes-path.enum';

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
    
    RoutesPath = RoutesPath;
}
