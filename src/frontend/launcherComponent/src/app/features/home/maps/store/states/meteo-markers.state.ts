import { Selector, State, Action, StateContext } from '@ngxs/store';

// Model
import { MeteoMarker } from '../../maps-model/meteo-marker.model';
import { AddMeteoMarker, RemoveMeteoMarker } from '../actions/meteo-markers.actions';

// Action

export interface MeteoMarkersStateModel {
    meteoMarkers: MeteoMarker[];
}

export const meteoMarkerStateDefaults: MeteoMarkersStateModel = {
    meteoMarkers: []
};

@State<MeteoMarkersStateModel>({
    name: 'meteoMarker',
    defaults: meteoMarkerStateDefaults
})
export class MeteoMarkersState {

    constructor() { }

    @Selector()
    static meteoMarkers(state: MeteoMarkersStateModel) {
        return state.meteoMarkers;
    }

    // ADD METEO MARKER
    @Action(AddMeteoMarker)
    addMeteoMarker({ getState, patchState, dispatch }: StateContext<MeteoMarkersStateModel>, action: AddMeteoMarker) {
        const state = getState();

        patchState({
            ...state,
            meteoMarkers: addMeteoMarker(action.marker[0])
        });
    }

    // REMOVE METEO MARKER
    @Action(RemoveMeteoMarker)
    removeMeteoMarker({ getState, patchState }: StateContext<MeteoMarkersStateModel>, action: RemoveMeteoMarker) {
        const state = getState();

        patchState({
            ...state,
            meteoMarkers: []
        });
    }
}

export function addMeteoMarker(marker: MeteoMarker) {
    const markers: MeteoMarker[] = [];
    markers.push(marker);
    return markers;
}

export function copyObj(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}
