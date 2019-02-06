import { Action, Selector, State, StateContext } from '@ngxs/store';

// Service
import { BoxRichiesteService } from '../../../../../core/service/boxes-service/box-richieste.service';

// Model
import { BoxInterventi } from '../../boxes-model/box-interventi.model';

// Action
import { FetchBoxRichieste, SetBoxRichieste } from '../actions/box-richieste.actions';

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

    constructor(private _richieste: BoxRichiesteService) {
    }

    @Selector()
    static richieste(state: BoxRichiesteStateModel) {
        return state.richieste;
    }

    @Action(FetchBoxRichieste)
    getInterventi({ dispatch }: StateContext<BoxRichiesteStateModel>) {
        let richieste: BoxInterventi;

        this._richieste.getInterventi().subscribe((i: BoxInterventi) => {
            richieste = i;

            dispatch(new SetBoxRichieste(richieste));
        });
    }

    @Action(SetBoxRichieste)
    setInterventi({ getState, patchState }: StateContext<BoxRichiesteStateModel>, action: SetBoxRichieste) {
        const state = getState();

        patchState({
            ...state,
            richieste: action.payload
        });
    }
}
