import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { ChiamataMarker } from '../../../maps/maps-model/chiamata-marker.model';
import {
    AddChiamateMarkers, ClearChiamateMarkers,
    GetChiamateMarkers,
    InsertChiamataMarker,
    RemoveChiamataMarker,
    SetChiamataMarkerById,
    SetChiamateMarkers,
    UpdateChiamataMarker
} from '../../actions/maps/chiamate-markers.actions';
import { ChiamateMarkerService } from '../../../../../core/service/maps-service';

export interface ChiamateMarkersStateModel {
    chiamateMarkers: ChiamataMarker[];
    chiamataMarkerById: ChiamataMarker;
}

export const ChiamateMarkersStateDefaults: ChiamateMarkersStateModel = {
    chiamateMarkers: null,
    chiamataMarkerById: null
};

@State<ChiamateMarkersStateModel>({
    name: 'chiamateMarkers',
    defaults: ChiamateMarkersStateDefaults
})

export class ChiamateMarkersState {

    @Selector()
    static chiamateMarkers(state: ChiamateMarkersStateModel) {
        return state.chiamateMarkers;
    }

    @Selector()
    static getChiamataById(state: ChiamateMarkersStateModel) {
        return state.chiamataMarkerById;
    }

    constructor(private _chiamate: ChiamateMarkerService) {
    }

    @Action(GetChiamateMarkers)
    getChiamateMarkers({ dispatch }: StateContext<ChiamateMarkersStateModel>) {
        this._chiamate.getChiamateMarkers().subscribe((result: ChiamataMarker[]) => {
            dispatch(new SetChiamateMarkers(result));
        });
    }

    @Action(SetChiamateMarkers)
    setChiamateMarkers({ dispatch }: StateContext<ChiamateMarkersStateModel>, action: SetChiamateMarkers) {
        dispatch(new AddChiamateMarkers(action.chiamateMarkers));
    }

    @Action(AddChiamateMarkers)
    addChiamateMarkers({ setState }: StateContext<ChiamateMarkersStateModel>, { payload }: AddChiamateMarkers) {
        setState(
            patch({
                chiamateMarkers: append(payload)
            })
        );
    }

    @Action(InsertChiamataMarker)
    insertChiamataMarker({ setState }: StateContext<ChiamateMarkersStateModel>, { payload, mySelf }: InsertChiamataMarker) {
        let chiamataMarker: ChiamataMarker;
        chiamataMarker = payload;
        if (mySelf) {
            chiamataMarker.mySelf = true;
        }
        setState(
            patch({
                chiamateMarkers: insertItem(chiamataMarker)
            })
        );
    }

    @Action(UpdateChiamataMarker)
    updateChiamataMarker({ setState }: StateContext<ChiamateMarkersStateModel>, { payload }: UpdateChiamataMarker) {
        setState(
            patch({
                chiamateMarkers: updateItem<ChiamataMarker>(chiamata => chiamata.id === payload.id, payload)
            })
        );
    }

    @Action(RemoveChiamataMarker)
    removeChiamataMarker({ setState }: StateContext<ChiamateMarkersStateModel>, { payload }: RemoveChiamataMarker) {
        setState(
            patch({
                chiamateMarkers: removeItem<ChiamataMarker>(chiamata => chiamata.id === payload)
            })
        );
    }

    @Action(SetChiamataMarkerById)
    setChiamataMarkerById({ getState, patchState }: StateContext<ChiamateMarkersStateModel>, action: SetChiamataMarkerById) {
        const state = getState();
        if (action.id) {
            patchState({
                chiamataMarkerById: state.chiamateMarkers.filter(chiamate => chiamate.id === action.id)[0]
            });
        } else {
            patchState({
                chiamataMarkerById: null
            });
        }
    }

    @Action(ClearChiamateMarkers)
    clearChiamateMarkers({ patchState }: StateContext<ChiamateMarkersStateModel>) {
        patchState(ChiamateMarkersStateDefaults);
    }

}
