import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Utente } from 'src/app/shared/model/utente.model';
import { GetUtenti, SetUtenti } from '../../actions/utenti/utenti.actions';
import { UserService } from 'src/app/core/auth/_services';

export interface UtentiStateModel {
    utenti: Utente[];
}

export const UtentiStateDefaults: UtentiStateModel = {
    utenti: []
};

@State<UtentiStateModel>({
    name: 'utenti',
    defaults: UtentiStateDefaults
})
export class UtentiState {

    @Selector()
    static utenti(state: UtentiStateModel) {
        return state.utenti;
    }

    constructor(private _users: UserService) {
    }

    @Action(GetUtenti)
    getUtenti({ dispatch }: StateContext<UtentiStateModel>) {
        this._users.getAll().subscribe((u: Utente[]) => {
            dispatch(new SetUtenti(u));
        });
    }

    @Action(SetUtenti)
    setUtenti({ getState, patchState }: StateContext<UtentiStateModel>, action: SetUtenti) {
        const state = getState();

        patchState({
            ...state,
            utenti: action.utenti
        });
    }
}
