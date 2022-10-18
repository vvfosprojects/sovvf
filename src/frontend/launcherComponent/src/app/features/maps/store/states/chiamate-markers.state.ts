import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { ChiamataMarker } from '../../maps-model/chiamata-marker.model';
import { ChiamateMarkerService } from '../../../../core/service/maps-service';
import { SchedaTelefonataState } from '../../../home/store/states/form-richiesta/scheda-telefonata.state';
import { ClearIndirizzo } from '../../../home/store/actions/form-richiesta/scheda-telefonata.actions';
import { GetInitCentroMappa } from '../actions/centro-mappa.actions';
import {
    ClearChiamateMarkers,
    DelChiamataMarker,
    GetChiamateMarkers,
    InsertChiamataMarker,
    SetChiamateMarkers,
    RemoveChiamataMarker,
    SetChiamataMarker,
    UpdateChiamataMarker,
    UpdateItemChiamataMarker,
    StartLoadingChiamateMarkers,
    StopLoadingChiamateMarkers
} from '../actions/chiamate-markers.actions';
import { Injectable } from '@angular/core';

export interface ChiamateMarkersStateModel {
    chiamateMarkers: ChiamataMarker[];
    loading: boolean;
}

export const ChiamateMarkersStateDefaults: ChiamateMarkersStateModel = {
    chiamateMarkers: null,
    loading: null
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

    @Selector()
    static loading(state: ChiamateMarkersStateModel): boolean {
        return state.loading;
    }

    constructor(private chiamateMarkerService: ChiamateMarkerService,
                private store: Store) {
    }

    @Action(GetChiamateMarkers)
    getChiamateMarkers({ dispatch }: StateContext<ChiamateMarkersStateModel>): void {
        dispatch(new StartLoadingChiamateMarkers());
        this.chiamateMarkerService.getChiamateMarkers().subscribe((data: ChiamataMarker[]) => {
            dispatch([
                new SetChiamateMarkers(data),
                new StopLoadingChiamateMarkers()
            ]);
        }, error => {
            console.error(error);
            dispatch(new StopLoadingChiamateMarkers());
        });
    }

    @Action(SetChiamataMarker)
    setChiamataMarker({ dispatch }: StateContext<ChiamateMarkersStateModel>, action: SetChiamataMarker): void {
        dispatch(new StartLoadingChiamateMarkers());
        this.chiamateMarkerService.setChiamataInCorso(action.chiamataMarker, action.codCompetenze).subscribe(() => {
            dispatch(new StopLoadingChiamateMarkers());
        }, () => {
            dispatch([
                new StopLoadingChiamateMarkers(),
                new ClearIndirizzo(),
                new GetInitCentroMappa()
            ]);
        });
    }

    @Action(UpdateChiamataMarker)
    updateChiamataMarker({ dispatch }: StateContext<ChiamateMarkersStateModel>, action: UpdateChiamataMarker): void {
        dispatch(new StartLoadingChiamateMarkers());
        this.chiamateMarkerService.updateChiamataInCorso(action.chiamataMarker, action.codCompetenze).subscribe(() => {
            dispatch(new StopLoadingChiamateMarkers());
        }, () => {
            dispatch([
                new StopLoadingChiamateMarkers(),
                new ClearIndirizzo(),
                new GetInitCentroMappa()
            ]);
        });
    }

    @Action(DelChiamataMarker)
    delChiamataMarker({ getState, dispatch }: StateContext<ChiamateMarkersStateModel>, action: DelChiamataMarker): void {
        const state = getState();
        if (state.chiamateMarkers) {
            const marker = state.chiamateMarkers.find(chiamataMarker => chiamataMarker.id === action.id);
            if (marker) {
                dispatch(new StartLoadingChiamateMarkers());
                this.chiamateMarkerService.deleteChiamataInCorso(marker).subscribe(() => {
                    dispatch(new StopLoadingChiamateMarkers());
                }, error => {
                    console.error(error);
                    dispatch(new StopLoadingChiamateMarkers());
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

    @Action(StartLoadingChiamateMarkers)
    startLoadingChiamateMarkers({ patchState }: StateContext<ChiamateMarkersStateModel>): void {
        patchState({
            loading: true
        });
    }

    @Action(StopLoadingChiamateMarkers)
    stopLoadingChiamateMarkers({ patchState }: StateContext<ChiamateMarkersStateModel>): void {
        patchState({
            loading: false
        });
    }

    @Action(ClearChiamateMarkers)
    clearChiamateMarkers({ patchState }: StateContext<ChiamateMarkersStateModel>): void {
        patchState(ChiamateMarkersStateDefaults);
    }

}
