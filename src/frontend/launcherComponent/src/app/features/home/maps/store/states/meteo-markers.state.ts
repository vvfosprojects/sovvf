import { Selector, State, Action, StateContext } from '@ngxs/store';

// Model
import { MeteoMarker } from '../../maps-model/meteo-marker.model';
import { AddMeteoMarker, RemoveMeteoMarker } from '../actions/meteo-markers.actions';

// Action

export interface MeteoMarkersStateModel {
    meteoMarkers: MeteoMarker[];
}

export const boxesStateDefaults: MeteoMarkersStateModel = {
    meteoMarkers: []
};

@State<MeteoMarkersStateModel>({
    name: 'filterbar',
    defaults: boxesStateDefaults
})
export class MeteoMarkersState {

    constructor() { }

    @Selector()
    static meteoMarkers(state: MeteoMarkersStateModel) {
        return state.meteoMarkers;
    }

    // ADD METEO MARKER
    @Action(AddMeteoMarker)
    addMeteoMarker({ getState, patchState }: StateContext<MeteoMarkersStateModel>, action: AddMeteoMarker) {
        const state = getState();

        const meteoMarkers = copyObj(state.meteoMarkers);

        patchState({
            ...state,
            meteoMarkers: addMeteoMarker(meteoMarkers, action.marker)
        });
    }

    // REMOVE METEO MARKER
    @Action(RemoveMeteoMarker)
    removeMeteoMarker({ getState, patchState }: StateContext<MeteoMarkersStateModel>, action: RemoveMeteoMarker) {
        const state = getState();

        const meteoMarkers = copyObj(state.meteoMarkers);

        patchState({
            ...state,
            meteoMarkers: removeMeteoMarker(meteoMarkers, action.marker)
        });
    }
}

export function addMeteoMarker(markers: MeteoMarker[], marker: MeteoMarker) {
    markers.push(marker);
    return markers;
}

export function removeMeteoMarker(markers: MeteoMarker[], marker: MeteoMarker) {
    markers.pop();
    return markers;
}

export function copyObj(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}
