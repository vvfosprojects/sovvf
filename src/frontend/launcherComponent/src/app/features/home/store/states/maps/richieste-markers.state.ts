import { Action, Select, Selector, State, StateContext } from '@ngxs/store';
import { RichiesteMarkerService } from '../../../../../core/service/maps-service';
import { RichiestaMarker } from '../../../maps/maps-model/richiesta-marker.model';
import {
    AddRichiesteMarkers,
    ClearRichiesteMarkers,
    GetRichiesteMarkers,
    InsertRichiestaMarker,
    OpacizzaRichiesteMarkers, PatchRichiesteMarkers,
    RemoveRichiestaMarker,
    SetRichiestaMarkerById,
    SetRichiesteMarkers,
    UpdateRichiestaMarker
} from '../../actions/maps/richieste-markers.actions';
import { wipeStatoRichiesta } from '../../../../../shared/helper/function';
import { SetMarkerOpachiRichieste } from '../../actions/maps/marker-opachi.actions';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { Observable } from 'rxjs';
import { HomeState } from '../home.state';
import { ToggleAnimation } from '../../actions/maps/maps-buttons.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { RichiesteMarkerAdapterService } from '../../../../../core/service/maps-service/richieste-marker/adapters/richieste-marker-adapter.service';
import { ToastrType } from '../../../../../shared/enum/toastr';

export interface RichiesteMarkersStateModel {
    richiesteMarkers: RichiestaMarker[];
    richiestaMarkerById: RichiestaMarker;
}

export const RichiesteMarkersStateDefaults: RichiesteMarkersStateModel = {
    richiesteMarkers: null,
    richiestaMarkerById: null
};

@State<RichiesteMarkersStateModel>({
    name: 'richiesteMarkers',
    defaults: RichiesteMarkersStateDefaults
})

export class RichiesteMarkersState {

    @Select(HomeState.mapIsLoaded) mapIsLoaded$: Observable<boolean>;

    @Selector()
    static richiesteMarkers(state: RichiesteMarkersStateModel) {
        return state.richiesteMarkers;
    }

    @Selector()
    static richiesteLenghtMarkers(state: RichiesteMarkersStateModel) {
        return state.richiesteMarkers.length;
    }

    @Selector()
    static getRichiestaById(state: RichiesteMarkersStateModel) {
        return state.richiestaMarkerById;
    }

    constructor(private _richieste: RichiesteMarkerService) {
    }

    @Action(GetRichiesteMarkers)
    getRichiesteMarkers({ dispatch }: StateContext<RichiesteMarkersStateModel>, action: GetRichiesteMarkers) {
        this._richieste.getRichiesteMarkers(action.areaMappa).subscribe((data: RichiestaMarker[]) => {
            dispatch(new SetRichiesteMarkers(data));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(SetRichiesteMarkers)
    setRichiesteMarkers({ dispatch }: StateContext<RichiesteMarkersStateModel>, action: SetRichiesteMarkers) {
        if (action.richiesteMarkers) {
            dispatch(new PatchRichiesteMarkers(action.richiesteMarkers));
            this.mapIsLoaded$.subscribe(isLoaded => {
                if (isLoaded) {
                    dispatch(new ToggleAnimation());
                }
            });
        }
    }

    @Action(PatchRichiesteMarkers)
    patchRichiesteMarkers({ patchState }: StateContext<RichiesteMarkersStateModel>, { payload }: PatchRichiesteMarkers) {
        patchState({
            richiesteMarkers: payload.map(item => RichiesteMarkerAdapterService.adapt(item))
        });
    }

    @Action(AddRichiesteMarkers)
    addRichiesteMarkers({ setState }: StateContext<RichiesteMarkersStateModel>, { payload }: AddRichiesteMarkers) {
        setState(
            patch({
                richiesteMarkers: append(payload.map(item => RichiesteMarkerAdapterService.adapt(item)))
            })
        );
    }

    @Action(InsertRichiestaMarker)
    insertRichiestaMarker({ setState }: StateContext<RichiesteMarkersStateModel>, { payload, before }: InsertRichiestaMarker) {
        setState(
            patch({
                richiesteMarkers: insertItem(RichiesteMarkerAdapterService.adapt(payload), before)
            })
        );
    }

    @Action(UpdateRichiestaMarker)
    updateRichiestaMarker({ setState }: StateContext<RichiesteMarkersStateModel>, { payload }: UpdateRichiestaMarker) {
        setState(
            patch({
                richiesteMarkers: updateItem<RichiestaMarker>(richiesta => richiesta.id === payload.id, RichiesteMarkerAdapterService.adapt(payload))
            })
        );
    }

    @Action(RemoveRichiestaMarker)
    removeRichiestaMarker({ setState }: StateContext<RichiesteMarkersStateModel>, { payload }: RemoveRichiestaMarker) {
        setState(
            patch({
                richiesteMarkers: removeItem<RichiestaMarker>(richiesta => richiesta.id === payload)
            })
        );
    }

    @Action(SetRichiestaMarkerById)
    setRichiestaMarkerById({ getState, patchState }: StateContext<RichiesteMarkersStateModel>, action: SetRichiestaMarkerById) {
        const state = getState();
        if (action.id) {
            patchState({
                richiestaMarkerById: state.richiesteMarkers.filter(richieste => richieste.id === action.id)[0]
            });
        } else {
            patchState({
                richiestaMarkerById: null
            });
        }
    }

    @Action(OpacizzaRichiesteMarkers)
    opacizzaRichiesteMarkers({ getState, dispatch }: StateContext<RichiesteMarkersStateModel>, action: OpacizzaRichiesteMarkers) {
        const state = getState();
        const filteredId: string[] = [];
        if (action.stato) {
            if (state.richiesteMarkers) {
                state.richiesteMarkers.forEach(r => {
                    action.stato.forEach(c => {
                        if (wipeStatoRichiesta(r.stato).substring(0, 5).toLowerCase() === c.substring(0, 5).toLowerCase()) {
                            filteredId.push(r.id);
                        }
                    });
                });
            }
            if (filteredId.length > 0) {
                dispatch(new SetMarkerOpachiRichieste(filteredId));
            }
        }
    }

    @Action(ClearRichiesteMarkers)
    clearRichiesteMarkers({ patchState }: StateContext<RichiesteMarkersStateModel>) {
        patchState(RichiesteMarkersStateDefaults);
    }

}
