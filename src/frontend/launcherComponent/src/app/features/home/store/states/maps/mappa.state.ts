import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AreaMappaState } from './area-mappa.state';
import { CentroMappaState } from './centro-mappa.state';
import { MapsDirectionState } from './maps-direction.state';
import { AddLayersMappa, RemoveLayersMappa } from '../../actions/maps/mappa.actions';
import { append, patch } from '@ngxs/store/operators';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

export interface MappaStateModel {
    featureLayers: FeatureLayer[];
}

export const MappaStateDefaults: MappaStateModel = {
    featureLayers: []
};

@Injectable()
@State<MappaStateModel>({
    name: 'mappa',
    defaults: MappaStateDefaults,
    children: [
        AreaMappaState,
        CentroMappaState,
        MapsDirectionState
    ]
})
export class MappaState {

    @Selector()
    static featureLayers(state: MappaStateModel): FeatureLayer[] {
        return state.featureLayers;
    }

    @Action(AddLayersMappa)
    addLayersMappa({ setState, dispatch }: StateContext<MappaStateModel>, action: AddLayersMappa): void {
        console.log('@Action(AddLayersMappa)', JSON.stringify(action));
        setState(
            patch({
                featureLayers: append(action.layers)
            })
        );
    }

    @Action(RemoveLayersMappa)
    RemoveLayersMappa({ patchState, dispatch }: StateContext<MappaStateModel>, action: AddLayersMappa): void {
        console.log('@Action(AddLayersMappa)', JSON.stringify(action));
        patchState({
            featureLayers: MappaStateDefaults.featureLayers
        });
    }
}
