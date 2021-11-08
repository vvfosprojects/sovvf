import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TurnoCalendario } from './model/turno-calendario.model';
import { TurnoExtra } from './model/turno-extra.model';

@Component({
    selector: 'app-turno',
    templateUrl: './turno.component.html',
    styleUrls: ['./turno.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TurnoComponent {

    @Input() turno: TurnoCalendario;
    @Input() turnoExtra: TurnoExtra;

    constructor() {
    }

}
