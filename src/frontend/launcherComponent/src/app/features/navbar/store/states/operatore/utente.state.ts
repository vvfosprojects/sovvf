import { Utente } from '../../../../../shared/model/utente.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearUtente, SetUtente } from '../../actions/operatore/utente.actions';
import { SignalRService } from '../../../../../core/signalr/signalR.service';
import { SignalRNotification } from '../../../../../core/signalr/model/signalr-notification.model';
import { SetCodiceSede, SetIdUtente } from '../../../../../core/signalr/store/signalR.actions';

export interface UtenteStateModel {
    localName: string;
    utente: Utente;
}

export const UtenteStateDefaults: UtenteStateModel = {
    localName: 'userSO115',
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

    @Selector()
    static localName(state: UtenteStateModel) {
        return state.localName;
    }

    constructor(private signalR: SignalRService) {
    }

    @Action(SetUtente)
    setUtente({ getState, patchState, dispatch }: StateContext<UtenteStateModel>, action: SetUtente) {
        const state = getState();
        // Set SignalR Data
        this.signalR.addToGroup(new SignalRNotification(
            action.utente.sede.codice,
            action.utente.id,
            `${action.utente.nome} ${action.utente.cognome}`
        ));
        dispatch(new SetCodiceSede(action.utente.sede.codice));
        dispatch(new SetIdUtente(action.utente.id));
        // Local Storage
        localStorage.setItem(state.localName, JSON.stringify(action.utente));
        // Store User Data
        patchState({
            utente: action.utente
        });
    }

    @Action(ClearUtente)
    clearUtente({ getState, patchState }: StateContext<UtenteStateModel>) {
        const state = getState();
        // Set SignalR Data
        this.signalR.removeToGroup(new SignalRNotification(
            state.utente.sede.codice,
            state.utente.id,
            `${state.utente.nome} ${state.utente.cognome}`
            )
        );
        // Local Storage
        localStorage.removeItem(state.localName);
        // Store User Data
        patchState({
            utente: null
        });
    }
}
