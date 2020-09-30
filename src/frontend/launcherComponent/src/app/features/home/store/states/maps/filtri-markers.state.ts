import { Action, Selector, State, StateContext } from '@ngxs/store';
import { FiltroRichieste } from '../../../maps/maps-model/filtro-richieste.interface';
import { FiltroMezzi } from '../../../maps/maps-model/filtro-mezzi.interface';
import {
    SetPropritaRichiesta,
    UpdateStatiMezzi,
    UpdateStatiRichiesta,
    UpdateGenereMezzi,
    ToggleGestitaSC, UpdateMezziAltriComandi
} from '../../actions/maps/filtri-markers.actions';
import { FiltroSchedeContatto } from '../../../maps/maps-model/filtro-schede-contatto';
import { isEqual } from 'lodash';

export interface FiltriMarkersStateModel {
    filtroRichieste: FiltroRichieste;
    filtroMezzi: FiltroMezzi;
    filtroSchedeContatto: FiltroSchedeContatto;
}

export const FiltriMarkersStateDefaults: FiltriMarkersStateModel = {
    filtroRichieste: {
        stato: [],
        priorita: 0
    },
    filtroMezzi: {
        filtraPerAreaMappa: false,
        tipologia: [],
        stato: []
    },
    filtroSchedeContatto: {
        mostraGestite: false
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

    @Selector()
    static filtroSC(state: FiltriMarkersStateModel) {
        return state.filtroSchedeContatto;
    }

    @Selector()
    static filtriAttivi(state: FiltriMarkersState): boolean {
        return !isEqual(state, FiltriMarkersStateDefaults);
    }

    @Action(SetPropritaRichiesta)
    setPropritaRichiesta({ getState, patchState }: StateContext<FiltriMarkersStateModel>, action: SetPropritaRichiesta) {
        const state = getState();
        patchState({
            filtroRichieste: {
                ...state.filtroRichieste,
                priorita: action.priorita
            }
        });
    }

    @Action(UpdateStatiRichiesta)
    updateStatiRichiesta({ getState, patchState }: StateContext<FiltriMarkersStateModel>, action: UpdateStatiRichiesta) {
        const state = getState();
        patchState({
            filtroRichieste: {
                ...state.filtroRichieste,
                stato: action.statiFiltro
            }
        });
    }

    @Action(UpdateMezziAltriComandi)
    updateMezziAltriComandi({ getState, patchState }: StateContext<FiltriMarkersStateModel>, action: UpdateMezziAltriComandi) {
        const state = getState();
        patchState({
            filtroMezzi: {
                ...state.filtroMezzi,
                filtraPerAreaMappa: action.status
            }
        });
    }

    @Action(UpdateStatiMezzi)
    updateStatiMezzi({ getState, patchState }: StateContext<FiltriMarkersStateModel>, action: UpdateStatiMezzi) {
        const state = getState();
        patchState({
            filtroMezzi: {
                ...state.filtroMezzi,
                stato: action.statiFiltro
            }
        });
    }

    @Action(UpdateGenereMezzi)
    updateGenereMezzi({ getState, patchState }: StateContext<FiltriMarkersStateModel>, action: UpdateGenereMezzi) {
        const state = getState();
        patchState({
            filtroMezzi: {
                ...state.filtroMezzi,
                tipologia: action.tipologie
            }
        });
    }

    @Action(ToggleGestitaSC)
    toggleGestitaSC({ getState, patchState }: StateContext<FiltriMarkersStateModel>) {
        const state = getState();
        if (!state.filtroSchedeContatto.mostraGestite) {
            patchState({
                filtroSchedeContatto: {
                    mostraGestite: true
                }
            });
        } else {
            patchState({
                filtroSchedeContatto: FiltriMarkersStateDefaults.filtroSchedeContatto
            });
        }

    }
}
