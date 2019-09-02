import { MezzoMarker } from '../../../maps/maps-model/mezzo-marker.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MezziMarkerService } from '../../../../../core/service/maps-service';
import { ClearMezziMarkers, GetMezziMarkers, OpacizzaMezziMarkers, SetMezziMarkers, SetMezzoMarkerById } from '../../actions/maps/mezzi-markers.actions';
import { SetMarkerOpachiMezzi } from '../../actions/maps/marker-opachi.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { SetMarkerLoading } from '../../actions/home.actions';

export interface MezziMarkersStateModel {
    mezziMarkers: MezzoMarker[];
    mezziMarkersId: string[];
    mezzoMarker: MezzoMarker;
}

export const MezziMarkersStateDefaults: MezziMarkersStateModel = {
    mezziMarkers: [],
    mezziMarkersId: [],
    mezzoMarker: null,
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
    getMezziMarkers({ dispatch }: StateContext<MezziMarkersStateModel>, action: GetMezziMarkers) {
        dispatch(new SetMarkerLoading(true));
        this._mezzi.getMezziMarkers(action.areaMappa).subscribe((data: MezzoMarker[]) => {
                dispatch([
                    new SetMezziMarkers(data),
                    new SetMarkerLoading(false)
                ]);
            }, () => dispatch([
                new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5),
                new SetMarkerLoading(false)
            ])
        );
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
                state.mezziMarkers.forEach(mezzoMarker => {
                    action.stato.forEach(statoMezzo => {
                        const _statoMezzo = statoMezzo.split(' ').join('');
                        const _mezzoMarker = mezzoMarker.mezzo.stato.split(' ').join('');
                        if (_mezzoMarker.substring(0, 5).toLowerCase() === _statoMezzo.substring(0, 5).toLowerCase()) {
                            filteredId.push(mezzoMarker.mezzo.codice);
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
