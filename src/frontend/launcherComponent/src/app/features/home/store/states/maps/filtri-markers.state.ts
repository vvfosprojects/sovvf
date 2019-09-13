import { Action, Selector, State, StateContext } from '@ngxs/store';
import { FiltroRichieste } from '../../../maps/maps-model/filtro-richieste.interface';
import { FiltroMezzi } from '../../../maps/maps-model/filtro-mezzi.interface';
import { SetPropritaRichiesta, UpdateStatiRichiesta } from '../../actions/maps/filtri-markers.actions';
import { Priorita } from '../../../../../shared/model/sintesi-richiesta.model';

export interface FiltriMarkersStateModel {
    filtroRichieste: FiltroRichieste;
    filtroMezzi: FiltroMezzi;
}

export const FiltriMarkersStateDefaults: FiltriMarkersStateModel = {
    filtroRichieste: {
        stato: [],
        priorita: Priorita.Bassissima
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
}
