import { Action, Selector, State, StateContext } from '@ngxs/store';

// Model
import { Utente } from 'src/app/shared/model/utente.model';

// Action
import { GetUtenti } from '../actions/lista-utenti.actions';
import { UserService } from 'src/app/core/auth/_services';

export interface UtentiStateModel {
    utenti: any[];
}

export const UtentiStateDefaults: UtentiStateModel = {
    utenti: []
};

@State<UtentiStateModel>({
    name: 'utenti',
    defaults: UtentiStateDefaults
})
export class UtentiState {

    // SELECTORS
    @Selector()
    static utenti(state: UtentiStateModel) {
        return state.utenti;
    }

    constructor(private _users: UserService) { }


    // GET
    @Action(GetUtenti)
    getUtenti({ getState, patchState }: StateContext<UtentiStateModel>) {
        const state = getState();

        this._users.getAll().subscribe((u: Utente[]) => {
            patchState({
                ...state,
                utenti: u
            });
        });

    }
}
