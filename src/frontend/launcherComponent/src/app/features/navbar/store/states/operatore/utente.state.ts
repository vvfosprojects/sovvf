import { Utente } from '../../../../../shared/model/utente.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    ClearUtente,
    SetUtente,
    SetUtenteLocalStorage,
    UpdateUtente
} from '../../actions/operatore/utente.actions';
import { ClearIdUtente, ClearUtenteSignalR, SetUtenteSignalR } from '../../../../../core/signalr/store/signalR.actions';
import { ClearVistaSedi, SetVistaSedi } from '../../../../../shared/store/actions/app/app.actions';

export interface UtenteStateModel {
    localName: string;
    utente: Utente;
}

export const UtenteStateDefaults: UtenteStateModel = {
    localName: 'userSO115',
    utente: null,
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
        patchState({
            utente: action.utente,
        });
        dispatch([
            new SetVistaSedi([action.utente.sede.codice]),
            new SetUtenteLocalStorage(action.utente)
        ]);
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

    @Action(ClearUtente)
    clearUtente({ getState, patchState, dispatch }: StateContext<UtenteStateModel>) {
        const state = getState();
        // Set SignalR Data
        if (state.utente) {
            dispatch([
                new ClearUtenteSignalR(state.utente),
                new ClearVistaSedi(),
                new ClearIdUtente()
            ]);
        }
        // Local Storage
        localStorage.removeItem(state.localName);
        // Store User Data
        patchState(UtenteStateDefaults);
    }

}
