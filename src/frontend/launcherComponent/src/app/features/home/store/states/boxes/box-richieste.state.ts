import { Action, Selector, State, StateContext } from '@ngxs/store';

// Model
import { BoxInterventi } from '../../../boxes/boxes-model/box-interventi.model';

// Action
import { ClearBoxRichieste, SetBoxRichieste } from '../../actions/boxes/box-richieste.actions';

export interface BoxRichiesteStateModel {
    richieste: BoxInterventi;
}

export const boxRichiesteStateDefaults: BoxRichiesteStateModel = {
    richieste: null,
};

@State<BoxRichiesteStateModel>({
    name: 'boxRichieste',
    defaults: boxRichiesteStateDefaults
})
export class BoxRichiesteState {

    constructor() {
    }

    @Selector()
    static richieste(state: BoxRichiesteStateModel) {
        return state.richieste;
    }

    @Action(SetBoxRichieste)
    setBoxRichieste({ patchState }: StateContext<BoxRichiesteStateModel>, action: SetBoxRichieste) {

        patchState({
            richieste: action.payload
        });
    }

    @Action(ClearBoxRichieste)
    clearBoxRichieste({ patchState }: StateContext<BoxRichiesteStateModel>) {
        patchState(boxRichiesteStateDefaults);
    }
}
