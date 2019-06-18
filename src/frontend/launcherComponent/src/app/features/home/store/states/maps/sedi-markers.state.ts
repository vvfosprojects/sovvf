import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SedeMarker } from '../../../maps/maps-model/sede-marker.model';
import { SediMarkerService } from '../../../../../core/service/maps-service';
import { ClearSediMarkers, GetSediMarkers, SetSedeMarkerById, SetSediMarkers } from '../../actions/maps/sedi-markers.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';

export interface SediMarkersStateModel {
    sediMarkers: SedeMarker[];
    sedeMarkerById: SedeMarker;
}

export const SediMarkersStateDefaults: SediMarkersStateModel = {
    sediMarkers: null,
    sedeMarkerById: null
};

@State<SediMarkersStateModel>({
    name: 'sediMarkers',
    defaults: SediMarkersStateDefaults
})

export class SediMarkersState {

    @Selector()
    static sediMarkers(state: SediMarkersStateModel) {
        return state.sediMarkers;
    }

    @Selector()
    static getSedeById(state: SediMarkersStateModel) {
        return state.sedeMarkerById;
    }

    constructor(private _sedi: SediMarkerService) {

    }

    @Action(GetSediMarkers)
    getSediMarkers({ dispatch }: StateContext<SediMarkersStateModel>) {
        this._sedi.getSediMarkers().subscribe((data: SedeMarker[]) => {
            dispatch(new SetSediMarkers(data));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(SetSediMarkers)
    setSediMarkers({ patchState }: StateContext<SediMarkersStateModel>, action: SetSediMarkers) {
        patchState({
            sediMarkers: action.sediMarkers
        });
    }

    @Action(SetSedeMarkerById)
    setSedeMarkerById({ getState, patchState }: StateContext<SediMarkersStateModel>, action: SetSedeMarkerById) {
        const state = getState();
        if (action.id) {
            patchState({
                sedeMarkerById: state.sediMarkers.filter(sedi => sedi.codice === action.id)[0]
            });
        } else {
            patchState({
                sedeMarkerById: null
            });
        }
    }

    @Action(ClearSediMarkers)
    clearRichieste({ patchState }: StateContext<SediMarkersStateModel>) {
        patchState(SediMarkersStateDefaults);
    }
}
