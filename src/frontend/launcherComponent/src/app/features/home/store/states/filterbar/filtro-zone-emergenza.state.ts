import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    ResetFiltriStatiZone,
    ResetFiltriZoneSelezionate,
    SetFiltroZoneEmergenza,
    SetFiltroZoneEmergenzaSelezionate
} from '../../actions/filterbar/filtro-zone-emergenza.actions';
import { patch } from '@ngxs/store/operators';


export interface FiltroZoneEmergenzaStateModel {
    zoneEmergenza: any[];
    zoneEmergenzaSelezionate: string[];
}

export const FiltroZoneEmergenzaStateDefaults: FiltroZoneEmergenzaStateModel = {
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
@State<FiltroZoneEmergenzaStateModel>({
    name: 'filtroZoneEmergenza',
    defaults: FiltroZoneEmergenzaStateDefaults
})
export class FiltroZoneEmergenzaState {

    constructor() {
    }

    @Selector()
    static filtriZoneEmergenza(state: FiltroZoneEmergenzaStateModel): any[] {
        return state.zoneEmergenza;
    }

    @Selector()
    static filtriZoneEmergenzaSelezionate(state: FiltroZoneEmergenzaStateModel): string[] {
        return state.zoneEmergenzaSelezionate;
    }

    @Action(SetFiltroZoneEmergenza)
    setZoneEmergenza({ patchState }: StateContext<FiltroZoneEmergenzaStateModel>, action: any): void {
        /*
        const zoneEmergenza: any = {
          name: action.name
        };
        patchState({
          zoneEmergenza,
        });
        */
    }

    @Action(SetFiltroZoneEmergenzaSelezionate)
    setZoneEmergenzaSelezionate({ getState, setState, patchState, dispatch }: StateContext<FiltroZoneEmergenzaStateModel>, action: any): void {
        const state = getState();
        patchState({
            ...state,
            zoneEmergenzaSelezionate: action.zoneEmergenza,
        });
    }

    @Action(ResetFiltriStatiZone)
    resetFiltriStatiZone({ setState }: StateContext<FiltroZoneEmergenzaStateModel>, action: any): void {
        setState(FiltroZoneEmergenzaStateDefaults);
    }

    @Action(ResetFiltriZoneSelezionate)
    resetFiltriZoneSelezionate({ setState }: StateContext<FiltroZoneEmergenzaStateModel>, action: any): void {
        setState(
            patch({
                zoneEmergenzaSelezionate: FiltroZoneEmergenzaStateDefaults.zoneEmergenzaSelezionate,
            })
        );
    }
}
