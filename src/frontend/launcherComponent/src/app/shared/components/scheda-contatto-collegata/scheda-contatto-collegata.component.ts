import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SchedaContatto } from '../../interface/scheda-contatto.interface';
import { Priorita } from '../../model/sintesi-richiesta.model';

@Component({
    selector: 'app-scheda-contatto-collegata',
    templateUrl: './scheda-contatto-collegata.component.html',
    styleUrls: ['./scheda-contatto-collegata.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedaContattoCollegataComponent {

    @Input() scheda: SchedaContatto;

    priorita = Priorita;

}
