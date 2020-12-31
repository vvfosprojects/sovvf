import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {
  RemoveFakeStatoRichiesta, RemovePeriodoChiuse, ResetFiltriStatiZone, ResetFiltriZoneSelezionate,
  SetFakeStatoRichiesta, SetPeriodoChiuse,
  SetZoneEmergenza,
  SetZoneEmergenzaSelezionate
} from '../../actions/filterbar/zone-emergenza.actions';
import {patch} from '@ngxs/store/operators';


export interface ZoneEmergenzaStateModel {
  zoneEmergenza: any[];
  zoneEmergenzaSelezionate: string[];
  fakeStatoRichiesta: string[];
  periodoChiuse: any;
}

export const zoneEmergenzaStateDefaults: ZoneEmergenzaStateModel = {
  zoneEmergenza: [
    {
      name: 'test fake number 1',
      selected: false,
    },
    {
      name: 'test fake number 2',
      selected: false,
    }
  ],
  zoneEmergenzaSelezionate: [],
  fakeStatoRichiesta: [],
  periodoChiuse: {
    da: null,
    a: null,
    data: null,
    turno: null,
  }
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
  static periodoChiuse(state: ZoneEmergenzaStateModel): any {
    return state.periodoChiuse;
  }

  @Selector()
  static fakeStatoRichiesta(state: ZoneEmergenzaStateModel): string[] {
    return state.fakeStatoRichiesta;
  }

  @Selector()
  static zoneEmergenza(state: ZoneEmergenzaStateModel): any[] {
    return state.zoneEmergenza;
  }

  @Selector()
  static zoneEmergenzaSelezionate(state: ZoneEmergenzaStateModel): string[] {
    return state.zoneEmergenzaSelezionate;
  }

  @Action(SetZoneEmergenza)
  setZoneEmergenza({ patchState }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
    /*
    const zoneEmergenza: any = {
      name: action.name
    };
    patchState({
      zoneEmergenza,
    });
    */
  }

  @Action(SetPeriodoChiuse)
  setPeriodoChiuse({ patchState }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
    const periodoChiuse = {
      da: action.periodo.da,
      a: action.periodo.a,
      data: action.periodo.data,
      turno: action.periodo.turno,
    };
    patchState({
      periodoChiuse,
    });
  }

  @Action(RemovePeriodoChiuse)
  removePeriodoChiuse({ patchState }: StateContext<ZoneEmergenzaStateModel>): void {
    const periodoChiuse = {
      da: null,
      a: null,
      data: null,
      turno: null,
    };
    patchState({
      periodoChiuse,
    });
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

  @Action(ResetFiltriZoneSelezionate)
  resetFiltriZoneSelezionate({ setState }: StateContext<ZoneEmergenzaStateModel>, action: any): void {
    setState(
      patch({
        zoneEmergenzaSelezionate: zoneEmergenzaStateDefaults.zoneEmergenzaSelezionate,
      })
    );
  }
}
