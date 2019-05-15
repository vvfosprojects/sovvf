import { Action, Selector, State, StateContext } from '@ngxs/store';
// Model
import { GestioneUtente } from '../../../../../shared/model/gestione-utente.model';
// Action
import {
    AddUtente,
    AddUtenteSuccess,
    ChangeRoleUtente,
    ChangeRoleUtenteSuccess,
    GetGestioneUtenti,
    RemoveUtente,
    RemoveUtenteSuccess,
    SetGestioneUtenti
} from '../../actions/gestione-utenti/gestione-utenti.actions';
import { GestioneUtentiService } from '../../../../../core/service/gestione-utenti-service/gestione-utenti.service';
// Immer
import produce from 'immer';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';

export interface GestioneUtentiStateModel {
    lista_gestione_utenti: GestioneUtente[];
}

export const GestioneUtentiStateModelDefaults: GestioneUtentiStateModel = {
    lista_gestione_utenti: []
};

@State<GestioneUtentiStateModel>({
    name: 'gestioneUtenti',
    defaults: GestioneUtentiStateModelDefaults
})
export class GestioneUtentiState {

    constructor(private _gestioneUtenti: GestioneUtentiService) {
    }

    @Selector()
    static lista_gestione_utenti(state: GestioneUtentiStateModel) {
        return state.lista_gestione_utenti;
    }

    @Action(GetGestioneUtenti)
    getGestioneUtenti({ dispatch }: StateContext<GestioneUtentiStateModel>) {
        this._gestioneUtenti.getGestioneUtenti().subscribe((gestioneUtenti: GestioneUtente[]) => {
            dispatch(new SetGestioneUtenti(gestioneUtenti));
        });
    }

    @Action(SetGestioneUtenti)
    setGestioneUtenti({ getState, patchState }: StateContext<GestioneUtentiStateModel>, action: SetGestioneUtenti) {
        const state = getState();

        patchState({
            ...state,
            lista_gestione_utenti: action.gestioneUtenti
        });
    }

    @Action(ChangeRoleUtente)
    changeRoleUtente({ dispatch }: StateContext<GestioneUtentiStateModel>, action: ChangeRoleUtente) {
        dispatch(new ChangeRoleUtenteSuccess(action.idUtente, action.ruolo));
    }

    @Action(ChangeRoleUtenteSuccess)
    changeRoleUtenteSuccess({ getState, setState, dispatch }: StateContext<GestioneUtentiStateModel>, action: ChangeRoleUtenteSuccess) {
        dispatch(new ShowToastr(ToastrType.Info, 'Ruolo Utente Aggiornato', 'Ruolo utente aggiornato con successo.', 2));
        setState(
            produce(getState(), draft => {
                draft.lista_gestione_utenti.forEach((utente: GestioneUtente) => {
                    if (utente.id_utente === action.idUtente) {
                        utente.ruolo = action.ruolo;
                    }
                });
            })
        );
    }

    @Action(AddUtente)
    addUtente({ dispatch }: StateContext<GestioneUtentiStateModel>, action: AddUtente) {
        dispatch(new AddUtenteSuccess(action.nuovoUtente));
    }

    @Action(AddUtenteSuccess)
    addUtenteSuccess({ getState, setState, dispatch }: StateContext<GestioneUtentiStateModel>, action: AddUtenteSuccess) {
        dispatch(new ShowToastr(ToastrType.Info, 'Utente Aggiunto', 'Utente aggiunto con successo.', 3));
        setState(
            produce(getState(), draft => {
                draft.lista_gestione_utenti.push(action.nuovoUtente);
            })
        );
    }

    @Action(RemoveUtente)
    removeUtente({ dispatch }: StateContext<GestioneUtentiStateModel>, action: RemoveUtente) {
        dispatch(new RemoveUtenteSuccess(action.id_utente, action.codice_sede));
    }

    @Action(RemoveUtenteSuccess)
    removeUtenteSuccess({ getState, setState, dispatch }: StateContext<GestioneUtentiStateModel>, action: RemoveUtenteSuccess) {
        dispatch(new ShowToastr(ToastrType.Info, 'Utente Rimosso', 'Utente rimosso con successo.', 3));
        setState(
            produce(getState(), draft => {
                draft.lista_gestione_utenti.forEach((gestioneUtente: GestioneUtente, index) => {
                    if (gestioneUtente.id_utente === action.id_utente && gestioneUtente.sede.codice === action.codice_sede) {
                        draft.lista_gestione_utenti.splice(index, 1);
                    }
                });
            })
        );
    }
}
