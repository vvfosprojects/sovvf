import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { SchedaContattoMarker } from '../../../maps/maps-model/scheda-contatto-marker.model';
import { SchedeContattoMarkerService } from '../../../../../core/service/maps-service/schede-contatto-marker/schede-contatto-marker.service';
import { ClassificazioneSchedaContatto } from '../../../../../shared/enum/classificazione-scheda-contatto.enum';
import { FiltriMarkersState } from './filtri-markers.state';
import { AreaMappaState } from './area-mappa.state';
import { StartLoadingAreaMappa, StopLoadingAreaMappa } from '../../actions/maps/area-mappa.actions';
import {
    AddSchedeContattoMarkers,
    ClearSchedeContattoMarkers,
    GetSchedeContattoMarkers,
    InsertSchedaContattoMarker,
    PatchSchedeContattoMarkers,
    RefreshSchedeContattoMarkers,
    RemoveSchedaContattoMarker,
    SetSchedaContattoMarkerById,
    SetSchedeContattoMarkers,
    UpdateSchedaContattoMarker
} from '../../actions/maps/schede-contatto-markers.actions';
import { Injectable } from '@angular/core';

export interface SchedeContattoMarkersStateModel {
    schedeContattoMarkers: SchedaContattoMarker[];
    schedeContattoMarkersId: string[];
    schedaContattoMarker: SchedaContattoMarker;
    statoOpacita: boolean;
    tipoOpacita: ClassificazioneSchedaContatto;
}

export const SchedeContattoMarkersStateDefaults: SchedeContattoMarkersStateModel = {
    schedeContattoMarkers: [],
    schedeContattoMarkersId: [],
    schedaContattoMarker: null,
    statoOpacita: false,
    tipoOpacita: null
};

@Injectable()
@State<SchedeContattoMarkersStateModel>({
    name: 'schedeContattoMarkers',
    defaults: SchedeContattoMarkersStateDefaults
})
export class SchedeContattoMarkersState {

    @Selector()
    static schedeContattoMarkers(state: SchedeContattoMarkersStateModel): SchedaContattoMarker[] {
        return state.schedeContattoMarkers;
    }

    @Selector()
    static schedeContattoMarkersIds(state: SchedeContattoMarkersStateModel): string[] {
        return state.schedeContattoMarkersId;
    }

    @Selector()
    static getSchedaContattoMarkerById(state: SchedeContattoMarkersStateModel): SchedaContattoMarker {
        return state.schedaContattoMarker;
    }

    constructor(private schedeContattoMarkerService: SchedeContattoMarkerService,
                private store: Store) {
    }

    @Action(GetSchedeContattoMarkers)
    getSchedeContattoMarkers({ dispatch }: StateContext<SchedeContattoMarkersStateModel>, action: GetSchedeContattoMarkers): void {
        dispatch([
            new StartLoadingAreaMappa()
        ]);
        this.schedeContattoMarkerService.getSchedeContattoMarkers(action.areaMappa, action.filtri).subscribe((data: any) => {
                dispatch([
                    new SetSchedeContattoMarkers(data.listaSchedeMarker),
                    new StopLoadingAreaMappa()
                ]);
            }, () => dispatch([
                new StopLoadingAreaMappa()
            ])
        );
    }

    @Action(SetSchedeContattoMarkers)
    setSchedeContattoMarkers({ getState, dispatch }: StateContext<SchedeContattoMarkersStateModel>, action: SetSchedeContattoMarkers): void {
        const state = getState();
        if (action.schedeContatto) {
            if (state.schedeContattoMarkers.length === 0) {
                dispatch(new PatchSchedeContattoMarkers(action.schedeContatto));
            } else {
                const actionSchedeId: string[] = [];
                const schedeRemoveId: string[] = [];
                const schedeAdd: SchedaContattoMarker[] = [];
                /**
                 * marker da aggiungere
                 */
                action.schedeContatto.forEach(scheda => {
                    actionSchedeId.push(scheda.codiceScheda);
                    if (!state.schedeContattoMarkersId.includes(scheda.codiceScheda)) {
                        schedeAdd.push(scheda);
                    }
                });
                /**
                 * marker da rimuovere
                 */
                state.schedeContattoMarkers.forEach(scheda => {
                    if (!actionSchedeId.includes(scheda.codiceScheda)) {
                        schedeRemoveId.push(scheda.codiceScheda);
                    }
                });
                /**
                 * tolgo i marker dallo stato
                 */
                if (schedeRemoveId.length > 0) {
                    schedeRemoveId.forEach(id => {
                        dispatch(new RemoveSchedaContattoMarker(id));
                    });
                }
                /**
                 * aggiungo i marker allo stato
                 */
                if (schedeAdd.length > 0) {
                    dispatch(new AddSchedeContattoMarkers(schedeAdd));
                }
            }
        }
    }

    @Action(PatchSchedeContattoMarkers)
    patchSchedeContattoMarkers({ patchState }: StateContext<SchedeContattoMarkersStateModel>, { payload }: PatchSchedeContattoMarkers): void {
        patchState({
            schedeContattoMarkers: payload.map((scheda: SchedaContattoMarker) => scheda),
            schedeContattoMarkersId: payload.map((scheda: SchedaContattoMarker) => scheda.codiceScheda)
        });
    }

    @Action(AddSchedeContattoMarkers)
    addSchedeContattoMarkers({ setState }: StateContext<SchedeContattoMarkersStateModel>, { payload }: AddSchedeContattoMarkers): void {
        setState(
            patch({
                schedeContattoMarkers: append(payload.map((scheda: SchedaContattoMarker) => scheda)),
                schedeContattoMarkersId: append(payload.map((scheda: SchedaContattoMarker) => scheda.codiceScheda))
            })
        );
    }

    @Action(InsertSchedaContattoMarker)
    insertSchedaContattoMarker({ setState }: StateContext<SchedeContattoMarkersStateModel>, { payload, before }: InsertSchedaContattoMarker): void {
        setState(
            patch({
                schedeContattoMarkers: insertItem(payload, before),
                schedeContattoMarkersId: insertItem(payload.codiceScheda, before)
            })
        );
    }

    @Action(UpdateSchedaContattoMarker)
    updateSchedaContattoMarker({ setState }: StateContext<SchedeContattoMarkersStateModel>, { payload }: UpdateSchedaContattoMarker): void {
        setState(
            patch({
                schedeContattoMarkers: updateItem<SchedaContattoMarker>((scheda: SchedaContattoMarker) => scheda.codiceScheda === payload.codiceScheda, payload)
            })
        );
    }

    @Action(RemoveSchedaContattoMarker)
    removeSchedaContattoMarker({ setState }: StateContext<SchedeContattoMarkersStateModel>, { payload }: RemoveSchedaContattoMarker): void {
        setState(
            patch({
                schedeContattoMarkers: removeItem<SchedaContattoMarker>((scheda: SchedaContattoMarker) => scheda.codiceScheda === payload),
                schedeContattoMarkersId: removeItem<string>(id => id === payload)
            })
        );
    }

    @Action(SetSchedaContattoMarkerById)
    setSchedaContattoMarkerById({ getState, patchState }: StateContext<SchedeContattoMarkersStateModel>, action: SetSchedaContattoMarkerById): void {
        const state = getState();
        if (action.id) {
            patchState({
                schedaContattoMarker: state.schedeContattoMarkers.filter((scheda: SchedaContattoMarker) => scheda.codiceScheda === action.id)[0]
            });
        } else {
            patchState({
                schedaContattoMarker: null
            });
        }
    }

    @Action(ClearSchedeContattoMarkers)
    clearSchedeContattoMarkers({ patchState, dispatch }: StateContext<SchedeContattoMarkersStateModel>): void {
        patchState(SchedeContattoMarkersStateDefaults);
    }

    @Action(RefreshSchedeContattoMarkers)
    refreshSchedeContattoMarkers({ dispatch }: StateContext<SchedeContattoMarkersStateModel>): void {
        const filtroSC = this.store.selectSnapshot(FiltriMarkersState.filtroSC);
        const areaMappa = this.store.selectSnapshot(AreaMappaState.areaMappa);
        dispatch(new GetSchedeContattoMarkers(areaMappa, filtroSC));
    }

}

export function idSCFiltrate(stato: ClassificazioneSchedaContatto, schedeContatto: SchedaContattoMarker[]): string[] {
    const filteredId: string[] = [];
    schedeContatto.forEach(r => {
        if (r.classificazione === stato) {
            filteredId.push(r.codiceScheda);
        }
    });
    return filteredId;
}
