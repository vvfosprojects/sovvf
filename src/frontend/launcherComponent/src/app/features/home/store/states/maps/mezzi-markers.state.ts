import { MezzoMarker } from '../../../maps/maps-model/mezzo-marker.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MezziMarkerService } from '../../../../../core/service/maps-service';
import { ClearMezziMarkers, GetMezziMarkers, OpacizzaMezziMarkers, SetMezziMarkers, SetMezzoMarkerById } from '../../actions/maps/mezzi-markers.actions';
import { SetMarkerOpachiMezzi } from '../../actions/maps/marker-opachi.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';

export interface MezziMarkersStateModel {
    mezziMarkers: MezzoMarker[];
    mezzoMarker: MezzoMarker;
}

export const MezziMarkersStateDefaults: MezziMarkersStateModel = {
    mezziMarkers: null,
    mezzoMarker: null
};

@State<MezziMarkersStateModel>({
    name: 'mezziMarkers',
    defaults: MezziMarkersStateDefaults
})

export class MezziMarkersState {

    @Selector()
    static mezziMarkers(state: MezziMarkersStateModel) {
        return state.mezziMarkers;
    }

    @Selector()
    static getMezzoById(state: MezziMarkersStateModel) {
        return state.mezzoMarker;
    }

    constructor(private _mezzi: MezziMarkerService) {

    }

    @Action(GetMezziMarkers)
    getMezziMarkers({ dispatch }: StateContext<MezziMarkersStateModel>) {
        this._mezzi.getMezziMarkers().subscribe((data: MezzoMarker[]) => {
            dispatch(new SetMezziMarkers(data));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(SetMezziMarkers)
    setMezziMarkers({ patchState }: StateContext<MezziMarkersStateModel>, action: SetMezziMarkers) {
        patchState({
            mezziMarkers: action.mezziMarkers
        });
    }

    @Action(SetMezzoMarkerById)
    setMezzoMarkerById({ getState, patchState }: StateContext<MezziMarkersStateModel>, action: SetMezzoMarkerById) {
        const state = getState();
        if (action.id) {
            patchState({
                mezzoMarker: state.mezziMarkers.filter(mezzi => mezzi.mezzo.codice === action.id)[0]
            });
        } else {
            patchState({
                mezzoMarker: null
            });
        }
    }

    @Action(OpacizzaMezziMarkers)
    opacizzaMezziMarkers({ getState, dispatch }: StateContext<MezziMarkersStateModel>, action: OpacizzaMezziMarkers) {
        const state = getState();
        const filteredId: string[] = [];
        if (action.stato) {
            if (state.mezziMarkers) {
                state.mezziMarkers.forEach(r => {
                    action.stato.forEach(c => {
                        if (r.mezzo.stato.substring(0, 5).toLowerCase() === c.substring(0, 5).toLowerCase()) {
                            filteredId.push(r.mezzo.codice);
                        }
                    });
                });
                dispatch(new SetMarkerOpachiMezzi(filteredId));
            }
        }
    }

    @Action(ClearMezziMarkers)
    clearMezziMarkers({ patchState }: StateContext<MezziMarkersStateModel>) {
        patchState(MezziMarkersStateDefaults);
    }
}
