import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { SedeMarker } from '../../../maps/maps-model/sede-marker.model';
import { SediMarkerService } from '../../../../../core/service/maps-service';
import { ClearSediMarkers, GetSediMarkers, SetSediMarkers } from '../../actions/maps/sedi-markers.actions';

export interface SediMarkersStateModel {
    sediMarkers: SedeMarker[];
}

export const SediMarkersStateDefaults: SediMarkersStateModel = {
    sediMarkers: null
};

@State<SediMarkersStateModel>({
    name: 'sediMarkers',
    defaults: SediMarkersStateDefaults
})

export class SediMarkersState implements NgxsOnInit {

    @Selector()
    static sediMarkers(state: SediMarkersStateModel) {
        return state.sediMarkers;
    }

    constructor(private _sedi: SediMarkerService) {

    }

    ngxsOnInit(ctx: StateContext<SediMarkersState>) {
        // ctx.dispatch(new GetSediMarkers());
    }

    @Action(GetSediMarkers)
    getSediMarkers({ dispatch }: StateContext<SediMarkersStateModel>) {
        this._sedi.getSediMarkers().subscribe((result: SedeMarker[]) => {
            dispatch(new SetSediMarkers(result));
        });
    }

    @Action(SetSediMarkers)
    setSediMarkers({ patchState }: StateContext<SediMarkersStateModel>, action: SetSediMarkers) {
        patchState({
            sediMarkers: action.sediMarkers
        });
    }

    @Action(ClearSediMarkers)
    clearRichieste({ patchState }: StateContext<SediMarkersStateModel>) {
        patchState(SediMarkersStateDefaults);
    }
}
