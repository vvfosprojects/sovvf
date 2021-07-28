import { MezzoMarker } from '../../../maps/maps-model/mezzo-marker.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MezziMarkerService } from '../../../../../core/service/maps-service';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';
import { StartLoadingAreaMappa, StopLoadingAreaMappa } from '../../actions/maps/area-mappa.actions';
import {
    AddMezziMarkers,
    ClearMezziMarkers,
    GetMezziMarkers,
    InsertMezzoMarker,
    PatchMezziMarkers,
    RemoveMezzoMarker,
    SetMezziMarkers,
    SetMezzoMarkerById,
    UpdateMezzoMarker
} from '../../actions/maps/mezzi-markers.actions';
import { Injectable } from '@angular/core';


export interface MezziMarkersStateModel {
    mezziMarkers: MezzoMarker[];
    mezziMarkersId: string[];
    mezzoMarker: MezzoMarker;
    statoOpacita: boolean;
    tipoOpacita: string[];
}

export const MezziMarkersStateDefaults: MezziMarkersStateModel = {
    mezziMarkers: [],
    mezziMarkersId: [],
    mezzoMarker: null,
    statoOpacita: false,
    tipoOpacita: null
};

@Injectable()
@State<MezziMarkersStateModel>({
    name: 'mezziMarkers',
    defaults: MezziMarkersStateDefaults
})

export class MezziMarkersState {

    @Selector()
    static mezziMarkers(state: MezziMarkersStateModel): MezzoMarker[] {
        return state.mezziMarkers;
    }

    @Selector()
    static mezziMarkersIds(state: MezziMarkersStateModel): string[] {
        return state.mezziMarkersId;
    }

    @Selector()
    static getMezzoById(state: MezziMarkersStateModel): MezzoMarker {
        return state.mezzoMarker;
    }

    constructor(private mezziMarker: MezziMarkerService) {

    }

    @Action(GetMezziMarkers)
    getMezziMarkers({ dispatch }: StateContext<MezziMarkersStateModel>, action: GetMezziMarkers): void {
        dispatch([
            new StartLoadingAreaMappa()
        ]);
        console.log('filtroMezzi', action.filtri);
        this.mezziMarker.getMezziMarkers(action.areaMappa, action.filtri).subscribe((data: MezzoMarker[]) => {
                data.map((mezzo: MezzoMarker) => {
                    if (mezzo.mezzo.stato === StatoMezzo.OperativoPreaccoppiato) {
                        mezzo.mezzo.stato = StatoMezzo.InSede;
                    }
                });
                dispatch([
                    new SetMezziMarkers(data),
                    new StopLoadingAreaMappa()
                ]);
            }, () => dispatch([
                new StopLoadingAreaMappa()
            ])
        );
    }

    @Action(SetMezziMarkers)
    setMezziMarkers({ getState, dispatch }: StateContext<MezziMarkersStateModel>, action: SetMezziMarkers): void {
        const state = getState();
        if (action.mezziMarkers && state.mezziMarkers) {
            if (state.mezziMarkers.length === 0) {
                dispatch(new PatchMezziMarkers(action.mezziMarkers));
            } else {
                const actionMezziId: string[] = [];
                const mezzoMarkerRemoveId: string[] = [];
                const mezzoMarkerAdd: MezzoMarker[] = [];
                /**
                 * marker da aggiungere
                 */
                action.mezziMarkers.forEach(mezzo => {
                    actionMezziId.push(mezzo.mezzo.codice);
                    if (!state.mezziMarkersId.includes(mezzo.mezzo.codice)) {
                        mezzoMarkerAdd.push(mezzo);
                    }
                });
                /**
                 * marker da rimuovere
                 */
                state.mezziMarkers.forEach(mezzo => {
                    if (!actionMezziId.includes(mezzo.mezzo.codice)) {
                        mezzoMarkerRemoveId.push(mezzo.mezzo.codice);
                    }
                });
                /**
                 * tolgo i marker dallo stato
                 */
                if (mezzoMarkerRemoveId.length > 0) {
                    mezzoMarkerRemoveId.forEach(id => {
                        dispatch(new RemoveMezzoMarker(id));
                    });
                }
                /**
                 * aggiungo i marker allo stato
                 */
                if (mezzoMarkerAdd.length > 0) {
                    dispatch(new AddMezziMarkers(mezzoMarkerAdd));
                }
            }
        }
    }

    @Action(PatchMezziMarkers)
    patchMezziMarkers({ patchState }: StateContext<MezziMarkersStateModel>, { payload }: PatchMezziMarkers): void {
        patchState({
            mezziMarkers: payload.map(item => item),
            mezziMarkersId: payload.map(item => item.mezzo.codice)
        });
    }

    @Action(AddMezziMarkers)
    addMezziMarkers({ setState }: StateContext<MezziMarkersStateModel>, { payload }: AddMezziMarkers): void {
        setState(
            patch({
                mezziMarkers: append(payload.map(item => item)),
                mezziMarkersId: append(payload.map(item => item.mezzo.codice))
            })
        );
    }

    @Action(InsertMezzoMarker)
    insertMezzoMarker({ setState }: StateContext<MezziMarkersStateModel>, { payload, before }: InsertMezzoMarker): void {
        setState(
            patch({
                mezziMarkers: insertItem(payload, before),
                mezziMarkersId: insertItem(payload.mezzo.codice, before)
            })
        );
    }

    @Action(UpdateMezzoMarker)
    updateMezzoMarker({ setState }: StateContext<MezziMarkersStateModel>, { payload }: UpdateMezzoMarker): void {
        setState(
            patch({
                mezziMarkers: payload ? updateItem<MezzoMarker>(mezzo => mezzo.mezzo.codice === payload.mezzo.codice, payload) : null,
            })
        );
    }

    @Action(RemoveMezzoMarker)
    removeMezzoMarker({ setState }: StateContext<MezziMarkersStateModel>, { payload }: RemoveMezzoMarker): void {
        setState(
            patch({
                mezziMarkers: removeItem<MezzoMarker>(mezzo => mezzo.mezzo.codice === payload),
                mezziMarkersId: removeItem<string>(id => id === payload)
            })
        );
    }

    @Action(SetMezzoMarkerById)
    setMezzoMarkerById({ getState, patchState }: StateContext<MezziMarkersStateModel>, action: SetMezzoMarkerById): void {
        const state = getState();
        if (action.id && state.mezziMarkers) {
            patchState({
                mezzoMarker: state.mezziMarkers.filter(mezzi => mezzi.mezzo.codice === action.id)[0]
            });
        } else {
            patchState({
                mezzoMarker: null
            });
        }
    }

    @Action(ClearMezziMarkers)
    clearMezziMarkers({ patchState }: StateContext<MezziMarkersStateModel>): void {
        patchState(MezziMarkersStateDefaults);
    }

}

export function idMezziFiltrati(stati: string[], mezziMarkers: MezzoMarker[]): string[] {
    const filteredId: string[] = [];
    mezziMarkers.forEach(marker => {
        stati.forEach(stato => {
            const statoMezzo = stato.split(' ').join('');
            const mezzoMarker = marker.mezzo.stato.toString().split(' ').join('');
            if (mezzoMarker.substring(0, 5).toLowerCase() === statoMezzo.substring(0, 5).toLowerCase()) {
                filteredId.push(marker.mezzo.codice);
            }
        });
    });
    return filteredId;
}
