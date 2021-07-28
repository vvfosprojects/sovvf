import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetChiamataFromMappaActiveValue } from '../../actions/maps/tasto-chiamata-mappa.actions';

export interface TastoChiamataMappaStateModel {
    active: boolean;
}

export const TastoChiamataMappaStateModelDefatults: TastoChiamataMappaStateModel = {
    active: false
};

@Injectable()
@State<TastoChiamataMappaStateModel>({
    name: 'tastoCiamataMappa',
    defaults: TastoChiamataMappaStateModelDefatults
})

export class TastoChiamataMappaState {

    @Selector()
    static tastoChiamataMappaActive(state: TastoChiamataMappaStateModel): boolean {
        return state.active;
    }

    @Action(SetChiamataFromMappaActiveValue)
    setChiamataFromMappaActiveValue({ getState, patchState }: StateContext<TastoChiamataMappaStateModel>, action: SetChiamataFromMappaActiveValue): void {
        const state = getState();
        const activeStatus = state.active;
        const value = action.value ? action.value : !activeStatus;

        patchState({
            active: value
        });
    }
}
