import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MarkerService } from '../../../service/marker-service/marker-service.service';
import { ToastrService } from 'ngx-toastr';
import { Select } from '@ngxs/store';
import { MarkerState } from '../../../../store/states/maps/marker.state';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-cambio-sede-modal',
    templateUrl: './cambio-sede-modal.component.html',
    styleUrls: ['./cambio-sede-modal.component.css']
})
export class CambioSedeModalComponent {

    @Select(MarkerState.markerSelezionato) markerSelezionato$: Observable<any>;
    markerSelezionato: any;
    nomeSede: string;

    constructor(public modal: NgbActiveModal,
                private markerService: MarkerService,
                private toastr: ToastrService) {
        this.markerSelezionato$.subscribe(result => {
            if (result) {
                this.nomeSede = result.descrizione;
                this.markerSelezionato = result;
            }
        });
    }

    cambioSede() {
        this.markerService.cambioSede(this.markerSelezionato);
        this.markerService.deseleziona();
    }

    annullaCambioSede() {
        this.toastr.warning('Azione annullata', 'Attenzione');
        this.markerService.deseleziona();
    }

}
