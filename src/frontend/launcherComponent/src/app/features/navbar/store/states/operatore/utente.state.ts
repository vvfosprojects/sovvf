import { Utente } from '../../../../../shared/model/utente.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UserService } from '../../../../../core/auth/_services';
import { GetUtente } from '../../actions/operatore/utente.actions';
import { SignalRService } from '../../../../../core/signalr/signalR.service';

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

    constructor(private _users: UserService, private signalR: SignalRService) {
    }

    @Action(GetUtente)
    getUtente({ patchState }: StateContext<UtenteStateModel>, action: GetUtente) {
        this._users.getById(action.id).subscribe((utente: Utente) => {
            this.signalR.addToGroup(utente.sede.codice);
            patchState({
                utente: utente
            });
        });

    }
}
