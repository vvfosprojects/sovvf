import { Component, Input } from '@angular/core';
import { Componente } from '../../model/componente.model';

@Component({
    selector: 'app-componente',
    templateUrl: './componente.component.html',
    styleUrls: ['./componente.component.scss']
})
export class ComponenteComponent {

    @Input() componente: Componente;

    constructor() {
    }

}
