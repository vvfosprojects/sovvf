import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { ChiamataMarker } from '../../../maps/maps-model/chiamata-marker.model';
import {
    ClearChiamateMarkers,
    DelChiamataMarker,
    GetChiamateMarkers,
    InsertChiamataMarker,
    InsertChiamateMarkers,
    RemoveChiamataMarker,
    SetChiamataMarker,
    UpdateChiamataMarker,
    UpdateItemChiamataMarker
} from '../../actions/maps/chiamate-markers.actions';
import { ChiamateMarkerService } from '../../../../../core/service/maps-service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { SchedaTelefonataState } from '../chiamata/scheda-telefonata.state';

export interface ChiamateMarkersStateModel {
    chiamateMarkers: ChiamataMarker[];
}

export const ChiamateMarkersStateDefaults: ChiamateMarkersStateModel = {
    chiamateMarkers: null,
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

    constructor(private chiamateMarkerService: ChiamateMarkerService, private store: Store) {
    }

    @Action(GetChiamateMarkers)
    getChiamateMarkers({ dispatch }: StateContext<ChiamateMarkersStateModel>) {
        this.chiamateMarkerService.getChiamateMarkers().subscribe((data: ChiamataMarker[]) => {
            dispatch(new InsertChiamateMarkers(data));
        }, error => {
            console.error(error);
            dispatch(new ShowToastr(ToastrType.Error, 'Reperimento delle chiamate fallito', 'Si è verificato un errore, riprova.', 5));
        });
    }

    @Action(SetChiamataMarker)
    setChiamataMarker({ dispatch }: StateContext<ChiamateMarkersStateModel>, action: SetChiamataMarker) {
        this.chiamateMarkerService.setChiamataInCorso(action.chiamataMarker).subscribe(() => {
        }, error => {
            console.error(error);
            dispatch(new ShowToastr(ToastrType.Error, 'Inserimento della chiamata in corso fallito', 'Si è verificato un errore, riprova.', 5));
        });
    }

    @Action(UpdateChiamataMarker)
    updateChiamataMarker({ dispatch }: StateContext<ChiamateMarkersStateModel>, action: UpdateChiamataMarker) {
        this.chiamateMarkerService.updateChiamataInCorso(action.chiamataMarker).subscribe(() => {
        }, error => {
            console.error(error);
            dispatch(new ShowToastr(ToastrType.Error, 'Inserimento della chiamata in corso fallito', 'Si è verificato un errore, riprova.', 5));
        });
    }

    @Action(DelChiamataMarker)
    delChiamataMarker({ getState, dispatch }: StateContext<ChiamateMarkersStateModel>, action: DelChiamataMarker) {
        const state = getState();

        if (state.chiamateMarkers) {
            const marker = state.chiamateMarkers.find(chiamataMarker => chiamataMarker.id === action.id);
            if (marker) {
                this.chiamateMarkerService.deleteChiamataInCorso(marker).subscribe(() => {
                }, error => {
                    console.error(error);
                    dispatch(new ShowToastr(ToastrType.Error, 'Cancellazione della chiamata in corso fallito', 'Si è verificato un errore, riprova.', 5));
                });
            }
        }
    }

    @Action(InsertChiamateMarkers)
    insertChiamateMarkers({ setState }: StateContext<ChiamateMarkersStateModel>, { chiamateMarkers }: InsertChiamateMarkers) {
        setState(
            patch({
                chiamateMarkers: append(chiamateMarkers)
            })
        );
    }

    @Action(InsertChiamataMarker)
    insertChiamataMarker({ setState, dispatch }: StateContext<ChiamateMarkersStateModel>, { chiamataMarker }: InsertChiamataMarker) {
        const mySelf = this.store.selectSnapshot(SchedaTelefonataState.myChiamataMarker);
        if (mySelf) {
            chiamataMarker.mySelf = mySelf === chiamataMarker.id;
        }
        setState(
            patch({
                chiamateMarkers: insertItem(chiamataMarker)
            })
        );
    }

    @Action(UpdateItemChiamataMarker)
    updateItemChiamataMarker({ setState, dispatch }: StateContext<ChiamateMarkersStateModel>, { chiamataMarker }: UpdateItemChiamataMarker) {
        const mySelf = this.store.selectSnapshot(SchedaTelefonataState.myChiamataMarker);
        if (mySelf) {
            chiamataMarker.mySelf = mySelf === chiamataMarker.id;
        }
        setState(
            patch({
                chiamateMarkers: updateItem<ChiamataMarker>(chiamata => chiamata.id === chiamataMarker.id, chiamataMarker)
            })
        );
    }

    @Action(RemoveChiamataMarker)
    removeChiamataMarker({ setState }: StateContext<ChiamateMarkersStateModel>, { id }: RemoveChiamataMarker) {
        console.log(id);

        setState(
            patch({
                chiamateMarkers: removeItem<ChiamataMarker>(chiamata => chiamata.id === id)
            })
        );
    }

    @Action(ClearChiamateMarkers)
    clearChiamateMarkers({ patchState }: StateContext<ChiamateMarkersStateModel>) {
        patchState(ChiamateMarkersStateDefaults);
    }

}
