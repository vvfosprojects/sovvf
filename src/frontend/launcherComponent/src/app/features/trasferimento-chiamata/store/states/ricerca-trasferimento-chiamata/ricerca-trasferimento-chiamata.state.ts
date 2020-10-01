import { State, Selector, Action, StateContext } from '@ngxs/store';
import { CleaRicercaTrasferimentoChiamata, SetRicercaTrasferimentoChiamata } from '../../actions/ricerca-trasferimento-chiamata/ricerca-trasferimento-chiamata.actions';
import { Injectable } from '@angular/core';

export interface RicercaTrasferimentoChiamataStateModel {
    ricerca: string;
}

export const RicercaTrasferimentoChiamataStateDefaults: RicercaTrasferimentoChiamataStateModel = {
    ricerca: null
};

@Injectable()
@State<RicercaTrasferimentoChiamataStateModel>({
    name: 'ricercaTrasferimentoChiamata',
    defaults: RicercaTrasferimentoChiamataStateDefaults
})

export class RicercaTrasferimentoChiamataState {

    constructor() {
    }

    @Selector()
    static ricerca(state: RicercaTrasferimentoChiamataStateModel) {
        return state.ricerca;
    }

    @Action(SetRicercaTrasferimentoChiamata)
    setRicercaRubrica({ patchState }: StateContext<RicercaTrasferimentoChiamataStateModel>, action: SetRicercaTrasferimentoChiamata) {
        patchState({
            ricerca: action.ricerca
        });
    }

    @Action(CleaRicercaTrasferimentoChiamata)
    clearRicercaRubrica({ patchState }: StateContext<RicercaTrasferimentoChiamataStateModel>) {
        patchState({
            ricerca: null
        });
    }
}
