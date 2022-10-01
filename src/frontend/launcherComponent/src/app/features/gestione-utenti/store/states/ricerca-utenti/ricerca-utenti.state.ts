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
import { Injectable } from '@angular/core';

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

@Injectable()
@State<RicercaUtentiStateModel>({
    name: 'ricercaUtenti',
    defaults: RicercaUtentiStateDefaults
})
export class RicercaUtentiState {

    constructor() {
    }

    @Selector()
    static ricerca(state: RicercaUtentiStateModel): string {
        return state.ricerca;
    }

    @Selector()
    static sediFiltro(state: RicercaUtentiStateModel): Ruolo[] {
        return state.sediFiltro;
    }

    @Selector()
    static sediFiltroSelezionate(state: RicercaUtentiStateModel): string[] {
        return state.sediFiltroSelezionate;
    }

    @Action(SetRicercaUtenti)
    setRicercaUtenti({ getState, patchState }: StateContext<RicercaUtentiStateModel>, action: SetRicercaUtenti): void {
        patchState({
            ricerca: action.ricerca
        });
    }

    @Action(ClearRicercaUtenti)
    clearRicercaUtenti({ patchState }: StateContext<RicercaUtentiStateModel>): void {
        patchState({
            ricerca: null
        });
    }

    @Action(SetSediFiltro)
    setSediFiltro({ getState, patchState }: StateContext<RicercaUtentiStateModel>, action: SetSediFiltro): void {
        patchState({
            sediFiltro: action.sedi
        });
    }

    @Action(ReducerSelezioneFiltroSede)
    reducerSelezioneFiltroSede({ getState, dispatch }: StateContext<RicercaUtentiStateModel>, action: ReducerSelezioneFiltroSede): void {
        const state = getState();
        const filtriSedeSelezionati = state.sediFiltroSelezionate;
        const filtroSelezionato = filtriSedeSelezionati?.filter(f => f === action.sedeFiltro).length === 1;
        if (!filtroSelezionato) {
            dispatch(new SetSedeFiltroSelezionato(action.sedeFiltro));
        } else {
            dispatch(new SetSedeFiltroDeselezionato(action.sedeFiltro));
        }
    }

    @Action(SetSedeFiltroSelezionato)
    setSedeFiltroSelezionato({ setState, dispatch }: StateContext<RicercaUtentiStateModel>, action: SetSedeFiltroSelezionato): void {
        setState(
            patch({
                sediFiltroSelezionate: insertItem(action.sedeFiltro)
            })
        );
        dispatch(new GetUtentiGestione());
    }

    @Action(SetSedeFiltroDeselezionato)
    setSedeFiltroDeselezionato({ getState, setState, dispatch }: StateContext<RicercaUtentiStateModel>, action: SetSedeFiltroDeselezionato): void {
        setState(
            patch({
                sediFiltroSelezionate: removeItem(sede => sede === action.sedeFiltro)
            })
        );
        dispatch(new GetUtentiGestione());
    }

    @Action(ResetSediFiltroSelezionate)
    resetSediFiltroSelezionate({ patchState, dispatch }: StateContext<RicercaUtentiStateModel>): void {
        patchState({
            sediFiltroSelezionate: RicercaUtentiStateDefaults.sediFiltroSelezionate
        });
        dispatch(new GetUtentiGestione());
    }
}
