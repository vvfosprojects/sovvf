import { Selector, State, Action, StateContext } from '@ngxs/store';

// Interface
import { DirectionInterface } from '../../service/direction-service/direction-interface';

// Action
import { SetDirection, ClearDirection } from '../actions/maps-direction.actions';

export interface MapsDirectionStateModel {
    direction: DirectionInterface;
}

export const mapsDirectionStateDefaults: MapsDirectionStateModel = {
    direction: {
        isVisible: false
    }
};

@State<MapsDirectionStateModel>({
    name: 'mapsDirection',
    defaults: mapsDirectionStateDefaults
})
export class MapsDirectionState {

    constructor() { }

    @Selector()
    static direction(state: MapsDirectionStateModel) {
        return state.direction;
    }

    @Action(SetDirection)
    setDirection({ getState, patchState }: StateContext<MapsDirectionStateModel>, action: SetDirection) {
        const state = getState();

        patchState({
            ...state,
            direction: action.direction
        });
    }

    @Action(ClearDirection)
    clearDirection({ getState, patchState }: StateContext<MapsDirectionStateModel>) {
        const state = getState();

        const mapsDirectionOff: DirectionInterface = {
            isVisible: false
        };

        patchState({
            ...state,
            direction: mapsDirectionOff
        });
    }
}
