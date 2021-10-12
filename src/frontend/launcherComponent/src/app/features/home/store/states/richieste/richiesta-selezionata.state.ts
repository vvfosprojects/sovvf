import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SetRichiestaSelezionata, ClearRichiestaSelezionata } from '../../actions/richieste/richiesta-selezionata.actions';
import { ClearRichiestaGestione } from '../../actions/richieste/richiesta-gestione.actions';
import { RichiestaGestioneState } from './richiesta-gestione.state';
import { Injectable } from '@angular/core';
import { SetCentroMappa } from '../../actions/maps/centro-mappa.actions';

export interface RichiestaSelezionataStateModel {
    idRichiestaSelezionata: string;
}

export const RichiestaSelezionataStateDefaults: RichiestaSelezionataStateModel = {
    idRichiestaSelezionata: null
};

@Injectable()
@State<RichiestaSelezionataStateModel>({
    name: 'richiestaSelezionata',
    defaults: RichiestaSelezionataStateDefaults
})
export class RichiestaSelezionataState {

    constructor(private store: Store) {
    }

    @Selector()
    static idRichiestaSelezionata(state: RichiestaSelezionataStateModel): string {
        return state.idRichiestaSelezionata;
    }

    @Action(SetRichiestaSelezionata)
    setRichiestaSelezionata({ getState, patchState, dispatch }: StateContext<RichiestaSelezionataStateModel>, action: SetRichiestaSelezionata): void {
        const state = getState();
        // controlli per rimuovere, se presente, la richiesta in gestione
        const richiestaGestione = this.store.selectSnapshot(RichiestaGestioneState.richiestaGestione);
        if (state.idRichiestaSelezionata && richiestaGestione && state.idRichiestaSelezionata === richiestaGestione.id) {
            dispatch(new ClearRichiestaGestione(state.idRichiestaSelezionata));
        }
        // imposto la richiesta selezionata
        patchState({
            idRichiestaSelezionata: action.idRichiesta
        });
    }

    @Action(ClearRichiestaSelezionata)
    clearRichiestaSelezionata({ patchState }: StateContext<RichiestaSelezionataStateModel>): void {
        patchState({
            idRichiestaSelezionata: null
        });
    }
}
