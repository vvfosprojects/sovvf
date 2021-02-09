import { Action, Select, Selector, State, StateContext } from '@ngxs/store';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { ToggleModifica } from '../../actions/view/view.actions';
import { RichiestaMarker } from '../../../maps/maps-model/richiesta-marker.model';
import { RichiesteMarkersState } from '../maps/richieste-markers.state';
import { UpdateRichiestaMarker, UpdateRichiestaMarkerModifica } from '../../actions/maps/richieste-markers.actions';
import { SetCoordCentroMappa, SetZoomCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { Observable } from 'rxjs';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { makeCopy } from '../../../../../shared/helper/function';
import produce from 'immer';
import {
    ChiudiRichiestaModifica,
    ClearRichiestaModifica,
    ModificaIndirizzo,
    ModificaRilevanza,
    ModificaRilevanzaStArCu,
    SetRichiestaModifica,
    SuccessRichiestaModifica,
    ClearIndirizzo
} from '../../actions/scheda-telefonata/richiesta-modifica.actions';
import { Injectable } from '@angular/core';

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

@Injectable()
@State<RichiestaModificaStateModel>({
    name: 'richiestaModifica',
    defaults: RichiestaModificaStateDefaults
})
export class RichiestaModificaState {

    @Select(RichiesteMarkersState.getRichiestaById) richiestaMarker$: Observable<RichiestaMarker>;

    constructor() {
    }

    @Selector()
    static richiestaModifica(state: RichiestaModificaStateModel): SintesiRichiesta {
        return state.richiestaModifica;
    }

    @Selector()
    static successModifica(state: RichiestaModificaStateModel): boolean {
        return state.successModifica;
    }

    @Action(SetRichiestaModifica)
    setRichiestaModifica({ patchState }: StateContext<RichiestaModificaStateModel>, action: SetRichiestaModifica): void {
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
    modificaRilevanza({ getState, setState }: StateContext<RichiestaModificaStateModel>): void {
        setState(
            produce(getState(), draft => {
                const richiesta = makeCopy(draft.richiestaModifica);
                if (draft.richiestaModifica.rilevanteGrave === true) {
                    richiesta.rilevanteGrave = false;
                    draft.richiestaModifica = richiesta;
                } else {
                    richiesta.rilevanteGrave = true;
                    draft.richiestaModifica = richiesta;
                }
            })
        );
    }

    @Action(ModificaRilevanzaStArCu)
    modificaRilevanzaStArCu({ getState, setState }: StateContext<RichiestaModificaStateModel>): void {
        setState(
            produce(getState(), draft => {
                const richiesta = draft.richiestaModifica;
                if (draft.richiestaModifica.rilevanteStArCu === true) {
                    richiesta.rilevanteStArCu = false;
                    draft.richiestaModifica = richiesta;
                } else {
                    richiesta.rilevanteStArCu = true;
                    draft.richiestaModifica = richiesta;
                }
            })
        );
    }

    @Action(ModificaIndirizzo)
    modificaIndirizzo({ getState, setState, patchState, dispatch }: StateContext<RichiestaModificaStateModel>, action: ModificaIndirizzo): void {
        if (action.nuovoIndirizzo) {
            patchState({
                modificaIndirizzo: true
            });
            const temporaryMarker: RichiestaMarker = makeCopy(getState().richiestaMarker);
            temporaryMarker.localita = action.nuovoIndirizzo;
            dispatch(new UpdateRichiestaMarkerModifica(temporaryMarker));
            dispatch(new SetCoordCentroMappa(action.nuovoIndirizzo.coordinate));
            dispatch(new SetZoomCentroMappa(18));
        }
    }

    @Action(SuccessRichiestaModifica)
    successModifica({ patchState, dispatch }: StateContext<RichiestaModificaStateModel>): void {
        patchState({
            successModifica: true
        });
        dispatch(new ChiudiRichiestaModifica(true));
    }

    @Action(ChiudiRichiestaModifica)
    chiudiRichiestaModifica({ getState, dispatch }: StateContext<RichiestaModificaStateModel>, action: ChiudiRichiestaModifica): void {
        const state = getState();
        if (state.modificaIndirizzo && !action.mantieniModificaIndirizzo) {
            dispatch(new UpdateRichiestaMarker(state.richiestaMarker));
        }
        dispatch(new ToggleModifica(true));
        dispatch(new ClearRichiestaModifica());
    }

    @Action(ClearRichiestaModifica)
    clearRichiestaModifica({ patchState }: StateContext<RichiestaModificaStateModel>): void {
        patchState(RichiestaModificaStateDefaults);
    }

    @Action(ClearIndirizzo)
    ClearIndirizzo({ dispatch }: StateContext<RichiestaModificaStateModel>): void {
        dispatch(new UpdateFormValue({
            path: 'richiestaModifica.modificaRichiestaForm',
            value: {
                indirizzo: '',
                latitudine: '',
                longitudine: ''
            }
        }));
    }
}
