import { AreaMappa } from '../../../maps/maps-model/area-mappa-model';
import { Action, State, StateContext } from '@ngxs/store';
import { SetAreaMappa } from '../../actions/maps/area-mappa.actions';
import { GetRichiesteMarkers } from '../../actions/maps/richieste-markers.actions';
import { GetMezziMarkers } from '../../actions/maps/mezzi-markers.actions';

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
        // Todo: da aggiungere controllo per lo stato dei filtri attivi
        dispatch([
            new GetRichiesteMarkers(action.areaMappa),
            new GetMezziMarkers(action.areaMappa)
        ]);
    }
}
