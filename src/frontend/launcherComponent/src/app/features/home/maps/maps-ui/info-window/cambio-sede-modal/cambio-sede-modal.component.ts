import { Component, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { MarkerState } from '../../../../store/states/maps/marker.state';
import { Observable, Subscription } from 'rxjs';
import { ClearMarkerSedeSelezionato } from '../../../../store/actions/maps/marker.actions';
import { ShowToastr } from '../../../../../../shared/store/actions/toastr/toastr.actions';
import { SedeMarker } from '../../../maps-model/sede-marker.model';
import { SediMarkersState } from '../../../../store/states/maps/sedi-markers.state';
import { ToastrType } from '../../../../../../shared/enum/toastr';

@Component({
    selector: 'app-cambio-sede-modal',
    templateUrl: './cambio-sede-modal.component.html',
    styleUrls: ['./cambio-sede-modal.component.css']
})
export class CambioSedeModalComponent implements OnDestroy {

    @Select(MarkerState.markerSedeSelezionato) markerSelezionato$: Observable<string>;
    @Select(SediMarkersState.getSedeById) sedeMarkerById$: Observable<SedeMarker>;
    sede: SedeMarker;
    subscription = new Subscription();

    constructor(public modal: NgbActiveModal,
                private store: Store) {
        this.subscription.add(this.sedeMarkerById$.subscribe(s => this.sede = s));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    cambioSede() {
        // this.unitaAttualeS.sendUnitaOperativaAttuale([this.sede]);
        this.store.dispatch(new ClearMarkerSedeSelezionato());
    }

    annullaCambioSede() {
        this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Attenzione', 'Azione annullata'));
    }

}
