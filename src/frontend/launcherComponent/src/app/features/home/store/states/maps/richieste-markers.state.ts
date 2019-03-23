import { Action, Selector, State, StateContext } from '@ngxs/store';
import { RichiesteMarkerService } from '../../../../../core/service/maps-service';
import { RichiestaMarker } from '../../../maps/maps-model/richiesta-marker.model';
import {
    ClearRichiesteMarkers,
    GetRichiesteMarkers,
    OpacizzaRichiesteMarkers,
    SetRichiestaMarkerById,
    SetRichiesteMarkers
} from '../../actions/maps/richieste-markers.actions';
import { wipeStatoRichiesta } from '../../../../../shared/helper/function';
import { SetMarkerOpachiRichieste } from '../../actions/maps/marker-opachi.actions';

export interface RichiesteMarkersStateModel {
    richiesteMarkers: RichiestaMarker[];
    richiestaMarkerById: RichiestaMarker;
}

export const RichiesteMarkersStateDefaults: RichiesteMarkersStateModel = {
    richiesteMarkers: null,
    richiestaMarkerById: null
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
    static getRichiestaById(state: RichiesteMarkersStateModel) {
        return state.richiestaMarkerById;
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

    @Action(SetRichiestaMarkerById)
    setRichiestaMarkerById({ getState, patchState }: StateContext<RichiesteMarkersStateModel>, action: SetRichiestaMarkerById) {
        const state = getState();
        if (action.id) {
            patchState({
                richiestaMarkerById: state.richiesteMarkers.filter(richieste => richieste.id === action.id)[0]
            });
        } else {
            patchState({
                richiestaMarkerById: null
            });
        }
    }

    @Action(OpacizzaRichiesteMarkers)
    opacizzaRichiesteMarkers({ getState, dispatch }: StateContext<RichiesteMarkersStateModel>, action: OpacizzaRichiesteMarkers) {
        const state = getState();
        const filteredId: string[] = [];
        if (action.stato) {
            state.richiesteMarkers.forEach(r => {
                action.stato.forEach(c => {
                    if (wipeStatoRichiesta(r.stato).substring(0, 5).toLowerCase() === c.substring(0, 5).toLowerCase()) {
                        filteredId.push(r.id);
                    }
                });
            });
        }
        if (filteredId.length > 0) {
            dispatch(new SetMarkerOpachiRichieste(filteredId));
        }
    }

    @Action(ClearRichiesteMarkers)
    clearRichiesteMarkers({ patchState }: StateContext<RichiesteMarkersStateModel>) {
        patchState(RichiesteMarkersStateDefaults);
    }

}
