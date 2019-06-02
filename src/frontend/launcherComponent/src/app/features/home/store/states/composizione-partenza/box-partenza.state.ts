import { Action, Selector, State, StateContext } from '@ngxs/store';

// Interface
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';

import {
    AddBoxPartenza,
    AddMezzoBoxPartenza,
    AddSquadraBoxPartenza,
    RemoveBoxPartenza,
    RemoveMezzoBoxPartenza,
    RemoveSquadraBoxPartenza, SelectBoxPartenza
} from '../../actions/composizione-partenza/box-partenza.actions';

export interface BoxPartenzaStateModel {
    boxPartenzaList: BoxPartenza[];
}

export const BoxPartenzaStateDefaults: BoxPartenzaStateModel = {
    boxPartenzaList: []
};

@State<BoxPartenzaStateModel>({
    name: 'boxPartenza',
    defaults: BoxPartenzaStateDefaults
})
export class PreAccoppiatiState {

    @Selector()
    static boxPartenzaList(state: BoxPartenzaStateModel) {
        return state.boxPartenzaList;
    }

    constructor() {
    }

    @Action(AddBoxPartenza)
    addBoxPartenza({ setState }: StateContext<BoxPartenzaStateModel>) {
    }

    @Action(RemoveBoxPartenza)
    removeBoxPartenza({ setState }: StateContext<BoxPartenzaStateModel>, action: RemoveBoxPartenza) {
        console.log(action.idBoxPartenza);
    }

    @Action(AddSquadraBoxPartenza)
    addSquadraBoxPartenza({ setState }: StateContext<BoxPartenzaStateModel>, action: AddSquadraBoxPartenza) {
        console.log(action.squadra);
    }

    @Action(RemoveSquadraBoxPartenza)
    removeSquadraBoxPartenza({ setState }: StateContext<BoxPartenzaStateModel>, action: RemoveSquadraBoxPartenza) {
        console.log(action.idSquadra);
    }

    @Action(AddMezzoBoxPartenza)
    addMezzoBoxPartenza({ setState }: StateContext<BoxPartenzaStateModel>, action: AddMezzoBoxPartenza) {
        console.log(action.mezzo);
    }

    @Action(RemoveMezzoBoxPartenza)
    removeMezzoBoxPartenza({ setState }: StateContext<BoxPartenzaStateModel>, action: RemoveMezzoBoxPartenza) {
        console.log(action.idMezzo);
    }

    @Action(SelectBoxPartenza)
    selectBoxPartenza({ setState }: StateContext<BoxPartenzaStateModel>, action: SelectBoxPartenza) {
        console.log(action.idBoxPartenza);
    }
}
