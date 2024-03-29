import { Component } from '@angular/core';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { Squadra } from '../../../../shared/model/squadra.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperSintesiRichiesta } from '../../richieste/helper/_helper-sintesi-richiesta';
import { nomeStatiSquadra } from '../../../../shared/helper/function-composizione';
import { PermissionFeatures } from '../../../../shared/enum/permission-features.enum';
import { StatoRichiesta } from '../../../../shared/enum/stato-richiesta.enum';
import { TipoConcorrenzaEnum } from '../../../../shared/enum/tipo-concorrenza.enum';

@Component({
    selector: 'app-dettaglio-distaccamento-modal',
    templateUrl: './dettaglio-distaccamento-modal.component.html',
    styleUrls: ['./dettaglio-distaccamento-modal.component.scss']
})
export class DettaglioDistaccamentoModalComponent {

    codDistaccamento: string;
    descDistaccamento: string;
    richieste: SintesiRichiesta[];
    squadre: Squadra[];

    methods = new HelperSintesiRichiesta();

    // ENUM
    permessiFeature = PermissionFeatures;
    statoRichiesta = StatoRichiesta;
    tipoConcorrenzaEnum = TipoConcorrenzaEnum;

    constructor(private modal: NgbActiveModal) {
    }

    _nomeStatiSquadra(statoSquadra: number): string {
        return nomeStatiSquadra(statoSquadra);
    }

    onNuovaPartenza(richiesta: SintesiRichiesta): void {
        this.close({ status: 'nuovaPartenza', data: richiesta });
    }

    close(result: { status: string, data?: any }): void {
        this.modal.close({ status: result.status, data: result.data });
    }

}
