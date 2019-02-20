import { Action, Selector, State, StateContext } from '@ngxs/store';

// Action
import { SetMarkerMeteoSwitch } from '../actions/marker-meteo-switch.actions';
import { RemoveMeteoMarker } from '../../../maps/store';

export interface MarkerMeteoStateModel {
  active: boolean;
}

export const markerMeteoStateDefaults: MarkerMeteoStateModel = {
  active: false
};

@State<MarkerMeteoStateModel>({
  name: 'markerMeteo',
  defaults: markerMeteoStateDefaults
})
export class MarkerMeteoState {

  constructor() { }

  // SELECTOR
  @Selector()
  static active(state: MarkerMeteoStateModel) {
    return state.active;
  }

  // SET MARKER METEO
  @Action(SetMarkerMeteoSwitch)
  setMarkerMeteoSwitch({ getState, patchState, dispatch }: StateContext<MarkerMeteoStateModel>, action: SetMarkerMeteoSwitch) {
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
