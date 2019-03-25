import { Action, Selector, State, StateContext } from '@ngxs/store';
// Model
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

// Action
import { ClearRichiestaModifica, ModificaRilevanza, SetRichiestaModifica } from '../../actions/richieste/richiesta-modifica.actions';
import produce from 'immer';
import { copyObj } from '@angular/animations/browser/src/util';
import { makeCopy } from '../../../../../shared/helper/function';

export interface RichiestaModificaStateModel {
    richiestaModifica: SintesiRichiesta;
}

export const RichiestaModificaStateDefaults: RichiestaModificaStateModel = {
    richiestaModifica: null
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

    @Action(SetRichiestaModifica)
    setRichiestaModifica({getState, patchState}: StateContext<RichiestaModificaStateModel>, action: SetRichiestaModifica) {
        const state = getState();

        patchState({
            ...state,
            richiestaModifica: action.richiesta
        });
    }

    @Action(ClearRichiestaModifica)
    clearRichiestaModifica({getState, patchState}: StateContext<RichiestaModificaStateModel>) {
        const state = getState();

        patchState({
            ...state,
            richiestaModifica: null
        });
    }

    @Action(ModificaRilevanza)
    modificaRilevanza({getState, setState}: StateContext<RichiestaModificaStateModel>) {
        setState(
            produce(getState(), draft => {
                const richiesta = makeCopy(draft.richiestaModifica);
                if (draft.richiestaModifica.rilevanza !== null) {
                    richiesta.rilevanza = null;
                    draft.richiestaModifica = richiesta;
                } else {
                    const date = new Date();
                    richiesta.rilevanza = date;
                    draft.richiestaModifica = richiesta;
                }
            })
        );
    }
}
