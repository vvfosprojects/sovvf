import { Utente } from '../../../../../shared/model/utente.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetUtente, SetUtente } from '../../actions/operatore/utente.actions';
import { SignalRService } from '../../../../../core/signalr/signalR.service';
import { SignalRNotification } from '../../../../../core/signalr/model/signalr-notification.model';

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

    constructor(private signalR: SignalRService) {
    }

    @Action(GetUtente)
    getUtente({ dispatch }: StateContext<UtenteStateModel>, action: GetUtente) {
        this.signalR.addToGroup(new SignalRNotification(
            action.utente.sede.codice,
            action.utente.id,
            `${action.utente.nome} ${action.utente.cognome}`
        ));
        dispatch(new SetUtente(action.utente));
    }

    @Action(SetUtente)
    setUtente({ patchState }: StateContext<UtenteStateModel>, action: SetUtente) {
        patchState({
            utente: action.utente
        });
    }
}
