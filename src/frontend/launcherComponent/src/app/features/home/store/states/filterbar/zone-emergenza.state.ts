import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {SetZoneEmergenza, SetZoneEmergenzaSelezionate} from '../../actions/filterbar/zone-emergenza.actions';

export interface ZoneEmergenzaStateModel {
  zoneEmergenza: string[];
  zoneEmergenzaSelezionate: string[];
}

export const zoneEmergenzaStateDefaults: ZoneEmergenzaStateModel = {
  zoneEmergenza: [],
  zoneEmergenzaSelezionate: [],
};

@Injectable()
@State<ZoneEmergenzaStateModel>({
  name: 'zoneEmergenza',
  defaults: zoneEmergenzaStateDefaults
})
export class ZoneEmergenzaState {

  constructor() {
  }

  @Selector()
  static zoneEmergenza(state: ZoneEmergenzaStateModel): string[] {
    return state.zoneEmergenza;
  }

  @Selector()
  static zoneEmergenzaSelezionate(state: ZoneEmergenzaStateModel): string[] {
    return state.zoneEmergenzaSelezionate;
  }

  @Action(SetZoneEmergenza)
  setZoneEmergenza({ getState, setState, patchState, dispatch }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
    const state = getState();
    patchState({
      ...state,
      zoneEmergenza: action.zoneEmergenza,
    });
  }

  @Action(SetZoneEmergenzaSelezionate)
  setZoneEmergenzaSelezionate({ getState, setState, patchState, dispatch }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
    const state = getState();
    patchState({
      ...state,
      zoneEmergenzaSelezionate: action.zoneEmergenza,
    });
  }
}
