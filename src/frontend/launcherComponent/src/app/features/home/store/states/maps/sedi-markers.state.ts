import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SedeMarker } from '../../../maps/maps-model/sede-marker.model';
import { SediMarkerService } from '../../../../../core/service/maps-service';
import {
    AddSediMarkers,
    ClearSediMarkers,
    GetSediMarkers,
    InsertSedeMarker,
    PatchSediMarkers,
    RemoveSedeMarker,
    SetSedeMarkerById,
    SetSediMarkers,
    UpdateSedeMarker
} from '../../actions/maps/sedi-markers.actions';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { StartLoadingAreaMappa, StopLoadingAreaMappa } from '../../actions/maps/area-mappa.actions';

export interface SediMarkersStateModel {
    sediMarkers: SedeMarker[];
    sediMarkersId: string[];
    sedeMarkerById: SedeMarker;
}

export const SediMarkersStateDefaults: SediMarkersStateModel = {
    sediMarkers: [],
    sediMarkersId: [],
    sedeMarkerById: null
};

@State<SediMarkersStateModel>({
    name: 'sediMarkers',
    defaults: SediMarkersStateDefaults
})

export class SediMarkersState {

    @Selector()
    static sediMarkers(state: SediMarkersStateModel) {
        return state.sediMarkers;
    }

    @Selector()
    static getSedeById(state: SediMarkersStateModel) {
        return state.sedeMarkerById;
    }

    constructor(private _sedi: SediMarkerService) {

    }

    @Action(GetSediMarkers)
    getSediMarkers({ dispatch }: StateContext<SediMarkersStateModel>, action: GetSediMarkers) {
        dispatch([
            new StartLoadingAreaMappa()
        ]);
        this._sedi.getSediMarkers(action.areaMappa).subscribe((data: SedeMarker[]) => {
                dispatch([
                    new SetSediMarkers(data),
                    new StopLoadingAreaMappa()
                ]);
            }, () => dispatch([
                new StopLoadingAreaMappa()
            ])
        );
    }

    @Action(SetSediMarkers)
    setSediMarkers({ getState, dispatch }: StateContext<SediMarkersStateModel>, action: SetSediMarkers) {
        const state = getState();
        if (action.sediMarkers) {
            if (state.sediMarkers.length === 0) {
                dispatch(new PatchSediMarkers(action.sediMarkers));
            } else {
                const actionSediId: string[] = [];
                const mezzoSedeRemoveId: string[] = [];
                const mezzoSedeAdd: SedeMarker[] = [];
                /**
                 * marker da aggiungere
                 */
                action.sediMarkers.forEach(sede => {
                    actionSediId.push(sede.codice);
                    if (!state.sediMarkersId.includes(sede.codice)) {
                        mezzoSedeAdd.push(sede);
                    }
                });
                /**
                 * marker da rimuovere
                 */
                state.sediMarkers.forEach(sede => {
                    if (!actionSediId.includes(sede.codice)) {
                        mezzoSedeRemoveId.push(sede.codice);
                    }
                });
                /**
                 * tolgo i marker dallo stato
                 */
                if (mezzoSedeRemoveId.length > 0) {
                    mezzoSedeRemoveId.forEach(id => {
                        dispatch(new RemoveSedeMarker(id));
                    });
                }
                /**
                 * aggiungo i marker allo stato
                 */
                if (mezzoSedeAdd.length > 0) {
                    dispatch(new AddSediMarkers(mezzoSedeAdd));
                }
            }
        }
    }

    @Action(PatchSediMarkers)
    patchSediMarkers({ patchState }: StateContext<SediMarkersStateModel>, { payload }: PatchSediMarkers) {
        patchState({
            sediMarkers: payload.map(item => item),
            sediMarkersId: payload.map(item => item.codice)
        });
    }

    @Action(AddSediMarkers)
    addSediMarkers({ setState }: StateContext<SediMarkersStateModel>, { payload }: AddSediMarkers) {
        setState(
            patch({
                sediMarkers: append(payload.map(item => item)),
                sediMarkersId: append(payload.map(item => item.codice))
            })
        );
    }

    @Action(InsertSedeMarker)
    insertRichiestaMarker({ setState }: StateContext<SediMarkersStateModel>, { payload, before }: InsertSedeMarker) {
        setState(
            patch({
                sediMarkers: insertItem(payload, before),
                sediMarkersId: insertItem(payload.codice, before)
            })
        );
    }

    @Action(UpdateSedeMarker)
    updateRichiestaMarker({ setState }: StateContext<SediMarkersStateModel>, { payload }: UpdateSedeMarker) {
        setState(
            patch({
                sediMarkers: updateItem<SedeMarker>(mezzo => mezzo.codice === payload.codice, payload)
            })
        );
    }

    @Action(RemoveSedeMarker)
    removeRichiestaMarker({ setState }: StateContext<SediMarkersStateModel>, { payload }: RemoveSedeMarker) {
        setState(
            patch({
                sediMarkers: removeItem<SedeMarker>(mezzo => mezzo.codice === payload),
                sediMarkersId: removeItem<string>(id => id === payload)
            })
        );
    }

    @Action(SetSedeMarkerById)
    setSedeMarkerById({ getState, patchState }: StateContext<SediMarkersStateModel>, action: SetSedeMarkerById) {
        const state = getState();
        if (action.id) {
            patchState({
                sedeMarkerById: state.sediMarkers.filter(sedi => sedi.codice === action.id)[0]
            });
        } else {
            patchState({
                sedeMarkerById: null
            });
        }
    }

    @Action(ClearSediMarkers)
    clearSediMarkers({ patchState }: StateContext<SediMarkersStateModel>) {
        patchState(SediMarkersStateDefaults);
    }
}
