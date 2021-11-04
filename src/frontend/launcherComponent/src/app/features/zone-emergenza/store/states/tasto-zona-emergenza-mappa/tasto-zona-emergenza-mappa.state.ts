import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetZonaEmergenzaFromMappaActiveValue } from '../../actions/tasto-zona-emergenza-mappa/tasto-zona-emergenza-mappa.actions';

export interface TastoZonaEmergenzaMappaStateModel {
    active: boolean;
}

export const TastoZonaEmergenzaMappaStateModelDefatults: TastoZonaEmergenzaMappaStateModel = {
    active: false
};

@Injectable()
@State<TastoZonaEmergenzaMappaStateModel>({
    name: 'tastoZonaEmergenzaMappa',
    defaults: TastoZonaEmergenzaMappaStateModelDefatults
})

export class TastoZonaEmergenzaMappaState {

    @Selector()
    static tastoZonaEmergenzaMappaActive(state: TastoZonaEmergenzaMappaStateModel): boolean {
        return state.active;
    }

    @Action(SetZonaEmergenzaFromMappaActiveValue)
    setZonaEmergenzaFromMappaActiveValue({ patchState }: StateContext<TastoZonaEmergenzaMappaStateModel>, action: SetZonaEmergenzaFromMappaActiveValue): void {
        const value = action.value;
        patchState({
            active: value
        });
    }
}
