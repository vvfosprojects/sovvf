import { Selector, State, Action, StateContext } from '@ngxs/store';

import { SetMarkerSelezionato, ClearMarkerSelezionato } from '../../actions/maps/marker.actions';

export interface MarkerStateModel {
    markedMarker: any;

}

export const markerStateDefaults: MarkerStateModel = {
    markedMarker: null,
};

@State<MarkerStateModel>({
    name: 'marker',
    defaults: markerStateDefaults
})
export class MarkerState {

    constructor() {
    }

    @Selector()
    static markerSelezionato(state: MarkerStateModel) {
        return state.markedMarker;
    }

    @Action(SetMarkerSelezionato)
    setMarkerSelezionato({ getState, patchState }: StateContext<MarkerStateModel>, action: SetMarkerSelezionato) {
        const state = getState();

        patchState({
            ...state,
            markedMarker: action.markedMarker
        });
    }

    @Action(ClearMarkerSelezionato)
    clearMarkerSelezionato({ getState, patchState }: StateContext<MarkerStateModel>) {
        const state = getState();

        patchState({
            ...state,
            markedMarker: null
        });
    }

}
