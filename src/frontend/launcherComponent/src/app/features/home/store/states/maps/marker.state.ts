import { Selector, State, Action, StateContext, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SetCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { CentroMappa } from '../../../maps/maps-model/centro-mappa.model';
import { SedeMarker } from '../../../maps/maps-model/sede-marker.model';
import { SediMarkersState } from './sedi-markers.state';
import { SetSedeMarkerById } from '../../actions/maps/sedi-markers.actions';
import { ChiamateMarkersState } from './chiamate-markers.state';
import { MAPSOPTIONS } from '../../../../../core/settings/maps-options';
import {
    SetMarkerSedeSelezionato,
    ClearMarkerSedeSelezionato,
    SetMarkerSedeHover,
    ClearMarkerSedeHover,
    ClearMarkerState
} from '../../actions/maps/marker.actions';
import { Injectable } from '@angular/core';

export interface MarkerStateModel {
    markerSedeSelezionato: string;
    markerSedeHover: string;
}

export const markerStateDefaults: MarkerStateModel = {
    markerSedeSelezionato: null,
    markerSedeHover: null,
};

@Injectable()
@State<MarkerStateModel>({
    name: 'marker',
    defaults: markerStateDefaults,
    children: [
        SediMarkersState,
        ChiamateMarkersState
    ]
})
export class MarkerState {

    @Select(SediMarkersState.getSedeById) sedeMarkerById$: Observable<SedeMarker>;

    @Selector()
    static markerSedeSelezionato(state: MarkerStateModel): string {
        return state.markerSedeSelezionato;
    }

    @Selector()
    static markerSedeHover(state: MarkerStateModel): string {
        return state.markerSedeHover;
    }

    @Action(SetMarkerSedeSelezionato)
    setMarkerSedeSelezionato({ patchState, dispatch }: StateContext<MarkerStateModel>, action: SetMarkerSedeSelezionato): void {
        dispatch(new SetSedeMarkerById(action.markerSedeSelezionato));
        this.sedeMarkerById$.subscribe(s => {
            if (s && s.codice === action.markerSedeSelezionato) {
                const uniqueId = 'sede-' + action.markerSedeSelezionato;
                dispatch(new SetCentroMappa(new CentroMappa(s.coordinate, MAPSOPTIONS.zoomSelezionato.sede)));
            }
        });
        patchState({
            markerSedeSelezionato: action.markerSedeSelezionato
        });
    }

    @Action(ClearMarkerSedeSelezionato)
    clearMarkerSedeSelezionato({ patchState, dispatch }: StateContext<MarkerStateModel>): void {
        dispatch(new SetSedeMarkerById());
        patchState({
            markerSedeSelezionato: markerStateDefaults.markerSedeSelezionato
        });
    }

    @Action(SetMarkerSedeHover)
    setMarkerSedeHover({ patchState }: StateContext<MarkerStateModel>, action: SetMarkerSedeHover): void {
        patchState({
            markerSedeHover: action.markerSedeHover
        });
    }

    @Action(ClearMarkerSedeHover)
    clearMarkerSedeHover({ patchState }: StateContext<MarkerStateModel>): void {
        patchState({
            markerSedeHover: markerStateDefaults.markerSedeHover
        });
    }

    @Action(ClearMarkerState)
    clearMarkerState({ patchState }: StateContext<MarkerStateModel>): void {
        patchState(markerStateDefaults);
    }

}
