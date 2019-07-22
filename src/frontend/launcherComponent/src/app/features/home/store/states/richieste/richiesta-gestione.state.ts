import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

// Model
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

// Action
import { ClearRichiestaGestione, SetRichiestaGestione } from '../../actions/richieste/richiesta-gestione.actions';
import { ClearRichiestaSelezionata } from '../../actions/richieste/richiesta-selezionata.actions';
import { AddRichiestaEspansa } from '../../actions/richieste/richieste-espanse.actions';
import { ClearMarkerRichiestaSelezionato, SetMarkerRichiestaSelezionato } from '../../actions/maps/marker.actions';
import { GetInitCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { RichiestaFissataState } from './richiesta-fissata.state';

export interface RichiestaGestioneStateModel {
    richiestaGestione: SintesiRichiesta;
}

export const RichiestaGestioneStateDefaults: RichiestaGestioneStateModel = {
    richiestaGestione: null
};

@State<RichiestaGestioneStateModel>({
    name: 'richiestaGestione',
    defaults: RichiestaGestioneStateDefaults
})
export class RichiestaGestioneState {

    constructor(private store: Store) {
    }

    @Selector()
    static richiestaGestione(state: RichiestaGestioneStateModel) {
        return state.richiestaGestione;
    }

    @Action(SetRichiestaGestione)
    setRichiestaGestione({ getState, patchState, dispatch }: StateContext<RichiestaGestioneStateModel>, action: SetRichiestaGestione) {
        const state = getState();
        if (state.richiestaGestione && state.richiestaGestione.id === action.richiesta.id && !action.toggle) {
            dispatch(new ClearRichiestaGestione(action.richiesta.id));
            dispatch(new ClearRichiestaSelezionata());
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
    clearRichiestaGestione({ patchState, dispatch }: StateContext<RichiestaGestioneStateModel>, action: ClearRichiestaGestione) {
        const idRichiestaFissata = this.store.selectSnapshot(RichiestaFissataState.idRichiestaFissata);

        // se la richiesta non è fissata deseleziono il marker della richiesta in gestione e centro la mappa
        if (idRichiestaFissata !== action.idRichiesta) {
            dispatch(new ClearMarkerRichiestaSelezionato());
            dispatch(new GetInitCentroMappa());
        }

        patchState(RichiestaGestioneStateDefaults);
    }
}
