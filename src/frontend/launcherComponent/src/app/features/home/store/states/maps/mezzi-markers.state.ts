import { MezzoMarker } from '../../../maps/maps-model/mezzo-marker.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MezziMarkerService } from '../../../../../core/service/maps-service';
import {
    AddMezziMarkers,
    ClearMezziMarkers,
    GetMezziMarkers, InsertMezzoMarker,
    OpacizzaMezziMarkers,
    PatchMezziMarkers, RemoveMezzoMarker,
    SetMezziMarkers,
    SetMezzoMarkerById, SetTipoOpacitaMezziMarkers, ToggleOpacitaMezziMarkers, UpdateMezzoMarker
} from '../../actions/maps/mezzi-markers.actions';
import { ClearMarkerOpachiMezzi, SetMarkerOpachiMezzi } from '../../actions/maps/marker-opachi.actions';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';
import { StartLoadingAreaMappa, StopLoadingAreaMappa } from '../../actions/maps/area-mappa.actions';


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
    static mezziMarkersIds(state: MezziMarkersStateModel) {
        return state.mezziMarkersId;
    }

    @Selector()
    static getMezzoById(state: MezziMarkersStateModel) {
        return state.mezzoMarker;
    }

    constructor(private _mezzi: MezziMarkerService) {

    }

    @Action(GetMezziMarkers)
    getMezziMarkers({ dispatch }: StateContext<MezziMarkersStateModel>, action: GetMezziMarkers) {
        dispatch([
            new StartLoadingAreaMappa()
        ]);
        console.log('filtroMezzi', action.filtri);
        this._mezzi.getMezziMarkers(action.areaMappa, action.filtri).subscribe((data: MezzoMarker[]) => {
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
    setMezziMarkers({ getState, dispatch }: StateContext<MezziMarkersStateModel>, action: SetMezziMarkers) {
        const state = getState();
        if (action.mezziMarkers) {
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
            if (state.statoOpacita) {
                dispatch(new OpacizzaMezziMarkers());
            }
        }
    }

    @Action(PatchMezziMarkers)
    patchMezziMarkers({ patchState }: StateContext<MezziMarkersStateModel>, { payload }: PatchMezziMarkers) {
        patchState({
            mezziMarkers: payload.map(item => item),
            mezziMarkersId: payload.map(item => item.mezzo.codice)
        });
    }

    @Action(AddMezziMarkers)
    addMezziMarkers({ setState }: StateContext<MezziMarkersStateModel>, { payload }: AddMezziMarkers) {
        setState(
            patch({
                mezziMarkers: append(payload.map(item => item)),
                mezziMarkersId: append(payload.map(item => item.mezzo.codice))
            })
        );
    }

    @Action(InsertMezzoMarker)
    insertMezzoMarker({ setState }: StateContext<MezziMarkersStateModel>, { payload, before }: InsertMezzoMarker) {
        setState(
            patch({
                mezziMarkers: insertItem(payload, before),
                mezziMarkersId: insertItem(payload.mezzo.codice, before)
            })
        );
    }

    @Action(UpdateMezzoMarker)
    updateMezzoMarker({ setState }: StateContext<MezziMarkersStateModel>, { payload }: UpdateMezzoMarker) {
        setState(
            patch({
                mezziMarkers: updateItem<MezzoMarker>(mezzo => mezzo.mezzo.codice === payload.mezzo.codice, payload)
            })
        );
    }

    @Action(RemoveMezzoMarker)
    removeMezzoMarker({ setState }: StateContext<MezziMarkersStateModel>, { payload }: RemoveMezzoMarker) {
        setState(
            patch({
                mezziMarkers: removeItem<MezzoMarker>(mezzo => mezzo.mezzo.codice === payload),
                mezziMarkersId: removeItem<string>(id => id === payload)
            })
        );
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

    @Action(ToggleOpacitaMezziMarkers)
    toggleOpacitaMezziMarkers({ patchState, dispatch }: StateContext<MezziMarkersStateModel>, action: ToggleOpacitaMezziMarkers) {
        patchState({
            statoOpacita: action.toggle
        });
        if (!action.toggle) {
            patchState({
                tipoOpacita: MezziMarkersStateDefaults.tipoOpacita,
            });
            dispatch(new ClearMarkerOpachiMezzi());
        } else {
            dispatch(new SetTipoOpacitaMezziMarkers(action.stato));
        }
    }

    @Action(SetTipoOpacitaMezziMarkers)
    setTipoOpacitaMezziMarkers({ patchState, dispatch }: StateContext<MezziMarkersStateModel>, action: SetTipoOpacitaMezziMarkers) {
        patchState({
            tipoOpacita: action.stato
        });
        dispatch(new OpacizzaMezziMarkers());
    }

    @Action(OpacizzaMezziMarkers)
    opacizzaMezziMarkers({ getState, dispatch }: StateContext<MezziMarkersStateModel>) {
        const state = getState();
        if (state.statoOpacita && state.tipoOpacita) {
            if (state.mezziMarkers) {
                dispatch(new SetMarkerOpachiMezzi(idMezziFiltrati(state.tipoOpacita, state.mezziMarkers)));
            }
        }
    }

    @Action(ClearMezziMarkers)
    clearMezziMarkers({ patchState }: StateContext<MezziMarkersStateModel>) {
        patchState(MezziMarkersStateDefaults);
    }

}

export function idMezziFiltrati(stati: string[], mezziMarkers: MezzoMarker[]): string[] {
    const filteredId: string[] = [];
    mezziMarkers.forEach(mezzoMarker => {
        stati.forEach(statoMezzo => {
            const _statoMezzo = statoMezzo.split(' ').join('');
            const _mezzoMarker = mezzoMarker.mezzo.stato.toString().split(' ').join('');
            if (_mezzoMarker.substring(0, 5).toLowerCase() === _statoMezzo.substring(0, 5).toLowerCase()) {
                filteredId.push(mezzoMarker.mezzo.codice);
            }
        });
    });
    return filteredId;
}
