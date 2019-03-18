import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { MarkerState } from '../../../../store/states/maps/marker.state';
import { Observable } from 'rxjs';
import { ClearMarkerSelezionato } from '../../../../store/actions/maps/marker.actions';
import { ShowToastr } from '../../../../../../shared/store/actions/toastr/toastr.actions';
import { UnitaAttualeService } from '../../../../../navbar/navbar-service/unita-attuale/unita-attuale.service';

@Component({
    selector: 'app-cambio-sede-modal',
    templateUrl: './cambio-sede-modal.component.html',
    styleUrls: ['./cambio-sede-modal.component.css']
})
export class CambioSedeModalComponent {

    @Select(MarkerState.markerSelezionato) markerSelezionato$: Observable<any>;
    sede: any;

    constructor(public modal: NgbActiveModal,
                private unitaAttualeS: UnitaAttualeService,
                private store: Store) {
        this.markerSelezionato$.subscribe(result => {
            if (result) {
                this.sede = result;
            }
        });
    }

    cambioSede() {
        this.unitaAttualeS.sendUnitaOperativaAttuale([this.sede]);
        this.store.dispatch(new ClearMarkerSelezionato());
    }

    annullaCambioSede() {
        this.store.dispatch(new ShowToastr('warning', 'Attenzione', 'Azione annullata'));
    }

}
