import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FiltriMarkersState } from '../../../store/states/maps/filtri-markers.state';
import { FiltroRichieste } from '../../maps-model/filtro-richieste.interface';
import { Priorita } from '../../../../../shared/model/sintesi-richiesta.model';
import { SetPropritaRichiesta, UpdateStatiMezzi, UpdateStatiRichiesta, UpdateTipologieMezzi } from '../../../store/actions/maps/filtri-markers.actions';
import { StatoRichiesta } from '../../../../../shared/enum/stato-richiesta.enum';
import { FiltroMezzi } from '../../maps-model/filtro-mezzi.interface';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';
import { TipologicheMezziState } from '../../../store/states/composizione-partenza/tipologiche-mezzi.state';
import { DescrizioneTipologicaMezzo } from '../../../composizione-partenza/interface/filtri/descrizione-filtro-composizione-interface';

@Component({
    selector: 'app-filtri-markers',
    templateUrl: './filtri-markers.component.html',
    styleUrls: ['./filtri-markers.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FiltriMarkersComponent implements OnInit {

    @Select(FiltriMarkersState.filtroRichieste) filtroRichieste$: Observable<FiltroRichieste>;
    @Select(FiltriMarkersState.filtroMezzi) filtroMezzi$: Observable<FiltroMezzi>;
    @Select(TipologicheMezziState.generiMezzi) generiMezzi$: Observable<DescrizioneTipologicaMezzo>;

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

    changeStatiRichiesta(statiRichiesta: StatoRichiesta[]) {
        this.store.dispatch(new UpdateStatiRichiesta(statiRichiesta));
    }

    changeStatiMezzi(statiMezzi: StatoMezzo[]) {
        this.store.dispatch(new UpdateStatiMezzi(statiMezzi));
    }

    changeTipologie(tipologie: string[]) {
        this.store.dispatch(new UpdateTipologieMezzi(tipologie));
    }
}
