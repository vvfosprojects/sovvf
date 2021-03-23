import { Component } from '@angular/core';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { Priorita } from '../../model/sintesi-richiesta.model';

@Component({
    selector: 'app-dettaglio-scheda-contatto-modal',
    templateUrl: './dettaglio-scheda-contatto-modal.component.html',
    styleUrls: ['./dettaglio-scheda-contatto-modal.component.css']
})
export class DettaglioSchedaContattoModalComponent {

    schedaContatto: SchedaContatto;
    priorita = Priorita;

    constructor() {
    }

}
