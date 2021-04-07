import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Componente } from '../../model/componente.model';

@Component({
    selector: 'app-componente',
    templateUrl: './componente.component.html',
    styleUrls: ['./componente.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponenteComponent {

    @Input() componente: Componente;

    constructor() {
    }

}
