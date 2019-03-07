import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MarkerService } from '../../../service/marker-service/marker-service.service';
import { ToastrService } from 'ngx-toastr';
import { Select } from '@ngxs/store';
import { MarkerState } from '../../../../store/states/maps/marker.state';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-cambio-sede-modal',
    templateUrl: '../../../../../../shared/modal/cambio-sede-modal.component.html',
    styleUrls: ['../../../../../../shared/modal/cambio-sede-modal.component.css']
})
export class CambioSedeModalComponent {

    @Select(MarkerState.markerSelezionato) markerSelezionato$: Observable<any>;
    nomeSede: string;

    constructor(public modal: NgbActiveModal,
                private markerService: MarkerService,
                private toastr: ToastrService) {
        this.markerSelezionato$.subscribe(result => {
            if (result) {
                this.nomeSede = result.descrizione;
            } else {
                this.nomeSede = null;
            }
        });
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
