import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetMarkerMeteoSwitch } from '../../actions/filterbar/marker-meteo-switch.actions';
import { RemoveMeteoMarker } from '../../actions/maps/meteo-markers.actions';
import { Injectable } from '@angular/core';

export interface MarkerMeteoStateModel {
    active: boolean;
}

export const markerMeteoStateDefaults: MarkerMeteoStateModel = {
    active: false
};

@Injectable()
@State<MarkerMeteoStateModel>({
    name: 'markerMeteoSwitch',
    defaults: markerMeteoStateDefaults
})
export class MarkerMeteoState {

    constructor() {
    }

    // SELECTOR
    @Selector()
    static active(state: MarkerMeteoStateModel): boolean {
        return state.active;
    }

    // SET MARKER METEO
    @Action(SetMarkerMeteoSwitch)
    setMarkerMeteoSwitch({ getState, patchState, dispatch }: StateContext<MarkerMeteoStateModel>, action: SetMarkerMeteoSwitch): void {
        const state = getState();
        if (!action.active) {
            dispatch(new RemoveMeteoMarker());
        }
        patchState({
            ...state,
            active: action.active
        });
    }
}
