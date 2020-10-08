import { Action, Selector, State, StateContext } from '@ngxs/store';
import { FiltroRichieste } from '../../../maps/maps-model/filtro-richieste.interface';
import { FiltroMezzi } from '../../../maps/maps-model/filtro-mezzi.interface';
import { FiltroSchedeContatto } from '../../../maps/maps-model/filtro-schede-contatto';
import { isEqual } from 'lodash';
import {
    SetPropritaRichiesta,
    UpdateStatiMezzi,
    UpdateStatiRichiesta,
    UpdateGenereMezzi,
    ToggleGestitaSC,
    UpdateMezziAltriComandi
} from '../../actions/maps/filtri-markers.actions';
import { Injectable } from '@angular/core';

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

@Injectable()
@State<FiltriMarkersStateModel>({
    name: 'filtriMarkers',
    defaults: FiltriMarkersStateDefaults
})
export class FiltriMarkersState {

    @Selector()
    static filtroRichieste(state: FiltriMarkersStateModel): FiltroRichieste {
        return state.filtroRichieste;
    }

    @Selector()
    static filtroMezzi(state: FiltriMarkersStateModel): FiltroMezzi {
        return state.filtroMezzi;
    }

    @Selector()
    static filtroSC(state: FiltriMarkersStateModel): FiltroSchedeContatto {
        return state.filtroSchedeContatto;
    }

    @Selector()
    static filtriAttivi(state: FiltriMarkersState): boolean {
        return !isEqual(state, FiltriMarkersStateDefaults);
    }

    @Action(SetPropritaRichiesta)
    setPropritaRichiesta({ getState, patchState }: StateContext<FiltriMarkersStateModel>, action: SetPropritaRichiesta): void {
        const state = getState();
        patchState({
            filtroRichieste: {
                ...state.filtroRichieste,
                priorita: action.priorita
            }
        });
    }

    @Action(UpdateStatiRichiesta)
    updateStatiRichiesta({ getState, patchState }: StateContext<FiltriMarkersStateModel>, action: UpdateStatiRichiesta): void {
        const state = getState();
        patchState({
            filtroRichieste: {
                ...state.filtroRichieste,
                stato: action.statiFiltro
            }
        });
    }

    @Action(UpdateMezziAltriComandi)
    updateMezziAltriComandi({ getState, patchState }: StateContext<FiltriMarkersStateModel>, action: UpdateMezziAltriComandi): void {
        const state = getState();
        patchState({
            filtroMezzi: {
                ...state.filtroMezzi,
                filtraPerAreaMappa: action.status
            }
        });
    }

    @Action(UpdateStatiMezzi)
    updateStatiMezzi({ getState, patchState }: StateContext<FiltriMarkersStateModel>, action: UpdateStatiMezzi): void {
        const state = getState();
        patchState({
            filtroMezzi: {
                ...state.filtroMezzi,
                stato: action.statiFiltro
            }
        });
    }

    @Action(UpdateGenereMezzi)
    updateGenereMezzi({ getState, patchState }: StateContext<FiltriMarkersStateModel>, action: UpdateGenereMezzi): void {
        const state = getState();
        patchState({
            filtroMezzi: {
                ...state.filtroMezzi,
                tipologia: action.tipologie
            }
        });
    }

    @Action(ToggleGestitaSC)
    toggleGestitaSC({ getState, patchState }: StateContext<FiltriMarkersStateModel>): void {
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
