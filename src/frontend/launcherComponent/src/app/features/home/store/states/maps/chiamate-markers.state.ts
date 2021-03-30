import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { ChiamataMarker } from '../../../maps/maps-model/chiamata-marker.model';
import { ChiamateMarkerService } from '../../../../../core/service/maps-service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { SchedaTelefonataState } from '../form-richiesta/scheda-telefonata.state';
import { ClearIndirizzo } from '../../actions/form-richiesta/scheda-telefonata.actions';
import { GetInitCentroMappa } from '../../actions/maps/centro-mappa.actions';
import {
    ClearChiamateMarkers,
    DelChiamataMarker,
    GetChiamateMarkers,
    InsertChiamataMarker,
    SetChiamateMarkers,
    RemoveChiamataMarker,
    SetChiamataMarker,
    UpdateChiamataMarker,
    UpdateItemChiamataMarker
} from '../../actions/maps/chiamate-markers.actions';
import { Injectable } from '@angular/core';

export interface ChiamateMarkersStateModel {
    chiamateMarkers: ChiamataMarker[];
}

export const ChiamateMarkersStateDefaults: ChiamateMarkersStateModel = {
    chiamateMarkers: null,
};

@Injectable()
@State<ChiamateMarkersStateModel>({
    name: 'chiamateMarkers',
    defaults: ChiamateMarkersStateDefaults
})

export class ChiamateMarkersState {

    @Selector()
    static chiamateMarkers(state: ChiamateMarkersStateModel): ChiamataMarker[] {
        return state.chiamateMarkers;
    }

    constructor(private chiamateMarkerService: ChiamateMarkerService,
                private store: Store) {
    }

    @Action(GetChiamateMarkers)
    getChiamateMarkers({ dispatch }: StateContext<ChiamateMarkersStateModel>): void {
        this.chiamateMarkerService.getChiamateMarkers().subscribe((data: ChiamataMarker[]) => {
            dispatch(new SetChiamateMarkers(data));
        }, error => {
            console.error(error);
            dispatch(new ShowToastr(ToastrType.Error, 'Reperimento delle chiamate fallito', 'Si è verificato un errore, riprova.', 5));
        });
    }

    @Action(SetChiamataMarker)
    setChiamataMarker({ dispatch }: StateContext<ChiamateMarkersStateModel>, action: SetChiamataMarker): void {
        this.chiamateMarkerService.setChiamataInCorso(action.chiamataMarker).subscribe(() => {
        }, error => {
            dispatch(new ClearIndirizzo());
            dispatch(new GetInitCentroMappa());
        });
    }

    @Action(UpdateChiamataMarker)
    updateChiamataMarker({ dispatch }: StateContext<ChiamateMarkersStateModel>, action: UpdateChiamataMarker): void {
        this.chiamateMarkerService.updateChiamataInCorso(action.chiamataMarker).subscribe(() => {
        }, error => {
            dispatch(new ClearIndirizzo());
            dispatch(new GetInitCentroMappa());
        });
    }

    @Action(DelChiamataMarker)
    delChiamataMarker({ getState, dispatch }: StateContext<ChiamateMarkersStateModel>, action: DelChiamataMarker): void {
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

    @Action(SetChiamateMarkers)
    insertChiamateMarkers({ setState }: StateContext<ChiamateMarkersStateModel>, { chiamateMarkers }: SetChiamateMarkers): void {
        setState(
            patch({
                chiamateMarkers: append(chiamateMarkers)
            })
        );
    }

    @Action(InsertChiamataMarker)
    insertChiamataMarker({ setState, dispatch }: StateContext<ChiamateMarkersStateModel>, { chiamataMarker }: InsertChiamataMarker): void {
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
    updateItemChiamataMarker({ setState, dispatch }: StateContext<ChiamateMarkersStateModel>, { chiamataMarker }: UpdateItemChiamataMarker): void {
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
    removeChiamataMarker({ getState, setState }: StateContext<ChiamateMarkersStateModel>, { id }: RemoveChiamataMarker): void {
        console.log(id);
        const state = getState();
        const chiamateMarkers = state.chiamateMarkers;
        if (chiamateMarkers) {
            setState(
                patch({
                    chiamateMarkers: removeItem<ChiamataMarker>(chiamata => chiamata.id === id)
                })
            );
        }
    }

    @Action(ClearChiamateMarkers)
    clearChiamateMarkers({ patchState }: StateContext<ChiamateMarkersStateModel>): void {
        patchState(ChiamateMarkersStateDefaults);
    }

}
