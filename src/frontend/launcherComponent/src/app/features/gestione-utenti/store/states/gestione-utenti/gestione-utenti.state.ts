import { Action, Selector, State, StateContext } from '@ngxs/store';
// Model
import { GestioneUtente } from '../../../../../shared/model/gestione-utente.model';
// Action
import { AddUtente, AddUtenteSuccess, GetGestioneUtenti, RemoveUtente, RemoveUtenteSuccess, SetGestioneUtenti } from '../../actions/gestione-utenti/gestione-utenti.actions';
import { GestioneUtentiService } from '../../../../../core/service/gestione-utenti-service/gestione-utenti.service';
// Immer
import produce from 'immer';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';

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
    getGestioneUtenti({dispatch}: StateContext<GestioneUtentiStateModel>) {
        this._gestioneUtenti.getGestioneUtenti().subscribe((gestioneUtenti: GestioneUtente[]) => {
            dispatch(new SetGestioneUtenti(gestioneUtenti));
        });
    }

    @Action(SetGestioneUtenti)
    setGestioneUtenti({getState, patchState}: StateContext<GestioneUtentiStateModel>, action: SetGestioneUtenti) {
        const state = getState();

        patchState({
            ...state,
            lista_gestione_utenti: action.gestioneUtenti
        });
    }

    @Action(AddUtente)
    addUtente({dispatch}: StateContext<GestioneUtentiStateModel>, action: AddUtente) {
        dispatch(new AddUtenteSuccess(action.nuovoUtente));
    }

    @Action(AddUtenteSuccess)
    addUtenteSuccess({getState, setState, dispatch}: StateContext<GestioneUtentiStateModel>, action: AddUtenteSuccess) {
        dispatch(new ShowToastr('info', 'Utente Aggiunto', 'Utente aggiunto con successo.', 3));
        setState(
            produce(getState(), draft => {
                draft.lista_gestione_utenti.push(action.nuovoUtente);
            })
        );
    }

    @Action(RemoveUtente)
    removeUtente({dispatch}: StateContext<GestioneUtentiStateModel>, action: RemoveUtente) {
        dispatch(new RemoveUtenteSuccess(action.id_utente, action.codice_sede));
    }

    @Action(RemoveUtenteSuccess)
    removeUtenteSuccess({getState, setState, dispatch}: StateContext<GestioneUtentiStateModel>, action: RemoveUtenteSuccess) {
        dispatch(new ShowToastr('info', 'Utente Rimosso', 'Utente rimosso con successo.', 3));
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
