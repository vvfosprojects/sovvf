import { Selector, State, Action, StateContext, Store } from '@ngxs/store';
import { DirectionInterface } from '../../maps-interface/direction.interface';
import { SetDirection, ClearDirection, SetDirectionTravelData } from '../actions/maps-direction.actions';
import { Injectable } from '@angular/core';
import { DirectionTravelDataInterface } from '../../maps-interface/direction-travel-data.interface';
import { CentroMappaState } from './centro-mappa.state';
import { SetCentroMappa } from '../actions/centro-mappa.actions';

export interface MapsDirectionStateModel {
    direction: DirectionInterface;
    travelData: DirectionTravelDataInterface;
}

export const mapsDirectionStateDefaults: MapsDirectionStateModel = {
    direction: null,
    travelData: null
};

@Injectable()
@State<MapsDirectionStateModel>({
    name: 'mapsDirection',
    defaults: mapsDirectionStateDefaults
})
export class MapsDirectionState {

    constructor(private store: Store) {
    }

    @Selector()
    static direction(state: MapsDirectionStateModel): DirectionInterface {
        return state.direction;
    }

    @Action(SetDirection)
    setDirection({ patchState }: StateContext<MapsDirectionStateModel>, action: SetDirection): void {
        patchState({
            direction: action.direction
        });
    }

    @Action(SetDirectionTravelData)
    setDirectionTravelData({ patchState, dispatch }: StateContext<MapsDirectionStateModel>, action: SetDirectionTravelData): void {
        let zoom: number;
        const totalKilometers = action.travelData.totalKilometers;
        if (totalKilometers < 2) {
            zoom = 17;
        } else if (totalKilometers < 5) {
            zoom = 15;
        } else if (totalKilometers < 15) {
            zoom = 14;
        } else if (totalKilometers < 25) {
            zoom = 13;
        } else if (totalKilometers < 50) {
            zoom = 11;
        } else if (totalKilometers < 150) {
            zoom = 9;
        } else if (totalKilometers < 200) {
            zoom = 7;
        } else {
            zoom = 6;
        }

        const centroMappa = this.store.selectSnapshot(CentroMappaState.centroMappa);
        dispatch(new SetCentroMappa({ coordinateCentro: centroMappa.coordinateCentro, zoom }));
        patchState({
            travelData: action.travelData
        });
    }

    @Action(ClearDirection)
    clearDirection({ patchState }: StateContext<MapsDirectionStateModel>): void {
        const mapsDirectionOff: DirectionInterface = {
            isVisible: false
        };
        patchState({
            direction: mapsDirectionOff,
            travelData: mapsDirectionStateDefaults.travelData
        });
    }
}
