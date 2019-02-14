import { Action, Selector, State, StateContext, NgxsOnInit } from '@ngxs/store';

// Model
import { Utente } from 'src/app/shared/model/utente.model';

// Action
import { GetUtenti } from '../actions/lista-utenti.actions';
import { UserService } from 'src/app/core/auth/_services';

export interface UtentiStateModel {
    utenti: any[];
}

export const UtentiStateDefaults: UtentiStateModel = {
    utenti: null
};

@State<UtentiStateModel>({
    name: 'utenti',
    defaults: UtentiStateDefaults
})
export class UtentiState implements NgxsOnInit {

    // SELECTORS
    @Selector()
    static utenti(state: UtentiStateModel) {
        return state.utenti;
    }

    constructor(private _users: UserService) { }

    ngxsOnInit(ctx: StateContext<UtentiState>) {
        ctx.dispatch(new GetUtenti());
    }

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
