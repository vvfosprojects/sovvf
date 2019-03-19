import { Action, Selector, State, StateContext } from '@ngxs/store';
// Model
import { GestioneUtente } from '../../../../../shared/model/gestione-utente.model';
// Action
import { GetGestioneUtenti, SetGestioneUtenti } from '../../actions/gestione-utenti/gestione-utenti.actions';
import { GestioneUtentiService } from '../../../../../core/service/gestione-utenti-service/gestione-utenti.service';

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

    // SELECTORS
    @Selector()
    static lista_gestione_utenti(state: GestioneUtentiStateModel) {
        return state.lista_gestione_utenti;
    }

    // GET
    @Action(GetGestioneUtenti)
    getGestioneUtenti({getState, patchState, dispatch}: StateContext<GestioneUtentiStateModel>) {
        const state = getState();

        this._gestioneUtenti.getGestioneUtenti().subscribe((gestioneUtenti: GestioneUtente[]) => {
            dispatch(new SetGestioneUtenti(gestioneUtenti));
        });

        patchState({
            ...state,
            lista_gestione_utenti: []
        });
    }

    // SET
    @Action(SetGestioneUtenti)
    setGestioneUtenti({getState, patchState}: StateContext<GestioneUtentiStateModel>, action: SetGestioneUtenti) {
        const state = getState();

        patchState({
            ...state,
            lista_gestione_utenti: action.gestioneUtenti
        });
    }
}
