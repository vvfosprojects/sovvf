import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MarkerDatiMeteo } from '../../../maps/maps-model/marker-dati-meteo.interface';
import { MeteoService } from '../../../../../shared/meteo/meteo-service.service';
import { Meteo } from '../../../../../shared/model/meteo.model';
import produce from 'immer';
import { GetMarkerDatiMeteo, SetMarkerDatiMeteo } from '../../actions/maps/marker-dati-meteo.actions';

export interface MarkerDatiMeteoStateModel {
    markerDatiMeteo: MarkerDatiMeteo[];
}

export const markerDatiMeteoStateDefaults: MarkerDatiMeteoStateModel = {
    markerDatiMeteo: [],
};

@State<MarkerDatiMeteoStateModel>({
    name: 'markerDatiMeteo',
    defaults: markerDatiMeteoStateDefaults
})
export class MarkerDatiMeteoState {

    constructor(private meteo: MeteoService) {
    }

    @Selector()
    static markerDatiMeteo(state: MarkerDatiMeteoStateModel) {
        return state.markerDatiMeteo;
    }

    @Action(GetMarkerDatiMeteo)
    getMarkerDatiMeteo({ dispatch }: StateContext<MarkerDatiMeteoStateModel>, action: GetMarkerDatiMeteo) {
        this.meteo.getMeteoData(action.coordinate).subscribe((response: Meteo) => {
            const markerDatiMeteo: MarkerDatiMeteo = {
                id: action.id,
                datiMeteo: response
            };
            dispatch(new SetMarkerDatiMeteo(markerDatiMeteo));
        });
    }

    @Action(SetMarkerDatiMeteo)
    SetMarkerDatiMeteo({ getState, setState }: StateContext<MarkerDatiMeteoStateModel>, action: SetMarkerDatiMeteo) {
        const state = getState();
        setState(
            produce(state, (draft: MarkerDatiMeteoStateModel) => {
                draft.markerDatiMeteo.push(action.markerDatiMeteo);
            })
        );
    }
}
