import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    ResetFiltriStatiZone, ResetFiltriZoneSelezionate,
    SetZoneEmergenza,
    SetZoneEmergenzaSelezionate
} from '../../actions/filterbar/zone-emergenza.actions';
import { patch } from '@ngxs/store/operators';


export interface ZoneEmergenzaStateModel {
    zoneEmergenza: any[];
    zoneEmergenzaSelezionate: string[];
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
