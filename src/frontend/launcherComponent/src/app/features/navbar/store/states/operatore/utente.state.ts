import { Utente } from '../../../../../shared/model/utente.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    ClearUtente,
    SetUtente,
    SetUtenteLocalStorage,
    SetUtenteSignalR,
    SetVistaSedi,
    UpdateUtente
} from '../../actions/operatore/utente.actions';
import { SignalRService } from '../../../../../core/signalr/signalR.service';
import { SignalRNotification } from '../../../../../core/signalr/model/signalr-notification.model';
import { SetCodiceSede, SetIdUtente } from '../../../../../core/signalr/store/signalR.actions';

export interface UtenteStateModel {
    localName: string;
    utente: Utente;
    vistaSedi: string[];
}

export const UtenteStateDefaults: UtenteStateModel = {
    localName: 'userSO115',
    utente: null,
    vistaSedi: null
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

    @Selector()
    static vistaSedi(state: UtenteStateModel) {
        return state.vistaSedi;
    }

    constructor(private signalR: SignalRService) {
    }

    @Action(SetUtente)
    setUtente({ patchState, dispatch }: StateContext<UtenteStateModel>, action: SetUtente) {
        // Set SignalR Data
        dispatch(new SetUtenteSignalR(action.utente));
        // Local Storage
        dispatch(new SetUtenteLocalStorage(action.utente));
        // Store User Data
        patchState({
            utente: action.utente
        });
    }

    @Action(SetUtenteSignalR)
    setUtenteSignalR({ dispatch }: StateContext<UtenteStateModel>, action: SetUtenteSignalR) {
        this.signalR.addToGroup(new SignalRNotification(
            [ action.utente.sede.codice ],
            action.utente.id,
            `${action.utente.nome} ${action.utente.cognome}`
        ));
        dispatch(new SetCodiceSede(action.utente.sede.codice));
        dispatch(new SetIdUtente(action.utente.id));
    }

    @Action(SetUtenteLocalStorage)
    setUtenteLocalStorage({ getState }: StateContext<UtenteStateModel>, action: SetUtenteLocalStorage) {
        const state = getState();
        localStorage.setItem(state.localName, JSON.stringify(action.utente));
    }

    @Action(UpdateUtente)
    updateUtente({ patchState, dispatch }: StateContext<UtenteStateModel>, action: UpdateUtente) {
        patchState({
            utente: action.utente
        });
        if (action.options.localStorage) {
            dispatch(new SetUtenteLocalStorage(action.utente));
        }
    }

    @Action(SetVistaSedi)
    setVistaSedi({ patchState }: StateContext<UtenteStateModel>, { vistaSedi }: SetVistaSedi) {
        patchState({ vistaSedi });
    }

    @Action(ClearUtente)
    clearUtente({ getState, patchState }: StateContext<UtenteStateModel>) {
        const state = getState();
        // Set SignalR Data
        if (state.utente) {
            this.signalR.removeToGroup(new SignalRNotification(
                [ state.utente.sede.codice ],
                state.utente.id,
                `${state.utente.nome} ${state.utente.cognome}`
                )
            );
        }
        // Local Storage
        localStorage.removeItem(state.localName);
        // Store User Data
        patchState({
            utente: null
        });
    }
}
