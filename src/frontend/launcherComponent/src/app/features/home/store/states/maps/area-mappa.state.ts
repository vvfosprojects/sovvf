import { AreaMappa } from '../../../maps/maps-model/area-mappa-model';
import { Action, State, StateContext } from '@ngxs/store';
import { GetMarkersMappa, SetAreaMappa } from '../../actions/maps/area-mappa.actions';
import { GetRichiesteMarkers } from '../../actions/maps/richieste-markers.actions';
import { GetMezziMarkers } from '../../actions/maps/mezzi-markers.actions';
import { GetSediMarkers } from '../../actions/maps/sedi-markers.actions';

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
        dispatch(new GetMarkersMappa);
    }

    @Action(GetMarkersMappa)
    getMarkerMappa({ getState, dispatch }: StateContext<AreaMappaStateModel>) {
        const state = getState();
        // const filtriAttivi = this.store.selectSnapshot(MapsFiltroState.filtroMarkerAttivo);
        const filtriAttivi = ['richiesta', 'sede', 'mezzo']; // Todo: da finire, sistemare maps-filtro state -> subscription errata...
        console.log('filtri Attivi', filtriAttivi);
        if (filtriAttivi.includes('richiesta')) {
            dispatch(new GetRichiesteMarkers(state.areaMappa));
        }
        if (filtriAttivi.includes('sede')) {
            dispatch(new GetSediMarkers(state.areaMappa));
        }
        if (filtriAttivi.includes('mezzo')) {
            dispatch(new GetMezziMarkers(state.areaMappa));
        }
    }

}
