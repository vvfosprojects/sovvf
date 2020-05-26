import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    ClearRicercaUtenti,
    SetSedeFiltroDeselezionato,
    ClearSediFiltro,
    ReducerSelezioneFiltroSede,
    SetRicercaUtenti,
    SetSedeFiltroSelezionato,
    SetSediFiltro
} from '../../actions/ricerca-utenti/ricerca-utenti.actons';
import { append, patch, removeItem } from '@ngxs/store/operators';

export interface RicercaUtentiStateModel {
    ricerca: string;
    sediFiltro: string[];
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
            sediFiltro: action.sedi
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
        if(!filtroSelezionato) {
            dispatch(new SetSedeFiltroSelezionato(action.sedeFiltro));
        } else {
            dispatch(new SetSedeFiltroDeselezionato(action.sedeFiltro));
        }
    }

    @Action(SetSedeFiltroSelezionato)
    setSedeFiltroSelezionato({ setState }: StateContext<RicercaUtentiStateModel>, action: SetSedeFiltroSelezionato) {
        setState(
            patch({
                sediFiltroSelezionate: append([action.sedeFiltro])
            })
        );
    }

    @Action(SetSedeFiltroDeselezionato)
    setSedeFiltroDeselezionato({ setState }: StateContext<RicercaUtentiStateModel>, action: SetSedeFiltroDeselezionato) {
        setState(
            patch({
                sediFiltroSelezionate: removeItem(sede => sede === action.sedeFiltro)
            })
        );
    }
}
