import { MezzoMarker } from '../../../maps/maps-model/mezzo-marker.model';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { MezziMarkerService } from '../../../../../core/service/maps-service';
import { GetMezziMarkers, SetMezziMarkers } from '../../actions/maps/mezzi-markers.actions';

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

export class MezziMarkersState implements NgxsOnInit {

    @Selector()
    static mezziMarkers(state: MezziMarkersStateModel) {
        return state.mezziMarkers;
    }

    constructor(private _mezzi: MezziMarkerService) {

    }

    ngxsOnInit(ctx: StateContext<MezziMarkersState>) {
        ctx.dispatch(new GetMezziMarkers());
    }

    @Action(GetMezziMarkers)
    getMezziMarkers({ dispatch }: StateContext<MezziMarkersStateModel>) {
        this._mezzi.getMezziMarkers().subscribe((result: MezzoMarker[]) => {
            dispatch(new SetMezziMarkers(result));
        });
    }

    @Action(SetMezziMarkers)
    setMezziMarkers({ getState, patchState }: StateContext<MezziMarkersStateModel>, action: SetMezziMarkers) {
        const state = getState();
        patchState({
            ...state,
            mezziMarkers: action.mezziMarkers
        });
    }
}
