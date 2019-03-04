import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { RichiesteMarkerService } from '../../../../../core/service/maps-service';
import { RichiestaMarker } from '../../../maps/maps-model/richiesta-marker.model';
import { GetRichiesteMarkers, SetRichiesteMarkers } from '../../actions/maps/richieste-markers.actions';

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

export class RichiesteMarkersState implements NgxsOnInit {

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

    ngxsOnInit(ctx: StateContext<RichiesteMarkersState>) {
        ctx.dispatch(new GetRichiesteMarkers());
    }

    @Action(GetRichiesteMarkers)
    getRichiesteMarkers({ dispatch }: StateContext<RichiesteMarkersStateModel>) {
        this._richieste.getRichiesteMarkers().subscribe((result: RichiestaMarker[]) => {
            dispatch(new SetRichiesteMarkers(result));
        });
    }

    @Action(SetRichiesteMarkers)
    setRichiesteMarkers({ getState, patchState }: StateContext<RichiesteMarkersStateModel>, action: SetRichiesteMarkers) {
        const state = getState();
        patchState({
            ...state,
            richiesteMarkers: action.richiesteMarkers
        });
    }
}
