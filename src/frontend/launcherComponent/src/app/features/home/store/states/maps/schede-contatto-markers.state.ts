import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import {
    AddSchedeContattoMarkers,
    ClearSchedeContattoMarkers,
    InsertSchedaContattoMarker,
    OpacizzaSchedeContattoMarkers,
    PatchSchedeContattoMarkers,
    RemoveSchedaContattoMarker,
    SetSchedaContattoMarkerById,
    SetSchedeContattoMarkers,
    UpdateSchedaContattoMarker
} from '../../actions/maps/schede-contatto-markers.actions';
import { SchedaContattoMarker } from '../../../maps/maps-model/scheda-contatto.model';
import { SchedaContatto } from '../../../../../shared/interface/scheda-contatto.interface';

export interface SchedeContattoMarkersStateModel {
    schedeContattoMarkers: SchedaContattoMarker[];
    schedeContattoMarkersId: string[];
    schedaContattoMarker: SchedaContattoMarker;
}

export const SchedeContattoMarkersStateDefaults: SchedeContattoMarkersStateModel = {
    schedeContattoMarkers: [],
    schedeContattoMarkersId: [],
    schedaContattoMarker: null
};

@State<SchedeContattoMarkersStateModel>({
    name: 'schedeContattoMarkers',
    defaults: SchedeContattoMarkersStateDefaults
})

export class SchedeContattoMarkers {

    @Selector()
    static schedeContattoMarkers(state: SchedeContattoMarkersStateModel) {
        return state.schedeContattoMarkers;
    }

    @Selector()
    static schedeContattoMarkersIds(state: SchedeContattoMarkersStateModel) {
        return state.schedeContattoMarkersId;
    }

    @Selector()
    static getSchedaContattoMarkerById(state: SchedeContattoMarkersStateModel) {
        return state.schedaContattoMarker;
    }

    @Action(SetSchedeContattoMarkers)
    setSchedeContattoMarkers({ getState, dispatch }: StateContext<SchedeContattoMarkersStateModel>, action: SetSchedeContattoMarkers) {
        const schedeMarkers = [] as SchedaContattoMarker[];
        action.schedeContatto.forEach((scheda: SchedaContatto) => {
            schedeMarkers.push(new SchedaContattoMarker(scheda));
        });
        dispatch(new PatchSchedeContattoMarkers(schedeMarkers));
    }

    @Action(PatchSchedeContattoMarkers)
    patchSchedeContattoMarkers({ patchState }: StateContext<SchedeContattoMarkersStateModel>, { payload }: PatchSchedeContattoMarkers) {
        patchState({
            schedeContattoMarkers: payload.map((scheda: SchedaContattoMarker) => scheda),
            schedeContattoMarkersId: payload.map((scheda: SchedaContattoMarker) => scheda.schedaContatto.codiceScheda)
        });
    }

    @Action(AddSchedeContattoMarkers)
    addSchedeContattoMarkers({ setState }: StateContext<SchedeContattoMarkersStateModel>, { payload }: AddSchedeContattoMarkers) {
        setState(
            patch({
                schedeContattoMarkers: append(payload.map((scheda: SchedaContattoMarker) => scheda)),
                schedeContattoMarkersId: append(payload.map((scheda: SchedaContattoMarker) => scheda.schedaContatto.codiceScheda))
            })
        );
    }

    @Action(InsertSchedaContattoMarker)
    insertSchedaContattoMarker({ setState }: StateContext<SchedeContattoMarkersStateModel>, { payload, before }: InsertSchedaContattoMarker) {
        setState(
            patch({
                schedeContattoMarkers: insertItem(payload, before),
                schedeContattoMarkersId: insertItem(payload.schedaContatto.codiceScheda, before)
            })
        );
    }

    @Action(UpdateSchedaContattoMarker)
    updateSchedaContattoMarker({ setState }: StateContext<SchedeContattoMarkersStateModel>, { payload }: UpdateSchedaContattoMarker) {
        setState(
            patch({
                schedeContattoMarkers: updateItem<SchedaContattoMarker>((scheda: SchedaContattoMarker) => scheda.schedaContatto.codiceScheda === payload.schedaContatto.codiceScheda, payload)
            })
        );
    }

    @Action(RemoveSchedaContattoMarker)
    removeSchedaContattoMarker({ setState }: StateContext<SchedeContattoMarkersStateModel>, { payload }: RemoveSchedaContattoMarker) {
        setState(
            patch({
                schedeContattoMarkers: removeItem<SchedaContattoMarker>((scheda: SchedaContattoMarker) => scheda.schedaContatto.codiceScheda === payload),
                schedeContattoMarkersId: removeItem<string>(id => id === payload)
            })
        );
    }

    @Action(SetSchedaContattoMarkerById)
    setSchedaContattoMarkerById({ getState, patchState }: StateContext<SchedeContattoMarkersStateModel>, action: SetSchedaContattoMarkerById) {
        const state = getState();
        if (action.id) {
            patchState({
                schedaContattoMarker: state.schedeContattoMarkers.filter((scheda: SchedaContattoMarker) => scheda.schedaContatto.codiceScheda === action.id)[0]
            });
        } else {
            patchState({
                schedaContattoMarker: null
            });
        }
    }

    @Action(ClearSchedeContattoMarkers)
    clearSchedeContattoMarkers({ patchState }: StateContext<SchedeContattoMarkersStateModel>) {
        patchState(SchedeContattoMarkersStateDefaults);
    }

}
