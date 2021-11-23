import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

@Component({
    selector: 'app-sganciamento-mezzo-modal',
    templateUrl: './sganciamento-mezzo-modal.component.html',
    styleUrls: ['./sganciamento-mezzo-modal.component.css']
})
export class SganciamentoMezzoModalComponent {

    icona: any;
    titolo: string;
    bottoni: any[];
    richiestaDa: SintesiRichiesta;
    idDaSganciare: string;

    constructor(public modal: NgbActiveModal) {
    }

}
