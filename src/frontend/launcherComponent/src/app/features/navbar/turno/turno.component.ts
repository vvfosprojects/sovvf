import { Component, Input } from '@angular/core';
import { TurnoCalendario } from './turno-calendario.model';
import { TurnoExtra } from './turno-extra.model';

@Component({
    selector: 'app-turno',
    templateUrl: './turno.component.html',
    styleUrls: ['./turno.component.css']
})
export class TurnoComponent {

    @Input() turno: TurnoCalendario;
    @Input() turnoExtra: TurnoExtra;

}
