import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetChiamataFromMappaActiveValue } from '../actions/tasto-chiamata-mappa.actions';

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
    setChiamataFromMappaActiveValue({ patchState }: StateContext<TastoChiamataMappaStateModel>, action: SetChiamataFromMappaActiveValue): void {
        const value = action.value;
        patchState({
            active: value
        });
    }
}
