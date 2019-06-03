import { Action, Selector, State, StateContext } from '@ngxs/store';
// Model
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

// Action
import { ClearRichiestaModifica, ModificaRilevanza, SetRichiestaModifica, SuccessRichiestaModifica } from '../../actions/richieste/richiesta-modifica.actions';
import produce from 'immer';
import { copyObj } from '@angular/animations/browser/src/util';
import { makeCopy } from '../../../../../shared/helper/function';

export interface RichiestaModificaStateModel {
    richiestaModifica: SintesiRichiesta;
    successModifica: boolean;
}

export const RichiestaModificaStateDefaults: RichiestaModificaStateModel = {
    richiestaModifica: null,
    successModifica: false
};

@State<RichiestaModificaStateModel>({
    name: 'richiestaModifica',
    defaults: RichiestaModificaStateDefaults
})
export class RichiestaModificaState {

    constructor() {
    }

    @Selector()
    static richiestaModifica(state: RichiestaModificaStateModel) {
        return state.richiestaModifica;
    }

    @Selector()
    static successModifica(state: RichiestaModificaStateModel) {
        return state.successModifica;
    }

    @Action(SetRichiestaModifica)
    setRichiestaModifica({ getState, patchState }: StateContext<RichiestaModificaStateModel>, action: SetRichiestaModifica) {
        const state = getState();

        patchState({
            ...state,
            richiestaModifica: action.richiesta
        });
    }

    @Action(ModificaRilevanza)
    modificaRilevanza({ getState, setState }: StateContext<RichiestaModificaStateModel>) {
        setState(
            produce(getState(), draft => {
                const richiesta = makeCopy(draft.richiestaModifica);
                if (draft.richiestaModifica.rilevanza === true) {
                    richiesta.rilevanza = false;
                    draft.richiestaModifica = richiesta;
                } else {
                    richiesta.rilevanza = true;
                    draft.richiestaModifica = richiesta;
                }
            })
        );
    }

    @Action(SuccessRichiestaModifica)
    successModifica({ patchState }: StateContext<RichiestaModificaStateModel>) {
        patchState({
            successModifica: true
        });
    }

    @Action(ClearRichiestaModifica)
    clearRichiestaModifica({ patchState }: StateContext<RichiestaModificaStateModel>) {
        patchState(RichiestaModificaStateDefaults);
    }

}
