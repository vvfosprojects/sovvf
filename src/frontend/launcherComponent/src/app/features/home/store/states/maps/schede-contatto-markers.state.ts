import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { SetMarkerLoading } from '../../actions/home.actions';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import {
    AddSchedeContattoMarkers,
    ClearSchedeContattoMarkers,
    GetSchedeContattoMarkers,
    InsertSchedaContattoMarker,
    OpacizzaSchedeContattoMarkers,
    PatchSchedeContattoMarkers,
    RemoveSchedaContattoMarker,
    SetSchedaContattoMarkerById,
    SetSchedeContattoMarkers,
    UpdateSchedaContattoMarker
} from '../../actions/maps/schede-contatto-markers.actions';
import { SchedaContattoMarker } from '../../../maps/maps-model/scheda-contatto.model';

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

    @Action(GetSchedeContattoMarkers)
    getSchedeContattoMarkers({ dispatch }: StateContext<SchedeContattoMarkersStateModel>) {
        dispatch(new SetMarkerLoading(true));
    }

    @Action(SetSchedeContattoMarkers)
    setSchedeContattoMarkers({ getState, dispatch }: StateContext<SchedeContattoMarkersStateModel>, action: SetSchedeContattoMarkers) {
        const state = getState();
        if (action.schedeContattoMarkers) {
            if (state.schedeContattoMarkers.length === 0) {
                dispatch(new PatchSchedeContattoMarkers(action.schedeContattoMarkers));
            } else {
                const actionSchedeContattoId: string[] = [];
                const schedaContattoMarkerRemoveId: string[] = [];
                const schedaContattoMarkerAdd: SchedaContattoMarker[] = [];
                /**
                 * scheda contatto da aggiungere
                 */
                action.schedeContattoMarkers.forEach((scheda: SchedaContattoMarker) => {
                    actionSchedeContattoId.push(scheda.schedaContatto.codiceScheda);
                    if (!state.schedeContattoMarkersId.includes(scheda.schedaContatto.codiceScheda)) {
                        schedaContattoMarkerAdd.push(scheda);
                    }
                });
                /**
                 * scheda contatto da rimuovere
                 */
                state.schedeContattoMarkers.forEach((scheda: SchedaContattoMarker) => {
                    if (!actionSchedeContattoId.includes(scheda.schedaContatto.codiceScheda)) {
                        schedaContattoMarkerRemoveId.push(scheda.schedaContatto.codiceScheda);
                    }
                });
                /**
                 * tolgo i marker dallo stato
                 */
                if (schedaContattoMarkerRemoveId.length > 0) {
                    schedaContattoMarkerRemoveId.forEach(id => {
                        dispatch(new RemoveSchedaContattoMarker(id));
                    });
                }
                /**
                 * aggiungo i marker allo stato
                 */
                if (schedaContattoMarkerAdd.length > 0) {
                    dispatch(new AddSchedeContattoMarkers(schedaContattoMarkerAdd));
                }
            }
            dispatch(new OpacizzaSchedeContattoMarkers());
        }
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
