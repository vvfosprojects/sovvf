import { Utente } from '../../../../../shared/model/utente.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetUtente } from '../../actions/operatore/utente.actions';
import { SignalRService } from '../../../../../core/signalr/signalR.service';
import { SignalRNotification } from '../../../../../core/signalr/model/signalr-notification.model';
import { PatchListaSediNavbar } from '../../../../../shared/store/actions/sedi-treeview/sedi-treeview.actions';

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
    setUtente({ patchState, dispatch }: StateContext<UtenteStateModel>, action: SetUtente) {
        /**
         * da spostare su signalRState
         */
        this.signalR.addToGroup(new SignalRNotification(
            action.utente.sede.codice,
            action.utente.id,
            `${action.utente.nome} ${action.utente.cognome}`
        ));
        patchState({
            utente: action.utente
        });
        dispatch(new PatchListaSediNavbar([action.utente.sede.codice]));
    }
}
