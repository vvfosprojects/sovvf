import {Action, Selector, State, StateContext} from '@ngxs/store';
// Model
import { GestioneUtente } from '../../../../../shared/model/gestione-utente.model';
// Action
import {SetPage, SetPageSize, SetUtentiFiltrati} from '../../actions/tabella-utenti/tabella-utenti.actons';

export interface TabellaUtentiStateModel {
    utentiFiltrati: GestioneUtente[];
    pageSize: number;
    page: number;
}

export const TabellaUtentiStateDefaults: TabellaUtentiStateModel = {
    utentiFiltrati: null,
    pageSize: 10,
    page: 1
};

@State<TabellaUtentiStateModel>({
    name: 'tabellaUtenti',
    defaults: TabellaUtentiStateDefaults
})
export class TabellaUtentiState {

    constructor() {
    }

    // SELECTORS
    @Selector()
    static utentiFiltrati(state: TabellaUtentiStateModel) {
        return state.utentiFiltrati;
    }

    @Selector()
    static pageSize(state: TabellaUtentiStateModel) {
        return state.pageSize;
    }

    @Selector()
    static page(state: TabellaUtentiStateModel) {
        return state.page;
    }

    // SET
    @Action(SetUtentiFiltrati)
    setUtentiFiltrati({getState, patchState}: StateContext<TabellaUtentiStateModel>, action: SetUtentiFiltrati) {
        const state = getState();

        patchState({
            ...state,
            utentiFiltrati: action.utentiFiltrati
        });
    }

    // SET
    @Action(SetPageSize)
    setPageSize({getState, patchState}: StateContext<TabellaUtentiStateModel>, action: SetPageSize) {
        const state = getState();

        patchState({
            ...state,
            pageSize: action.pageSize
        });
    }

    // SET
    @Action(SetPage)
    setPage({getState, patchState}: StateContext<TabellaUtentiStateModel>, action: SetPage) {
        const state = getState();

        patchState({
            ...state,
            page: action.page
        });
    }
}
