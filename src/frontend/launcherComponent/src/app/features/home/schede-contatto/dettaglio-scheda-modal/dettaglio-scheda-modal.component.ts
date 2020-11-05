import { Component } from '@angular/core';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { Priorita } from '../../../../shared/model/sintesi-richiesta.model';

@Component({
    selector: 'app-dettaglio-scheda-modal',
    templateUrl: './dettaglio-scheda-modal.component.html',
    styleUrls: ['./dettaglio-scheda-modal.component.css']
})
export class DettaglioSchedaModalComponent {

    schedaContatto: SchedaContatto;
    priorita = Priorita;

    constructor() {
    }

}
