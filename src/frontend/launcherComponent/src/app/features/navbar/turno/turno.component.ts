import { Component, Input } from '@angular/core';
import { Turno } from './turno.model';

@Component({
    selector: 'app-turno',
    templateUrl: './turno.component.html',
    styleUrls: ['./turno.component.css']
})
export class TurnoComponent {

    @Input() turno: Turno;

}
