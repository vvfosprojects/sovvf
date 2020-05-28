import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    ClearRicercaUtenti,
    SetSedeFiltroDeselezionato,
    ClearSediFiltro,
    ReducerSelezioneFiltroSede,
    SetRicercaUtenti,
    SetSedeFiltroSelezionato,
    SetSediFiltro, SetAllSediFiltroSelezionate
} from '../../actions/ricerca-utenti/ricerca-utenti.actons';
import { append, patch, removeItem } from '@ngxs/store/operators';
import { GetUtentiGestione } from '../../actions/gestione-utenti/gestione-utenti.actions';
import { Ruolo } from '../../../../../shared/model/utente.model';

export interface RicercaUtentiStateModel {
    ricerca: string;
    sediFiltro: Ruolo[];
    sediFiltroSelezionate: string[];
}

export const RicercaUtentiStateDefaults: RicercaUtentiStateModel = {
    ricerca: null,
    sediFiltro: [],
    sediFiltroSelezionate: []
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
            sediFiltro: action.sedi,
            sediFiltroSelezionate: action.sedi.map((s: Ruolo) => s.codSede)
        });
    }

    @Action(ClearSediFiltro)
    clearSediFiltro({ patchState }: StateContext<RicercaUtentiStateModel>) {
        patchState({
            sediFiltro: []
        });
    }

    @Action(ReducerSelezioneFiltroSede)
    reducerSelezioneFiltroSede({ getState, dispatch }: StateContext<RicercaUtentiStateModel>, action: ReducerSelezioneFiltroSede) {
        const filtriSedeSelezionati = getState().sediFiltroSelezionate;
        const filtroSelezionato = filtriSedeSelezionati.filter(f => f === action.sedeFiltro).length === 1;
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
                sediFiltroSelezionate: append([action.sedeFiltro])
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
        const sediSelezionateCount = getState().sediFiltroSelezionate.length;
        if (sediSelezionateCount <= 0) {
            dispatch(new SetAllSediFiltroSelezionate());
        } else {
            dispatch(new GetUtentiGestione());
        }
    }

    @Action(SetAllSediFiltroSelezionate)
    setAllSediFiltroSelezionate({ getState, patchState, dispatch }: StateContext<RicercaUtentiStateModel>) {
        const sediFiltro = getState().sediFiltro;
        patchState({
                sediFiltroSelezionate: sediFiltro.map((s: Ruolo) => s.codSede)
            }
        );
        dispatch(new GetUtentiGestione());
    }
}
