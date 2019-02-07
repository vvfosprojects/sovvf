import { Action, Selector, State, StateContext } from '@ngxs/store';

// Action
import { SetMarkerMeteo } from '../actions/marker-meteo-switch.actions';

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
  @Action(SetMarkerMeteo)
  setMarkerMeteo({ getState, patchState }: StateContext<MarkerMeteoStateModel>, action: SetMarkerMeteo) {
    const state = getState();

    patchState({
      ...state,
      active: action.active
    });
  }
}
