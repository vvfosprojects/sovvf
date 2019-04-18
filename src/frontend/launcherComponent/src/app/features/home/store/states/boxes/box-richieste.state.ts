import { Action, Selector, State, StateContext } from '@ngxs/store';

// Service
import { BoxRichiesteService } from '../../../../../core/service/boxes-service/box-richieste.service';

// Model
import { BoxInterventi } from '../../../boxes/boxes-model/box-interventi.model';

// Action
import { ClearBoxRichieste, GetBoxRichieste, SetBoxRichieste } from '../../actions/boxes/box-richieste.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';

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

    @Action(GetBoxRichieste)
    getBoxRichieste({ dispatch }: StateContext<BoxRichiesteStateModel>, action: GetBoxRichieste) {

        this._richieste.getInterventi(action.connectionId).subscribe(() => {
            // dispatch(new SetBoxRichieste(i));
        }, () => dispatch(new ShowToastr('error', 'Errore', 'Il server web non risponde', 5000)));
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
