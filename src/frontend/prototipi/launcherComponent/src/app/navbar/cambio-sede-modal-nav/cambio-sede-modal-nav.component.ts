import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UnitaOperativaService} from '../navbar-service/unita-operativa-service/unita-operativa.service';
import {Sede} from '../../shared/model/sede.model';

@Component({
    selector: 'app-cambio-sede-nav-modal',
    templateUrl: '../../shared/modal/cambio-sede-modal.component.html',
    styleUrls: ['../../shared/modal/cambio-sede-modal.component.css']
})
export class CambioSedeModalNavComponent implements OnInit {

    nomeSede: string;
    newUnita: Sede;

    constructor(public modal: NgbActiveModal, private unitaOperativaS: UnitaOperativaService) {

    }

    ngOnInit() {
        this.newUnita = this.unitaOperativaS.unitaS;
        this.nomeSede = this.newUnita.descrizione;
    }

    cambioSede() {
        this.unitaOperativaS.sendUnitaOperativaAttuale(this.newUnita);
    }

    annullaCambioSede() {

    }

}
