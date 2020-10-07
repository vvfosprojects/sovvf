import { Selector, State, Action, StateContext } from '@ngxs/store';
import { MeteoMarker } from '../../../maps/maps-model/meteo-marker.model';
import { AddMeteoMarker, RemoveMeteoMarker } from '../../actions/maps/meteo-markers.actions';
import { Injectable } from '@angular/core';

export interface MeteoMarkersStateModel {
    meteoMarkers: MeteoMarker[];
}

export const meteoMarkerStateDefaults: MeteoMarkersStateModel = {
    meteoMarkers: []
};

@Injectable()
@State<MeteoMarkersStateModel>({
    name: 'meteoMarker',
    defaults: meteoMarkerStateDefaults
})
export class MeteoMarkersState {

    constructor() { }

    @Selector()
    static meteoMarkers(state: MeteoMarkersStateModel): MeteoMarker[] {
        return state.meteoMarkers;
    }

    // ADD METEO MARKER
    @Action(AddMeteoMarker)
    addMeteoMarker({ getState, patchState, dispatch }: StateContext<MeteoMarkersStateModel>, action: AddMeteoMarker): void {
        const state = getState();

        patchState({
            ...state,
            meteoMarkers: addMeteoMarker(action.marker[0])
        });
    }

    // REMOVE METEO MARKER
    @Action(RemoveMeteoMarker)
    removeMeteoMarker({ getState, patchState }: StateContext<MeteoMarkersStateModel>): void {
        const state = getState();

        patchState({
            ...state,
            meteoMarkers: []
        });
    }
}

export function addMeteoMarker(marker: MeteoMarker): MeteoMarker[] {
    const markers: MeteoMarker[] = [];
    markers.push(marker);
    return markers;
}

