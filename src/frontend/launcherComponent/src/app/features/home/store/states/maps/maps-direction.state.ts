import { Selector, State, Action, StateContext } from '@ngxs/store';
import { DirectionInterface } from '../../../maps/maps-interface/direction-interface';
import { SetDirection, ClearDirection } from '../../actions/maps/maps-direction.actions';
import { Injectable } from '@angular/core';

export interface MapsDirectionStateModel {
    direction: DirectionInterface;
}

export const mapsDirectionStateDefaults: MapsDirectionStateModel = {
    direction: {
        isVisible: false
    }
};

@Injectable()
@State<MapsDirectionStateModel>({
    name: 'mapsDirection',
    defaults: mapsDirectionStateDefaults
})
export class MapsDirectionState {

    constructor() { }

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

    @Action(ClearDirection)
    clearDirection({ patchState }: StateContext<MapsDirectionStateModel>): void {
        const mapsDirectionOff: DirectionInterface = {
            isVisible: false
        };
        patchState({
            direction: mapsDirectionOff
        });
    }
}
