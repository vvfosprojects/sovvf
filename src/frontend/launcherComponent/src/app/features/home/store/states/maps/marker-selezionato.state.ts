import { Selector, State, Action, StateContext } from '@ngxs/store';

// Action
import { SetMarkerSelezionato, ClearMarkerSelezionato } from '../../actions/maps/marker-selezionato.actions';

export interface MarkerSelezionatoStateModel {
    markedMarker: any;
}

export const markerSelezionatoStateDefaults: MarkerSelezionatoStateModel = {
    markedMarker: null
};

@State<MarkerSelezionatoStateModel>({
    name: 'markedMarker',
    defaults: markerSelezionatoStateDefaults
})
export class MarkerSelezionatoState {

    constructor() { }

    @Selector()
    static markerSelezionato(state: MarkerSelezionatoStateModel) {
        return state.markedMarker;
    }

    @Action(SetMarkerSelezionato)
    setMarkerSelezionato({ getState, patchState }: StateContext<MarkerSelezionatoStateModel>, action: SetMarkerSelezionato) {
        const state = getState();

        patchState({
            ...state,
            markedMarker: action.markedMarker
        });
    }

    @Action(ClearMarkerSelezionato)
    clearMarkerSelezionato({ getState, patchState }: StateContext<MarkerSelezionatoStateModel>) {
        const state = getState();

        patchState({
            ...state,
            markedMarker: null
        });
    }
}
