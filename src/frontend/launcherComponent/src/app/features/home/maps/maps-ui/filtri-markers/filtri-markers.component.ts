import { Component, ViewEncapsulation } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { FiltriMarkersState } from '../../../store/states/maps/filtri-markers.state';
import { FiltroRichieste } from '../../maps-model/filtro-richieste.interface';
import { Priorita } from '../../../../../shared/model/sintesi-richiesta.model';
import {
    SetPropritaRichiesta,
    UpdateStatiMezzi,
    UpdateStatiRichiesta,
    UpdateGenereMezzi,
    ToggleGestitaSC,
    UpdateMezziAltriComandi
} from '../../../store/actions/maps/filtri-markers.actions';
import { StatoRichiesta } from '../../../../../shared/enum/stato-richiesta.enum';
import { FiltroMezzi } from '../../maps-model/filtro-mezzi.interface';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';
import { TipologicheMezziState } from '../../../store/states/composizione-partenza/tipologiche-mezzi.state';
import { TipologicaComposizionePartenza } from '../../../composizione-partenza/interface/filtri/tipologica-composizione-partenza.interface';
import { FiltroSchedeContatto } from '../../maps-model/filtro-schede-contatto';
import { ViewComponentState } from '../../../store/states/view/view.state';

@Component({
    selector: 'app-filtri-markers',
    templateUrl: './filtri-markers.component.html',
    styleUrls: ['./filtri-markers.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FiltriMarkersComponent {

    @Select(FiltriMarkersState.filtroRichieste) filtroRichieste$: Observable<FiltroRichieste>;
    @Select(FiltriMarkersState.filtroMezzi) filtroMezzi$: Observable<FiltroMezzi>;
    @Select(FiltriMarkersState.filtroSC) filtroSC$: Observable<FiltroSchedeContatto>;
    @Select(FiltriMarkersState.filtriAttivi) filtriAttivi$: Observable<boolean>;
    filtriAttivi: boolean;
    @Select(TipologicheMezziState.generiMezzi) generiMezzi$: Observable<TipologicaComposizionePartenza[]>;
    @Select(ViewComponentState.schedeContattoStatus) scStatus$: Observable<boolean>;

    private subscription = new Subscription();

    constructor(private store: Store,
                config: NgbDropdownConfig) {
        config.placement = 'bottom-right';
        config.autoClose = 'outside';
        this.getFiltriAttivi();
    }

    getFiltriAttivi(): void {
        this.subscription.add(this.filtriAttivi$.subscribe(r => {
            this.filtriAttivi = r;
        }));
    }

    changePriorita(priorita: Priorita): void {
        this.store.dispatch(new SetPropritaRichiesta(priorita));
    }

    changeStatiRichiesta(statiRichiesta: StatoRichiesta[]): void {
        this.store.dispatch(new UpdateStatiRichiesta(statiRichiesta));
    }

    onChangeMezziAltriComandi(status: boolean): void {
        this.store.dispatch(new UpdateMezziAltriComandi(status));
    }

    changeStatiMezzi(statiMezzi: StatoMezzo[]): void {
        this.store.dispatch(new UpdateStatiMezzi(statiMezzi));
    }

    changeGenere(genere: TipologicaComposizionePartenza[]): void {
        this.store.dispatch(new UpdateGenereMezzi(genere.map(x => x.descrizione)));
    }

    toggleGestitaSC(): void {
        this.store.dispatch(new ToggleGestitaSC());
    }
}
