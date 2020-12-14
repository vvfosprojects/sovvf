import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {
  RemoveFakeStatoRichiesta, ResetFiltriStatiZone,
  SetFakeStatoRichiesta,
  SetZoneEmergenza,
  SetZoneEmergenzaSelezionate
} from '../../actions/filterbar/zone-emergenza.actions';

export interface ZoneEmergenzaStateModel {
  zoneEmergenza: string[];
  zoneEmergenzaSelezionate: string[];
  fakeStatoRichiesta: string[];
}

export const zoneEmergenzaStateDefaults: ZoneEmergenzaStateModel = {
  zoneEmergenza: [],
  zoneEmergenzaSelezionate: [],
  fakeStatoRichiesta: [],
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
  static fakeStatoRichiesta(state: ZoneEmergenzaStateModel): string[] {
    return state.fakeStatoRichiesta;
  }

  @Selector()
  static zoneEmergenza(state: ZoneEmergenzaStateModel): string[] {
    return state.zoneEmergenza;
  }

  @Selector()
  static zoneEmergenzaSelezionate(state: ZoneEmergenzaStateModel): string[] {
    return state.zoneEmergenzaSelezionate;
  }

  @Action(SetFakeStatoRichiesta)
  setFakeStatoRichiesta({ getState, setState, patchState, dispatch }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
    const state = getState();
    const singleValue = action.zoneEmergenza;
    const arrayStati = [...state.fakeStatoRichiesta];
    arrayStati.push(singleValue);
    patchState({
      fakeStatoRichiesta: arrayStati,
    });
  }

  @Action(RemoveFakeStatoRichiesta)
  removeFakeStatoRichiesta({ getState, setState, patchState, dispatch }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
    const state = getState();
    const singleValue = action.zoneEmergenza;
    const arrayStati = [...state.fakeStatoRichiesta];
    const arrayStatiFiltrati = arrayStati.filter(x => x !== singleValue);
    patchState({
      fakeStatoRichiesta: arrayStatiFiltrati,
    });
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

  @Action(ResetFiltriStatiZone)
  resetFiltriStatiZone({ setState }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
    setState(zoneEmergenzaStateDefaults);
  }
}
