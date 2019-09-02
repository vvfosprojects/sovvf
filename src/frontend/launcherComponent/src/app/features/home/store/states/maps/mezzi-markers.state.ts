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
    SetMezzoMarkerById, UpdateMezzoMarker
} from '../../actions/maps/mezzi-markers.actions';
import { SetMarkerOpachiMezzi } from '../../actions/maps/marker-opachi.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { SetMarkerLoading } from '../../actions/home.actions';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';


export interface MezziMarkersStateModel {
    mezziMarkers: MezzoMarker[];
    mezziMarkersId: string[];
    mezzoMarker: MezzoMarker;
}

export const MezziMarkersStateDefaults: MezziMarkersStateModel = {
    mezziMarkers: [],
    mezziMarkersId: [],
    mezzoMarker: null,
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
    static getMezzoById(state: MezziMarkersStateModel) {
        return state.mezzoMarker;
    }

    constructor(private _mezzi: MezziMarkerService) {

    }

    @Action(GetMezziMarkers)
    getMezziMarkers({ dispatch }: StateContext<MezziMarkersStateModel>, action: GetMezziMarkers) {
        dispatch(new SetMarkerLoading(true));
        this._mezzi.getMezziMarkers(action.areaMappa).subscribe((data: MezzoMarker[]) => {
                dispatch([
                    new SetMezziMarkers(data),
                    new SetMarkerLoading(false)
                ]);
            }, () => dispatch([
                new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5),
                new SetMarkerLoading(false)
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
    insertRichiestaMarker({ setState }: StateContext<MezziMarkersStateModel>, { payload, before }: InsertMezzoMarker) {
        setState(
            patch({
                mezziMarkers: insertItem(payload, before),
                mezziMarkersId: insertItem(payload.mezzo.codice, before)
            })
        );
    }

    @Action(UpdateMezzoMarker)
    updateRichiestaMarker({ setState }: StateContext<MezziMarkersStateModel>, { payload }: UpdateMezzoMarker) {
        setState(
            patch({
                mezziMarkers: updateItem<MezzoMarker>(mezzo => mezzo.mezzo.codice === payload.mezzo.codice, payload)
            })
        );
    }

    @Action(RemoveMezzoMarker)
    removeRichiestaMarker({ setState }: StateContext<MezziMarkersStateModel>, { payload }: RemoveMezzoMarker) {
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

    @Action(OpacizzaMezziMarkers)
    opacizzaMezziMarkers({ getState, dispatch }: StateContext<MezziMarkersStateModel>, action: OpacizzaMezziMarkers) {
        const state = getState();
        const filteredId: string[] = [];
        if (action.stato) {
            if (state.mezziMarkers) {
                state.mezziMarkers.forEach(mezzoMarker => {
                    action.stato.forEach(statoMezzo => {
                        const _statoMezzo = statoMezzo.split(' ').join('');
                        const _mezzoMarker = mezzoMarker.mezzo.stato.split(' ').join('');
                        if (_mezzoMarker.substring(0, 5).toLowerCase() === _statoMezzo.substring(0, 5).toLowerCase()) {
                            filteredId.push(mezzoMarker.mezzo.codice);
                        }
                    });
                });
                dispatch(new SetMarkerOpachiMezzi(filteredId));
            }
        }
    }

    @Action(ClearMezziMarkers)
    clearMezziMarkers({ patchState }: StateContext<MezziMarkersStateModel>) {
        patchState(MezziMarkersStateDefaults);
    }
}
