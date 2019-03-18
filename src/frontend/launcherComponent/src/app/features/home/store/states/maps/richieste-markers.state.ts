import { Action, Selector, State, StateContext } from '@ngxs/store';
import { RichiesteMarkerService } from '../../../../../core/service/maps-service';
import { RichiestaMarker } from '../../../maps/maps-model/richiesta-marker.model';
import { ClearRichiesteMarkers, GetRichiesteMarkers, OpacizzaRichiesteMarkers, OpacizzaRichiesteMarkersById, SetRichiesteMarkers } from '../../actions/maps/richieste-markers.actions';
import { makeCopy, wipeStatoRichiesta } from '../../../../../shared/helper/function';
import produce from 'immer';

export interface RichiesteMarkersStateModel {
    richiesteMarkers: RichiestaMarker[];
}

export const RichiesteMarkersStateDefaults: RichiesteMarkersStateModel = {
    richiesteMarkers: null
};

@State<RichiesteMarkersStateModel>({
    name: 'richiesteMarkers',
    defaults: RichiesteMarkersStateDefaults
})

export class RichiesteMarkersState {

    @Selector()
    static richiesteMarkers(state: RichiesteMarkersStateModel) {
        return state.richiesteMarkers;
    }

    @Selector()
    static richiesteLenghtMarkers(state: RichiesteMarkersStateModel) {
        return state.richiesteMarkers.length;
    }

    @Selector()
    static getRichiesteById(state: RichiesteMarkersStateModel) {
        return (id: string) => state.richiesteMarkers.find(x => x.id === id);
    }

    constructor(private _richieste: RichiesteMarkerService) {

    }

    @Action(GetRichiesteMarkers)
    getRichiesteMarkers({ dispatch }: StateContext<RichiesteMarkersStateModel>) {
        this._richieste.getRichiesteMarkers().subscribe((result: RichiestaMarker[]) => {
            dispatch(new SetRichiesteMarkers(result));
        });
    }

    @Action(SetRichiesteMarkers)
    setRichiesteMarkers({ patchState }: StateContext<RichiesteMarkersStateModel>, action: SetRichiesteMarkers) {
        patchState({
            richiesteMarkers: action.richiesteMarkers
        });
    }

    @Action(OpacizzaRichiesteMarkers)
    opacizzaRichiesteMarkers({ getState, setState }: StateContext<RichiesteMarkersStateModel>, action: OpacizzaRichiesteMarkers) {
        const state = getState();
        setState(
            produce(state, draft => {
                if (state.richiesteMarkers) {
                    draft.richiesteMarkers.map(r => {
                        if (action.stato) {
                            r.opacita = true;
                            action.stato.forEach(c => {
                                if (wipeStatoRichiesta(r.stato).substring(0, 5).toLowerCase() === c.substring(0, 5).toLowerCase()) {
                                    r.opacita = false;
                                }
                            });
                        } else {
                            r.opacita = false;
                        }
                    });
                }
            }),
        );
    }

    @Action(OpacizzaRichiesteMarkersById)
    opacizzaRichiesteMarkersById({ getState, patchState }: StateContext<RichiesteMarkersStateModel>, action: OpacizzaRichiesteMarkersById) {
        const state = getState();
        const richiesteMarkers: RichiestaMarker[] = makeCopy(state.richiesteMarkers);
        if (richiesteMarkers) {
            richiesteMarkers.forEach(r => {
                if (action.id) {
                    r.opacita = true;
                    action.id.forEach(c => {
                        if (r.id === c) {
                            r.opacita = false;
                        }
                    });
                } else {
                    r.opacita = false;
                }
            });
        }
        patchState({
            ...state,
            richiesteMarkers: richiesteMarkers
        });
    }

    @Action(ClearRichiesteMarkers)
    clearRichiesteMarkers({ patchState }: StateContext<RichiesteMarkersStateModel>) {
        patchState(RichiesteMarkersStateDefaults);
    }

}
