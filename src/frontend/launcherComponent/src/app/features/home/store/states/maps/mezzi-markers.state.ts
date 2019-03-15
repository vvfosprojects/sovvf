import { MezzoMarker } from '../../../maps/maps-model/mezzo-marker.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MezziMarkerService } from '../../../../../core/service/maps-service';
import { ClearMezziMarkers, GetMezziMarkers, OpacizzaMezziMarkers, SetMezziMarkers } from '../../actions/maps/mezzi-markers.actions';
import { makeCopy } from '../../../../../shared/helper/function';

export interface MezziMarkersStateModel {
    mezziMarkers: MezzoMarker[];
}

export const MezziMarkersStateDefaults: MezziMarkersStateModel = {
    mezziMarkers: null
};

@State<MezziMarkersStateModel>({
    name: 'mezziMarkers',
    defaults: MezziMarkersStateDefaults
})

export class MezziMarkersState {

    @Selector()
    static mezziMarkers(state: MezziMarkersStateModel) {
        return state.mezziMarkers;
    }

    constructor(private _mezzi: MezziMarkerService) {

    }

    @Action(GetMezziMarkers)
    getMezziMarkers({ dispatch }: StateContext<MezziMarkersStateModel>) {
        this._mezzi.getMezziMarkers().subscribe((result: MezzoMarker[]) => {
            dispatch(new SetMezziMarkers(result));
        });
    }

    @Action(SetMezziMarkers)
    setMezziMarkers({ patchState }: StateContext<MezziMarkersStateModel>, action: SetMezziMarkers) {
        patchState({
            mezziMarkers: action.mezziMarkers
        });
    }

    @Action(OpacizzaMezziMarkers)
    opacizzaMezziMarkers({ getState, patchState }: StateContext<MezziMarkersStateModel>, action: OpacizzaMezziMarkers) {
        const state = getState();
        const mezziMarkers = makeCopy(state.mezziMarkers);
        if (mezziMarkers) {
            mezziMarkers.forEach(r => {
                if (action.stato) {
                    r.opacita = true;
                    action.stato.forEach(c => {
                        if (r.mezzo.stato.substring(0, 5).toLowerCase() === c.substring(0, 5).toLowerCase()) {
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
            mezziMarkers: mezziMarkers
        });
    }

    @Action(ClearMezziMarkers)
    clearMezziMarkers({ patchState }: StateContext<MezziMarkersStateModel>) {
        patchState(MezziMarkersStateDefaults);
    }
}
