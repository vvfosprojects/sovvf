import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    ClearRicercaUtenti,
    SetSedeFiltroDeselezionato,
    ResetSediFiltroSelezionate,
    ReducerSelezioneFiltroSede,
    SetRicercaUtenti,
    SetSedeFiltroSelezionato,
    SetSediFiltro
} from '../../actions/ricerca-utenti/ricerca-utenti.actons';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { GetUtentiGestione } from '../../actions/gestione-utenti/gestione-utenti.actions';
import { Ruolo } from '../../../../../shared/model/utente.model';

export interface RicercaUtentiStateModel {
    ricerca: string;
    sediFiltro: Ruolo[];
    sediFiltroSelezionate: string[];
}

export const RicercaUtentiStateDefaults: RicercaUtentiStateModel = {
    ricerca: null,
    sediFiltro: undefined,
    sediFiltroSelezionate: undefined
};

@State<RicercaUtentiStateModel>({
    name: 'ricercaUtenti',
    defaults: RicercaUtentiStateDefaults
})
export class RicercaUtentiState {

    constructor() {
    }

    @Selector()
    static ricerca(state: RicercaUtentiStateModel) {
        return state.ricerca;
    }

    @Selector()
    static sediFiltro(state: RicercaUtentiStateModel) {
        return state.sediFiltro;
    }

    @Selector()
    static sediFiltroSelezionate(state: RicercaUtentiStateModel) {
        return state.sediFiltroSelezionate;
    }

    @Action(SetRicercaUtenti)
    setRicercaUtenti({ getState, patchState }: StateContext<RicercaUtentiStateModel>, action: SetRicercaUtenti) {
        patchState({
            ricerca: action.ricerca
        });
    }

    @Action(ClearRicercaUtenti)
    clearRicercaUtenti({ patchState }: StateContext<RicercaUtentiStateModel>) {
        patchState({
            ricerca: null
        });
    }

    @Action(SetSediFiltro)
    setSediFiltro({ getState, patchState }: StateContext<RicercaUtentiStateModel>, action: SetSediFiltro) {
        patchState({
            sediFiltro: action.sedi
        });
    }

    @Action(ReducerSelezioneFiltroSede)
    reducerSelezioneFiltroSede({ getState, dispatch }: StateContext<RicercaUtentiStateModel>, action: ReducerSelezioneFiltroSede) {
        const filtriSedeSelezionati = getState().sediFiltroSelezionate;
        const filtroSelezionato = filtriSedeSelezionati && filtriSedeSelezionati.filter(f => f === action.sedeFiltro).length === 1;
        if (!filtroSelezionato) {
            dispatch(new SetSedeFiltroSelezionato(action.sedeFiltro));
        } else {
            dispatch(new SetSedeFiltroDeselezionato(action.sedeFiltro));
        }
    }

    @Action(SetSedeFiltroSelezionato)
    setSedeFiltroSelezionato({ setState, dispatch }: StateContext<RicercaUtentiStateModel>, action: SetSedeFiltroSelezionato) {
        setState(
            patch({
                sediFiltroSelezionate: insertItem(action.sedeFiltro)
            })
        );
        dispatch(new GetUtentiGestione());
    }

    @Action(SetSedeFiltroDeselezionato)
    setSedeFiltroDeselezionato({ getState, setState, dispatch }: StateContext<RicercaUtentiStateModel>, action: SetSedeFiltroDeselezionato) {
        setState(
            patch({
                sediFiltroSelezionate: removeItem(sede => sede === action.sedeFiltro)
            })
        );
        dispatch(new GetUtentiGestione());
    }

    @Action(ResetSediFiltroSelezionate)
    resetSediFiltroSelezionate({ patchState, dispatch }: StateContext<RicercaUtentiStateModel>) {
        patchState({
            sediFiltroSelezionate: RicercaUtentiStateDefaults.sediFiltroSelezionate
        });
        dispatch(new GetUtentiGestione());
    }
}
