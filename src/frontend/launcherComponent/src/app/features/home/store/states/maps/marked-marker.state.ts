import { Selector, State, Action, StateContext } from '@ngxs/store';

// Interface
import { DirectionInterface } from '../../../maps/maps-interface/direction-interface';

// Action
import { SetMarkedMarker, ClearMarkedMarker } from '../../actions/maps/marked-marker.actions';

export interface MarkedMarkerStateModel {
    markedMarker: any;
}

export const markedMarkerStateDefaults: MarkedMarkerStateModel = {
    markedMarker: null
};

@State<MarkedMarkerStateModel>({
    name: 'markedMarker',
    defaults: markedMarkerStateDefaults
})
export class MarkedMarkerState {

    constructor() { }

    @Selector()
    static markedMarker(state: MarkedMarkerStateModel) {
        return state.markedMarker;
    }

    @Action(SetMarkedMarker)
    setMarkedMarker({ getState, patchState }: StateContext<MarkedMarkerStateModel>, action: SetMarkedMarker) {
        const state = getState();

        patchState({
            ...state,
            markedMarker: action.markedMarker
        });
    }

    @Action(ClearMarkedMarker)
    clearMarkedMarker({ getState, patchState }: StateContext<MarkedMarkerStateModel>) {
        const state = getState();

        patchState({
            ...state,
            markedMarker: null
        });
    }
}
