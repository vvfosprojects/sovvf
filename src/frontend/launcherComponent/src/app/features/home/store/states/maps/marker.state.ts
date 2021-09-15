import { Selector, State, Action, StateContext, Select } from '@ngxs/store';
import { RichiestaMarker } from '../../../maps/maps-model/richiesta-marker.model';
import { Observable } from 'rxjs';
import { RichiesteMarkersState } from './richieste-markers.state';
import { SetCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { CentroMappa } from '../../../maps/maps-model/centro-mappa.model';
import { SedeMarker } from '../../../maps/maps-model/sede-marker.model';
import { SediMarkersState } from './sedi-markers.state';
import { SetSedeMarkerById } from '../../actions/maps/sedi-markers.actions';
import { SetRichiestaMarkerById } from '../../actions/maps/richieste-markers.actions';
import { ChiamateMarkersState } from './chiamate-markers.state';
import { MAPSOPTIONS } from '../../../../../core/settings/maps-options';
import { SchedeContattoMarkersState } from './schede-contatto-markers.state';
import {
    SetMarkerRichiestaSelezionato,
    ClearMarkerRichiestaSelezionato,
    SetMarkerRichiestaHover,
    ClearMarkerRichiestaHover,
    SetMarkerSedeSelezionato,
    ClearMarkerSedeSelezionato,
    SetMarkerSedeHover,
    ClearMarkerSedeHover,
    ClearMarkerState,
    SetMarkerSCHover,
    ClearMarkerSCHover,
    ClearMarkerSCSelezionato,
    SetMarkerSCSelezionato
} from '../../actions/maps/marker.actions';
import { Injectable } from '@angular/core';

export interface MarkerStateModel {
    markerRichiestaSelezionato: string;
    markerRichiestaHover: string;
    markerSedeSelezionato: string;
    markerSedeHover: string;
    markerSCSelezionato: string;
    markerSCHover: string;
}

export const markerStateDefaults: MarkerStateModel = {
    markerRichiestaSelezionato: null,
    markerRichiestaHover: null,
    markerSedeSelezionato: null,
    markerSedeHover: null,
    markerSCSelezionato: null,
    markerSCHover: null
};

@Injectable()
@State<MarkerStateModel>({
    name: 'marker',
    defaults: markerStateDefaults,
    children: [
        RichiesteMarkersState,
        SediMarkersState,
        ChiamateMarkersState,
        SchedeContattoMarkersState
    ]
})
export class MarkerState {

    @Select(SediMarkersState.getSedeById) sedeMarkerById$: Observable<SedeMarker>;
    @Select(RichiesteMarkersState.getRichiestaById) richiestaMarkerById$: Observable<RichiestaMarker>;

    @Selector()
    static markerRichiestaSelezionato(state: MarkerStateModel): string {
        return state.markerRichiestaSelezionato;
    }

    @Selector()
    static markerRichiestaHover(state: MarkerStateModel): string {
        return state.markerRichiestaHover;
    }

    @Selector()
    static markerSedeSelezionato(state: MarkerStateModel): string {
        return state.markerSedeSelezionato;
    }

    @Selector()
    static markerSedeHover(state: MarkerStateModel): string {
        return state.markerSedeHover;
    }

    @Selector()
    static markerSCSelezionato(state: MarkerStateModel): string {
        return state.markerSCSelezionato;
    }

    @Selector()
    static markerSCHover(state: MarkerStateModel): string {
        return state.markerSCHover;
    }

    @Selector()
    static markerStateNull(state: MarkerStateModel): boolean {
        return (!state.markerRichiestaSelezionato && !state.markerSedeSelezionato);
    }

    @Action(SetMarkerRichiestaSelezionato)
    setMarkerRichiestaSelezionato({ patchState, dispatch }: StateContext<MarkerStateModel>, action: SetMarkerRichiestaSelezionato): void {
        dispatch(new SetRichiestaMarkerById(action.markerRichiestaSelezionato));
        this.richiestaMarkerById$.subscribe(s => {
            if (s && s.id === action.markerRichiestaSelezionato) {
                const uniqueId = 'richiesta-' + action.markerRichiestaSelezionato;
                dispatch(new SetCentroMappa(new CentroMappa(s.localita.coordinate, MAPSOPTIONS.zoomSelezionato.richiesta)));
            }
        });
        patchState({
            markerRichiestaSelezionato: action.markerRichiestaSelezionato
        });
    }

    @Action(ClearMarkerRichiestaSelezionato)
    clearMarkerRichiestaSelezionato({ patchState }: StateContext<MarkerStateModel>): void {
        patchState({
            markerRichiestaSelezionato: markerStateDefaults.markerRichiestaSelezionato
        });
    }

    @Action(SetMarkerRichiestaHover)
    setMarkerRichiestaHover({ patchState }: StateContext<MarkerStateModel>, action: SetMarkerRichiestaHover): void {
        patchState({
            markerRichiestaHover: action.markerRichiestaHover
        });
    }

    @Action(ClearMarkerRichiestaHover)
    clearMarkerRichiestaHover({ patchState }: StateContext<MarkerStateModel>): void {
        patchState({
            markerRichiestaHover: markerStateDefaults.markerRichiestaHover
        });
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

    @Action(SetMarkerSCSelezionato)
    setMarkerSCSelezionato({ patchState }: StateContext<MarkerStateModel>, action: SetMarkerSCSelezionato): void {
        // dispatch(new SetSCMarkerById(action.markerSCSelezionato));
        patchState({
            markerSCSelezionato: action.markerSCSelezionato
        });
    }

    @Action(ClearMarkerSCSelezionato)
    clearMarkerSCSelezionato({ patchState }: StateContext<MarkerStateModel>): void {
        // dispatch(new SetSCMarkerById());
        patchState({
            markerSCSelezionato: markerStateDefaults.markerSCSelezionato
        });
    }

    @Action(SetMarkerSCHover)
    setMarkerSCHover({ patchState }: StateContext<MarkerStateModel>, action: SetMarkerSCHover): void {
        patchState({
            markerSCHover: action.markerSCHover
        });
    }

    @Action(ClearMarkerSCHover)
    clearMarkerSCHover({ patchState }: StateContext<MarkerStateModel>): void {
        patchState({
            markerSCHover: markerStateDefaults.markerSCHover
        });
    }

    @Action(ClearMarkerState)
    clearMarkerState({ patchState }: StateContext<MarkerStateModel>): void {
        patchState(markerStateDefaults);
    }

}
