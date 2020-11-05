import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BoxInterventi } from '../../../boxes/boxes-model/box-interventi.model';
import { ClearBoxRichieste, SetBoxRichieste } from '../../actions/boxes/box-richieste.actions';
import { Injectable } from '@angular/core';

export interface BoxRichiesteStateModel {
    richieste: BoxInterventi;
}

export const boxRichiesteStateDefaults: BoxRichiesteStateModel = {
    richieste: null,
};

@Injectable()
@State<BoxRichiesteStateModel>({
    name: 'boxRichieste',
    defaults: boxRichiesteStateDefaults
})
export class BoxRichiesteState {

    constructor() {
    }

    @Selector()
    static richieste(state: BoxRichiesteStateModel): BoxInterventi {
        return state.richieste;
    }

    @Action(SetBoxRichieste)
    setBoxRichieste({ patchState }: StateContext<BoxRichiesteStateModel>, action: SetBoxRichieste): void {
        patchState({
            richieste: action.payload
        });
    }

    @Action(ClearBoxRichieste)
    clearBoxRichieste({ patchState }: StateContext<BoxRichiesteStateModel>): void {
        patchState(boxRichiesteStateDefaults);
    }
}
