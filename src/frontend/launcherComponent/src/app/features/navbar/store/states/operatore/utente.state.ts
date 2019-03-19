import { Utente } from '../../../../../shared/model/utente.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UserService } from '../../../../../core/auth/_services';
import { GetUtente } from '../../actions/operatore/utente.actions';
import { SignalRService } from '../../../../../core/signalr/signalR.service';
import { SignalRNotification } from '../../../../../core/signalr/interface/signalr-notification.interface';

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
            const notification: SignalRNotification = {
                CodiceSede: utente.sede.codice,
                NominativoUtente: `${utente.nome} ${utente.cognome}`,
                idUtente: +utente.id
            };
            this.signalR.addToGroup(notification);
            patchState({
                utente: utente
            });
        });

    }
}
