import { Action, Select, Selector, State, StateContext } from '@ngxs/store';
import { RichiesteMarkerService } from '../../../../../core/service/maps-service';
import { RichiestaMarker } from '../../../maps/maps-model/richiesta-marker.model';
import {
    AddRichiesteMarkers,
    ClearRichiesteMarkers,
    GetRichiesteMarkers, InsertRichiestaMarker,
    OpacizzaRichiesteMarkers, RemoveRichiestaMarker,
    SetRichiestaMarkerById,
    SetRichiesteMarkers, UpdateRichiestaMarker
} from '../../actions/maps/richieste-markers.actions';
import { wipeStatoRichiesta } from '../../../../../shared/helper/function';
import { SetMarkerOpachiRichieste } from '../../actions/maps/marker-opachi.actions';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { Observable } from 'rxjs';
import { HomeState } from '../home.state';

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
    getRichiesteMarkers({ dispatch }: StateContext<RichiesteMarkersStateModel>) {
        this._richieste.getRichiesteMarkers().subscribe((result: RichiestaMarker[]) => {
            dispatch(new SetRichiesteMarkers(result));
        });
    }

    @Action(SetRichiesteMarkers)
    setRichiesteMarkers({ dispatch }: StateContext<RichiesteMarkersStateModel>, action: SetRichiesteMarkers) {
        if (action.richiesteMarkers) {
            const richiesteRilevanti = action.richiesteMarkers.filter(richieste => !!richieste.rilevanza === true);
            const richiesteFiltrate = action.richiesteMarkers.filter(richieste => !!richieste.rilevanza === false);
            dispatch(new AddRichiesteMarkers(richiesteFiltrate));
            this.mapIsLoaded$.subscribe(isLoaded => {
                if (isLoaded) {
                    dispatch(new AddRichiesteMarkers(richiesteRilevanti));
                }
            });
        }
    }

    @Action(AddRichiesteMarkers)
    addRichiesteMarkers({ setState }: StateContext<RichiesteMarkersStateModel>, { payload }: AddRichiesteMarkers) {
        setState(
            patch({
                richiesteMarkers: append(payload)
            })
        );
    }

    @Action(InsertRichiestaMarker)
    insertRichiestaMarker({ setState }: StateContext<RichiesteMarkersStateModel>, { payload, before }: InsertRichiestaMarker) {
        setState(
            patch({
                richiesteMarkers: insertItem(payload, before)
            })
        );
    }

    @Action(UpdateRichiestaMarker)
    updateRichiestaMarker({ setState }: StateContext<RichiesteMarkersStateModel>, { payload }: UpdateRichiestaMarker) {
        setState(
            patch({
                richiesteMarkers: updateItem<RichiestaMarker>(richiesta => richiesta.id === payload.id, payload)
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

    @Action(ClearRichiesteMarkers)
    clearRichiesteMarkers({ patchState }: StateContext<RichiesteMarkersStateModel>) {
        patchState(RichiesteMarkersStateDefaults);
    }

}
