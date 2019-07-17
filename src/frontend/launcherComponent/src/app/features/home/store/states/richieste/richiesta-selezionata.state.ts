import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

// Action
import { SetRichiestaSelezionata, ClearRichiestaSelezionata } from '../../actions/richieste/richiesta-selezionata.actions';
import { ClearRichiestaGestione } from '../../actions/richieste/richiesta-gestione.actions';
import { RichiestaGestioneState } from './richiesta-gestione.state';

export interface RichiestaSelezionataStateModel {
    idRichiestaSelezionata: string;
}

export const RichiestaSelezionataStateDefaults: RichiestaSelezionataStateModel = {
    idRichiestaSelezionata: null
};

@State<RichiestaSelezionataStateModel>({
    name: 'richiestaSelezionata',
    defaults: RichiestaSelezionataStateDefaults
})
export class RichiestaSelezionataState {

    constructor(private store: Store) {
    }

    // SELECTORS
    @Selector()
    static idRichiestaSelezionata(state: RichiestaSelezionataStateModel) {
        return state.idRichiestaSelezionata;
    }

    // SET
    @Action(SetRichiestaSelezionata)
    setRichiestaSelezionata({ getState, patchState, dispatch }: StateContext<RichiestaSelezionataStateModel>, action: SetRichiestaSelezionata) {
        const state = getState();

        // controlli per rimuovere, se presente, la richiesta in gestione
        const richiestaGestione = this.store.selectSnapshot(RichiestaGestioneState.richiestaGestione);
        if (state.idRichiestaSelezionata && richiestaGestione && state.idRichiestaSelezionata === richiestaGestione.id) {
            dispatch(new ClearRichiestaGestione());
        }

        // imposto la richiesta selezionata
        patchState({
            ...state,
            idRichiestaSelezionata: action.idRichiesta
        });
    }

    // CLEAR
    @Action(ClearRichiestaSelezionata)
    clearRichiestaSelezionata({ getState, patchState, dispatch }: StateContext<RichiestaSelezionataStateModel>) {
        const state = getState();
        patchState({
            ...state,
            idRichiestaSelezionata: null
        });
    }
}
