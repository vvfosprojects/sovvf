import { Component, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { Squadra } from '../../../../shared/model/squadra.model';

@Component({
    selector: 'app-dettaglio-distaccamento-modal',
    templateUrl: './dettaglio-distaccamento-modal.component.html',
    styleUrls: ['./dettaglio-distaccamento-modal.component.scss']
})
export class DettaglioDistaccamentoModalComponent implements OnInit {

    richieste: SintesiRichiesta[];
    squadre: Squadra[];

    constructor() {
    }

    ngOnInit(): void {
    }

}
