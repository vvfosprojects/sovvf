import { Utente } from '../../../../../shared/model/utente.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearUtente, SetUtente } from '../../actions/operatore/utente.actions';
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

    @Action(SetUtente)
    setUtente({ patchState }: StateContext<UtenteStateModel>, action: SetUtente) {
        // Todo: da spostare su signalrState
        this.signalR.addToGroup(new SignalRNotification(
            action.utente.sede.codice,
            action.utente.id,
            `${action.utente.nome} ${action.utente.cognome}`
        ));
        patchState({
            utente: action.utente
        });
    }

    @Action(ClearUtente)
    clearUtente({ getState, patchState }: StateContext<UtenteStateModel>) {
        // Todo: da spostare su signalrState
        const state = getState();
        this.signalR.removeToGroup(new SignalRNotification(
            state.utente.sede.codice,
            state.utente.id,
            `${state.utente.nome} ${state.utente.cognome}`
            )
        );
        patchState(UtenteStateDefaults);
    }
}
