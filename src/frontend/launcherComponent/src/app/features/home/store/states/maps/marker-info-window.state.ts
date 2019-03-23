import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch, append, updateItem } from '@ngxs/store/operators';
import { MarkerDatiMeteo } from '../../../maps/maps-model/marker-dati-meteo.interface';
import { MeteoService } from '../../../../../shared/meteo/meteo-service.service';
import { Meteo } from '../../../../../shared/model/meteo.model';
import { GetMarkerDatiMeteo, SetMarkerDatiMeteo } from '../../actions/maps/marker-info-window.actions';

export interface MarkerInfoWindowStateModel {
    markerDatiMeteo: MarkerDatiMeteo[];

}

export const markerInfoWindowStateDefaults: MarkerInfoWindowStateModel = {
    markerDatiMeteo: [],
};

@State<MarkerInfoWindowStateModel>({
    name: 'markerInfoWindow',
    defaults: markerInfoWindowStateDefaults
})
export class MarkerInfoWindowState {

    constructor(private meteo: MeteoService) {
    }

    @Selector()
    static markerDatiMeteo(state: MarkerInfoWindowStateModel) {
        return state.markerDatiMeteo;
    }

    @Action(GetMarkerDatiMeteo)
    getMarkerDatiMeteo({ dispatch }: StateContext<MarkerInfoWindowStateModel>, action: GetMarkerDatiMeteo) {
        this.meteo.getMeteoData(action.coordinate).subscribe((response: Meteo) => {
            const markerDatiMeteo: MarkerDatiMeteo = {
                id: action.id,
                datiMeteo: response,
                date: action.date
            };
            dispatch(new SetMarkerDatiMeteo(markerDatiMeteo));
        });
    }

    @Action(SetMarkerDatiMeteo)
    setMarkerDatiMeteo({ getState, setState }: StateContext<MarkerInfoWindowStateModel>, { payload }: SetMarkerDatiMeteo) {
        const state = getState();
        const index = state.markerDatiMeteo.findIndex(dati => dati.id === payload.id);
        if (index < 0) {
            setState(
                patch({
                    markerDatiMeteo: append([payload])
                })
            );
        } else {
            setState(
                patch({
                    markerDatiMeteo: updateItem<MarkerDatiMeteo>(dati => dati.id === payload.id, payload)
                })
            );
        }
    }

}
