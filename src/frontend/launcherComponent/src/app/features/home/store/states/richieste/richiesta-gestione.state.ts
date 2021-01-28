import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { ClearRichiestaGestione, SetRichiestaGestione } from '../../actions/richieste/richiesta-gestione.actions';
import { ClearRichiestaSelezionata } from '../../actions/richieste/richiesta-selezionata.actions';
import {AddRichiestaEspansa, RemoveRichiestaEspansa} from '../../actions/richieste/richieste-espanse.actions';
import { ClearMarkerRichiestaSelezionato, SetMarkerRichiestaSelezionato } from '../../actions/maps/marker.actions';
import { GetInitCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { RichiestaFissataState } from './richiesta-fissata.state';
import { Injectable } from '@angular/core';

export interface RichiestaGestioneStateModel {
    richiestaGestione: SintesiRichiesta;
}

export const RichiestaGestioneStateDefaults: RichiestaGestioneStateModel = {
    richiestaGestione: null
};

@Injectable()
@State<RichiestaGestioneStateModel>({
    name: 'richiestaGestione',
    defaults: RichiestaGestioneStateDefaults
})
export class RichiestaGestioneState {

    constructor(private store: Store) {
    }

    @Selector()
    static richiestaGestione(state: RichiestaGestioneStateModel): SintesiRichiesta {
        return state.richiestaGestione;
    }

    @Selector()
    static idRichiestaGestione(state: RichiestaGestioneStateModel): string {
        return state.richiestaGestione ? state.richiestaGestione.id : null;
    }

    @Action(SetRichiestaGestione)
    setRichiestaGestione({ getState, patchState, dispatch }: StateContext<RichiestaGestioneStateModel>, action: SetRichiestaGestione): void {
        const state = getState();
        if (state.richiestaGestione && state.richiestaGestione.id === action.richiesta.id && !action.toggle) {
            dispatch(new ClearRichiestaGestione(action.richiesta.id));
            dispatch(new ClearRichiestaSelezionata());
            dispatch(new RemoveRichiestaEspansa(action.richiesta.id));
        } else {
            patchState({
                richiestaGestione: action.richiesta
            });
            dispatch(new AddRichiestaEspansa(action.richiesta.id));
            dispatch(new ClearMarkerRichiestaSelezionato());
            dispatch(new GetInitCentroMappa());
            dispatch(new SetMarkerRichiestaSelezionato(action.richiesta.id));
        }
    }

    @Action(ClearRichiestaGestione)
    clearRichiestaGestione({ patchState, dispatch }: StateContext<RichiestaGestioneStateModel>, action: ClearRichiestaGestione): void {
        const idRichiestaFissata = this.store.selectSnapshot(RichiestaFissataState.idRichiestaFissata);

        // se la richiesta non è fissata deseleziono il marker della richiesta in gestione e centro la mappa
        if (idRichiestaFissata !== action.idRichiesta) {
            dispatch(new ClearMarkerRichiestaSelezionato());
            dispatch(new GetInitCentroMappa());
        }

        patchState(RichiestaGestioneStateDefaults);
    }
}
