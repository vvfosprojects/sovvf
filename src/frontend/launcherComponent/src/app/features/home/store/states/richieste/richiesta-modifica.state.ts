import { Action, Select, Selector, State, StateContext } from '@ngxs/store';
// Model
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

// Action
import {
    ChiudiRichiestaModifica,
    ClearRichiestaModifica,
    ModificaIndirizzo,
    ModificaRilevanza, ModificaRilevanzaStArCu,
    SetRichiestaModifica,
    SuccessRichiestaModifica
} from '../../actions/richieste/richiesta-modifica.actions';
import produce from 'immer';
import { makeCopy } from '../../../../../shared/helper/function';
import { ToggleModifica } from '../../actions/view/view.actions';
import { RichiestaMarker } from '../../../maps/maps-model/richiesta-marker.model';
import { RichiesteMarkersState } from '../maps/richieste-markers.state';
import { UpdateRichiestaMarker } from '../../actions/maps/richieste-markers.actions';
import { SetCoordCentroMappa, SetZoomCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { Observable } from 'rxjs';

export interface RichiestaModificaStateModel {
    richiestaModifica: SintesiRichiesta;
    richiestaMarker: RichiestaMarker;
    successModifica: boolean;
    modificaIndirizzo: boolean;
}

export const RichiestaModificaStateDefaults: RichiestaModificaStateModel = {
    richiestaModifica: null,
    richiestaMarker: null,
    successModifica: false,
    modificaIndirizzo: false
};

@State<RichiestaModificaStateModel>({
    name: 'richiestaModifica',
    defaults: RichiestaModificaStateDefaults
})
export class RichiestaModificaState {

    @Select(RichiesteMarkersState.getRichiestaById) richiestaMarker$: Observable<RichiestaMarker>;

    constructor() {
    }

    @Selector()
    static richiestaModifica(state: RichiestaModificaStateModel) {
        return state.richiestaModifica;
    }

    @Selector()
    static successModifica(state: RichiestaModificaStateModel) {
        return state.successModifica;
    }

    @Action(SetRichiestaModifica)
    setRichiestaModifica({ patchState }: StateContext<RichiestaModificaStateModel>, action: SetRichiestaModifica) {
        patchState({
            richiestaModifica: action.richiesta
        });
        if (action.richiesta) {
            this.richiestaMarker$.subscribe(result => {
                if (result) {
                    patchState({
                        richiestaMarker: result
                    });
                }
            });
        }
    }

    @Action(ModificaRilevanza)
    modificaRilevanza({ getState, setState }: StateContext<RichiestaModificaStateModel>) {
        setState(
            produce(getState(), draft => {
                const richiesta = makeCopy(draft.richiestaModifica);
                if (draft.richiestaModifica.rilevanza === true) {
                    richiesta.rilevanza = false;
                    draft.richiestaModifica = richiesta;
                } else {
                    richiesta.rilevanza = true;
                    draft.richiestaModifica = richiesta;
                }
            })
        );
    }

    @Action(ModificaRilevanzaStArCu)
    modificaRilevanzaStArCu({ getState, setState }: StateContext<RichiestaModificaStateModel>) {
        setState(
            produce(getState(), draft => {
                const richiesta = makeCopy(draft.richiestaModifica);
                if (draft.richiestaModifica.rilevanzaStArCu === true) {
                    richiesta.rilevanzaStArCu = false;
                    draft.richiestaModifica = richiesta;
                } else {
                    richiesta.rilevanzaStArCu = true;
                    draft.richiestaModifica = richiesta;
                }
            })
        );
    }

    @Action(ModificaIndirizzo)
    modificaIndirizzo({ getState, patchState, dispatch }: StateContext<RichiestaModificaStateModel>, action: ModificaIndirizzo) {
        if (action.nuovoIndirizzo) {
            patchState({
                modificaIndirizzo: true
            });
            const temporaryMarker: RichiestaMarker = makeCopy(getState().richiestaMarker);
            temporaryMarker.localita = action.nuovoIndirizzo;
            dispatch(new UpdateRichiestaMarker(temporaryMarker));
            dispatch(new SetCoordCentroMappa(action.nuovoIndirizzo.coordinate));
            dispatch(new SetZoomCentroMappa(18));
        }
    }

    @Action(ChiudiRichiestaModifica)
    chiudiRichiestaModifica({ getState, dispatch }: StateContext<RichiestaModificaStateModel>, action: ChiudiRichiestaModifica) {
        const state = getState();
        if (state.modificaIndirizzo && !action.mantieniModificaIndirizzo) {
            dispatch(new UpdateRichiestaMarker(state.richiestaMarker));
        }
        dispatch(new ToggleModifica(true));
        dispatch(new ClearRichiestaModifica);
    }

    @Action(SuccessRichiestaModifica)
    successModifica({ patchState, dispatch }: StateContext<RichiestaModificaStateModel>) {
        patchState({
            successModifica: true
        });
        dispatch(new ChiudiRichiestaModifica(true));
    }

    @Action(ClearRichiestaModifica)
    clearRichiestaModifica({ patchState }: StateContext<RichiestaModificaStateModel>) {
        patchState(RichiestaModificaStateDefaults);
    }

}
