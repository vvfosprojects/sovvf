import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch, append, updateItem } from '@ngxs/store/operators';
import { MarkerDatiMeteo } from '../../../maps/maps-model/marker-dati-meteo.interface';
import { MeteoService } from '../../../../../shared/meteo/meteo-service.service';
import { Meteo } from '../../../../../shared/model/meteo.model';
import { GetMarkerDatiMeteo, AddMarkerDatiMeteo, UpdateMarkerDatiMeteo, GetMarkerDatiMeteoFromApi } from '../../actions/maps/marker-info-window.actions';

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

    /**
     * minuti che devono trascorrere prima di effettuare una nuova richiesta api
     * per un marker che ha già ricevuto precedentemente i dati del meteo
     */
    readonly meteoUpdateTime = 5;

    constructor(private meteo: MeteoService) {
    }

    @Selector()
    static markerDatiMeteo(state: MarkerInfoWindowStateModel) {
        return state.markerDatiMeteo;
    }

    @Action(GetMarkerDatiMeteo)
    getMarkerDatiMeteo({ getState, dispatch }: StateContext<MarkerInfoWindowStateModel>, action: GetMarkerDatiMeteo) {
        const state = getState();
        const index = state.markerDatiMeteo.findIndex(dati => dati.id === action.id);
        const checkUpdate = !!(index >= 0 && new Date().getTime() - state.markerDatiMeteo[index].date.getTime() > this.meteoUpdateTime * 60000);
        if (index < 0 || checkUpdate) {
            dispatch(new GetMarkerDatiMeteoFromApi(action.id, action.coordinate));
        }
    }

    @Action(GetMarkerDatiMeteoFromApi)
    getMarkerDatiMeteoFromApi({ getState, dispatch }: StateContext<MarkerInfoWindowStateModel>, action: GetMarkerDatiMeteoFromApi) {
        const state = getState();
        const index = state.markerDatiMeteo.findIndex(dati => dati.id === action.id);
        this.meteo.getMeteoData(action.coordinate).subscribe((response: Meteo) => {
            const markerDatiMeteo: MarkerDatiMeteo = {
                id: action.id,
                datiMeteo: response,
                date: action.date
            };
            if (index < 0) {
                dispatch(new AddMarkerDatiMeteo(markerDatiMeteo));
            } else {
                dispatch(new UpdateMarkerDatiMeteo(markerDatiMeteo));
            }
        });
    }

    @Action(AddMarkerDatiMeteo)
    addMarkerDatiMeteo({ setState }: StateContext<MarkerInfoWindowStateModel>, { payload }: AddMarkerDatiMeteo) {
        setState(
            patch({
                markerDatiMeteo: append([payload])
            })
        );
    }

    @Action(UpdateMarkerDatiMeteo)
    updateMarkerDatiMeteo({ setState }: StateContext<MarkerInfoWindowStateModel>, { payload }: UpdateMarkerDatiMeteo) {
        setState(
            patch({
                markerDatiMeteo: updateItem<MarkerDatiMeteo>(dati => dati.id === payload.id, payload)
            })
        );
    }

}
