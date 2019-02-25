import { Utente } from '../../../../../shared/model/utente.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UserService } from '../../../../../core/auth/_services';
import { GetUtente } from '../actions/utente.actions';

export interface UtenteStateModel {
    utente: Utente;
}

export const UtenteStateDefaults: UtenteStateModel = {
    utente: null
};

@State<UtenteStateModel>({
    name: 'utente',
    defaults: UtenteStateDefaults
})
export class UtenteState {

    @Selector()
    static utente(state: UtenteStateModel) {
        return state.utente;
    }

    constructor(private _users: UserService) {
    }

    @Action(GetUtente)
    getUtente({ getState, patchState }: StateContext<UtenteStateModel>, action: GetUtente) {
        const state = getState();

        this._users.getById(action.id).subscribe((utente: Utente) => {
            patchState({
                ...state,
                utente: utente
            });
        });

    }
}
