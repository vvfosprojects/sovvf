import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FiltriMarkersState } from '../../../store/states/maps/filtri-markers.state';
import { FiltroRichieste } from '../../maps-model/filtro-richieste.interface';
import { Priorita } from '../../../../../shared/model/sintesi-richiesta.model';
import { SetPropritaRichiesta, UpdateStatiRichiesta } from '../../../store/actions/maps/filtri-markers.actions';
import { StatoRichiesta } from '../../../../../shared/enum/stato-richiesta.enum';

@Component({
    selector: 'app-filtri-markers',
    templateUrl: './filtri-markers.component.html',
    styleUrls: ['./filtri-markers.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FiltriMarkersComponent implements OnInit {

    @Select(FiltriMarkersState.filtroRichieste) filtroRichieste$: Observable<FiltroRichieste>;

    constructor(private store: Store,
                config: NgbDropdownConfig) {
        config.placement = 'bottom-right';
        config.autoClose = 'outside';
    }

    ngOnInit() {
    }

    changePriorita(priorita: Priorita) {
        this.store.dispatch(new SetPropritaRichiesta(priorita));
    }

    changeStati(statiRichiesta: StatoRichiesta[]) {
        this.store.dispatch(new UpdateStatiRichiesta(statiRichiesta));
    }
}
