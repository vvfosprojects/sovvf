import { Selector, State, Action, StateContext } from '@ngxs/store';

// Action
import { SetMarkerSelezionato, ClearMarkerSelezionato, SetMarkerColorato, ClearMarkerColorato, SetMarkerZIndex, ClearMarkerZIndex } from '../../actions/maps/marker-selezionato.actions';

export interface MarkerStateModel {
    markedMarker: any;
    markerColorato: any;
    markerZIndex: any;
}

export const markerStateDefaults: MarkerStateModel = {
    markedMarker: null,
    markerColorato: null,
    markerZIndex: null
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

    @Selector()
    static markerColorato(state: MarkerStateModel) {
        return state.markerColorato;
    }

    @Selector()
    static markerZIndex(state: MarkerStateModel) {
        return state.markerZIndex;
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

    @Action(SetMarkerColorato)
    setMarkerColorato({ getState, patchState, dispatch }: StateContext<MarkerStateModel>, action: SetMarkerColorato) {
        const state = getState();

        patchState({
            ...state,
            markerColorato: action.markerColorato
        });
        dispatch(new SetMarkerZIndex(action.markerColorato));
    }

    @Action(ClearMarkerColorato)
    clearMarkerColorato({ getState, patchState, dispatch }: StateContext<MarkerStateModel>) {
        const state = getState();

        patchState({
            ...state,
            markerColorato: null
        });
        dispatch(new ClearMarkerZIndex());
    }

    @Action(SetMarkerZIndex)
    setMarkerZIndex({ getState, patchState }: StateContext<MarkerStateModel>, action: SetMarkerZIndex) {
        const state = getState();

        patchState({
            ...state,
            markerZIndex: action.markerZIndex
        });
    }

    @Action(ClearMarkerZIndex)
    clearMarkerZIndex({ getState, patchState }: StateContext<MarkerStateModel>) {
        const state = getState();

        patchState({
            ...state,
            markerZIndex: null
        });
    }
}
