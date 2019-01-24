import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Sede } from '../../../shared/model/sede.model';
import { UnitaAttualeService } from '../navbar-service/unita-attuale/unita-attuale.service';

@Component({
    selector: 'app-cambio-sede-nav-modal',
    templateUrl: '../../../shared/modal/cambio-sede-modal.component.html',
    styleUrls: ['../../../shared/modal/cambio-sede-modal.component.css']
})
export class CambioSedeModalNavComponent implements OnInit {

    nomeSede: string;
    newUnita: Sede[];

    constructor(public modal: NgbActiveModal, private unitaAttualeS: UnitaAttualeService) {
    }

    ngOnInit() {
        this.newUnita = this.unitaAttualeS.unitaSelezionata;
        this.nomeSede = this.unitaAttualeS.unitaSelezionata.length > 1 ? this.unitaAttualeS.unitaSelezionataString : this.unitaAttualeS.unitaSelezionata[0].descrizione;
    }

    cambioSede() {
        this.unitaAttualeS.sendUnitaOperativaAttuale(this.newUnita);
    }

    annullaCambioSede() {
        this.unitaAttualeS.annullaTreeView();
    }

}
