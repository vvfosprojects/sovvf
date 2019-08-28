import { AreaMappa } from '../../../maps/maps-model/area-mappa-model';
import { Action, State, StateContext } from '@ngxs/store';
import { SetAreaMappa } from '../../actions/maps/area-mappa.actions';
import { GetRichiesteMarkers } from '../../actions/maps/richieste-markers.actions';

export interface AreaMappaStateModel {
    areaMappa: AreaMappa;
}

export const AreaMappaStateDefaults: AreaMappaStateModel = {
    areaMappa: null
};

@State<AreaMappaStateModel>({
    name: 'areaMappa',
    defaults: AreaMappaStateDefaults
})

export class AreaMappaState {
    @Action(SetAreaMappa)
    setAreaMappa({ patchState, dispatch }: StateContext<AreaMappaStateModel>, action: SetAreaMappa) {
        patchState({
            areaMappa: action.areaMappa
        });
        dispatch(new GetRichiesteMarkers(action.areaMappa));
    }
}
