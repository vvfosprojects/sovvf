import { Action, Selector, State, StateContext } from '@ngxs/store';
import { FiltroRichieste } from '../../../maps/maps-model/filtro-richieste.interface';
import { FiltroMezzi } from '../../../maps/maps-model/filtro-mezzi.interface';
import { SetPropritaRichiesta, UpdateStatiMezzi, UpdateStatiRichiesta, UpdateTipologieMezzi } from '../../actions/maps/filtri-markers.actions';

export interface FiltriMarkersStateModel {
    filtroRichieste: FiltroRichieste;
    filtroMezzi: FiltroMezzi;
}

export const FiltriMarkersStateDefaults: FiltriMarkersStateModel = {
    filtroRichieste: {
        stato: [],
        priorita: null
    },
    filtroMezzi: {
        tipologia: [],
        stato: []
    }
};

@State<FiltriMarkersStateModel>({
    name: 'filtriMarkers',
    defaults: FiltriMarkersStateDefaults
})
export class FiltriMarkersState {

    @Selector()
    static filtroRichieste(state: FiltriMarkersStateModel) {
        return state.filtroRichieste;
    }

    @Selector()
    static filtroMezzi(state: FiltriMarkersStateModel) {
        return state.filtroMezzi;
    }

    @Action(SetPropritaRichiesta)
    setPropritaRichiesta({ getState, patchState }: StateContext<FiltriMarkersStateModel>, action: SetPropritaRichiesta) {
        const state = getState();
        patchState({
            filtroRichieste: {
                stato: state.filtroRichieste.stato,
                priorita: action.priorita
            }
        });
    }

    @Action(UpdateStatiRichiesta)
    updateStatiRichiesta({ getState, patchState }: StateContext<FiltriMarkersStateModel>, action: UpdateStatiRichiesta) {
        const state = getState();
        patchState({
            filtroRichieste: {
                stato: action.statiFiltro,
                priorita: state.filtroRichieste.priorita
            }
        });
    }

    @Action(UpdateStatiMezzi)
    updateStatiMezzi({ getState, patchState }: StateContext<FiltriMarkersStateModel>, action: UpdateStatiMezzi) {
        const state = getState();
        patchState({
            filtroMezzi: {
                tipologia: state.filtroMezzi.tipologia,
                stato: action.statiFiltro
            }
        });
    }

    @Action(UpdateTipologieMezzi)
    updateTipologieMezzi({ getState, patchState }: StateContext<FiltriMarkersStateModel>, action: UpdateTipologieMezzi) {
        const state = getState();
        patchState({
            filtroMezzi: {
                tipologia: action.tipologie,
                stato: state.filtroMezzi.stato
            }
        });
    }
}
