import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MarkerService} from '../../../service/marker-service/marker-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-cambio-sede-modal',
    templateUrl: '../../../../../../shared/modal/cambio-sede-modal.component.html',
    styleUrls: ['../../../../../../shared/modal/cambio-sede-modal.component.css']
})
export class CambioSedeModalComponent implements OnInit {

    nomeSede: string;

    constructor(public modal: NgbActiveModal, private markerService: MarkerService, private toastr: ToastrService) {

    }

    ngOnInit() {
        this.nomeSede = this.markerService.markerSelezionato.descrizione;
    }

    cambioSede() {
        this.markerService.cambioSede(this.markerService.markerSelezionato);
        this.markerService.deseleziona();
    }

    annullaCambioSede() {
        this.toastr.warning('Azione annullata', 'Attenzione');
        this.markerService.deseleziona();
    }

}
