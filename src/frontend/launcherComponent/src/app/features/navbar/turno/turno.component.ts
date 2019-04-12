import { Component, Input } from '@angular/core';
import { Turno } from './turno.model';
import { TurnoExtra } from './turno-extra.model';

@Component({
    selector: 'app-turno',
    templateUrl: './turno.component.html',
    styleUrls: ['./turno.component.css']
})
export class TurnoComponent {

    @Input() turno: Turno;
    @Input() turnoExtra: TurnoExtra;

}
