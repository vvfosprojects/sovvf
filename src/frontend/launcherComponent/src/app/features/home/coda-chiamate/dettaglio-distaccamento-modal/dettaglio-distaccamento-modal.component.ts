import { Component, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { Squadra } from '../../../../shared/model/squadra.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperSintesiRichiesta } from '../../richieste/helper/_helper-sintesi-richiesta';
import { nomeStatiSquadra } from '../../../../shared/helper/function-composizione';

@Component({
    selector: 'app-dettaglio-distaccamento-modal',
    templateUrl: './dettaglio-distaccamento-modal.component.html',
    styleUrls: ['./dettaglio-distaccamento-modal.component.scss']
})
export class DettaglioDistaccamentoModalComponent implements OnInit {

    codDistaccamento: string;
    descDistaccamento: string;
    richieste: SintesiRichiesta[];
    squadre: Squadra[];

    methods = new HelperSintesiRichiesta();

    constructor(private modal: NgbActiveModal) {
    }

    ngOnInit(): void {
        console.log('codDistaccamento', this.codDistaccamento);
        console.log('descDistaccamento', this.descDistaccamento);
        console.log('richieste', this.richieste);
        console.log('squadre', this.squadre);
    }

    _nomeStatiSquadra(statoSquadra: number): string {
        return nomeStatiSquadra(statoSquadra);
    }

    onNuovaPartenza(): void {
        this.close('nuovaPartenza');
    }

    close(type: string): void {
        this.modal.close({ status: type });
    }

}
