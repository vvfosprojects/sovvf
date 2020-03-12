import { Utente } from '../../../../../shared/model/utente.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearUtenteLocalStorage, SetUtente, SetUtenteLocalStorage, UpdateUtente, ClearUtente } from '../../actions/operatore/utente.actions';
import { ClearUtenteSignalR, SetUtenteSignalR } from '../../../../../core/signalr/store/signalR.actions';
import { makeCopy } from '../../../../../shared/helper/function';
import { ClearRuoliUtenteLoggato } from '../../../../../shared/store/actions/ruoli/ruoli.actions';

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

    @Action(SetUtenteLocalStorage)
    setUtenteLocalStorage({ getState }: StateContext<UtenteStateModel>, action: SetUtenteLocalStorage) {
        const state = getState();
        localStorage.setItem(state.localName, JSON.stringify(action.utente));
    }

    @Action(ClearUtenteLocalStorage)
    clearUtenteLocalStorage({ getState }: StateContext<UtenteStateModel>) {
        const state = getState();
        localStorage.removeItem(state.localName);
    }

    @Action(UpdateUtente)
    updateUtente({ getState, patchState, dispatch }: StateContext<UtenteStateModel>, action: UpdateUtente) {
        const state = getState();
        const token = JSON.parse(localStorage.getItem(state.localName)).token;
        const utenteToSet = makeCopy(action.utente);
        utenteToSet.token = token;
        patchState({
            utente: utenteToSet
        });
        if (action.options.localStorage) {
            dispatch(new SetUtenteLocalStorage(utenteToSet));
        }
    }

    @Action(ClearUtente)
    clearUtente({ getState, patchState, dispatch }: StateContext<UtenteStateModel>) {
        const state = getState();
        if (state.utente) {
            // Clear SignalR Data
            dispatch(new ClearUtenteSignalR(state.utente));
        }
        // Local Storage
        dispatch(new ClearUtenteLocalStorage());
        // Current Roles Session Storage
        dispatch(new ClearRuoliUtenteLoggato());
        // Clear User Data
        patchState({
            utente: null
        });
    }
}
