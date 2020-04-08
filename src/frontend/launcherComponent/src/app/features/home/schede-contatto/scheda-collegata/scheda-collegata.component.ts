import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SchedaContatto } from '../../../../shared/interface/scheda-contatto.interface';
import { Priorita } from '../../../../shared/model/sintesi-richiesta.model';
import { CheckboxInterface } from '../../../../shared/interface/checkbox.interface';

@Component({
    selector: 'app-scheda-collegata',
    templateUrl: './scheda-collegata.component.html',
    styleUrls: [ './scheda-collegata.component.css' ]
})
export class SchedaCollegataComponent {

    @Input() scheda: SchedaContatto;
    priorita = Priorita;

}
