import { Component, Input } from '@angular/core';
import { Role, Utente } from '../../../shared/model/utente.model';

@Component({
    selector: 'app-operatore',
    templateUrl: './operatore.component.html',
    styleUrls: ['./operatore.component.css']
})
export class OperatoreComponent {

    @Input() user: Utente;
    Role = Role;
}
