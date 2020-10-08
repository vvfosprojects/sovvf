import { Selector, State, Action, StateContext, Select } from '@ngxs/store';
import { RichiestaMarker } from '../../../maps/maps-model/richiesta-marker.model';
import { Observable } from 'rxjs';
import { RichiesteMarkersState } from './richieste-markers.state';
import { SetCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { CentroMappa } from '../../../maps/maps-model/centro-mappa.model';
import { GetMarkerDatiMeteo } from '../../actions/maps/marker-info-window.actions';
import { MezzoMarker } from '../../../maps/maps-model/mezzo-marker.model';
import { MezziMarkersState } from './mezzi-markers.state';
import { SedeMarker } from '../../../maps/maps-model/sede-marker.model';
import { SediMarkersState } from './sedi-markers.state';
import { SetSedeMarkerById } from '../../actions/maps/sedi-markers.actions';
import { SetMezzoMarkerById } from '../../actions/maps/mezzi-markers.actions';
import { SetRichiestaMarkerById } from '../../actions/maps/richieste-markers.actions';
import { MarkerOpachiState } from './marker-opachi.state';
import { MarkerInfoWindowState } from './marker-info-window.state';
import { MeteoMarkersState } from './meteo-markers.state';
import { ChiamateMarkersState } from './chiamate-markers.state';
import { MapsButtonsState } from './maps-buttons.state';
import { MAPSOPTIONS } from '../../../../../core/settings/maps-options';
import { SchedeContattoMarkersState } from './schede-contatto-markers.state';
import {
    SetMarkerRichiestaSelezionato,
    ClearMarkerRichiestaSelezionato,
    SetMarkerRichiestaHover,
    ClearMarkerRichiestaHover,
    SetMarkerMezzoSelezionato,
    ClearMarkerMezzoSelezionato,
    SetMarkerMezzoHover,
    ClearMarkerMezzoHover,
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
    markerMezzoSelezionato: string;
    markerMezzoHover: string;
    markerSedeSelezionato: string;
    markerSedeHover: string;
    markerSCSelezionato: string;
    markerSCHover: string;
}

export const markerStateDefaults: MarkerStateModel = {
    markerRichiestaSelezionato: null,
    markerRichiestaHover: null,
    markerMezzoSelezionato: null,
    markerMezzoHover: null,
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
        MezziMarkersState,
        SediMarkersState,
        MarkerOpachiState,
        MarkerInfoWindowState,
        MeteoMarkersState,
        ChiamateMarkersState,
        MapsButtonsState,
        SchedeContattoMarkersState
    ]
})
export class MarkerState {

    @Select(SediMarkersState.getSedeById) sedeMarkerById$: Observable<SedeMarker>;
    @Select(MezziMarkersState.getMezzoById) mezzoMarkerById$: Observable<MezzoMarker>;
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
    static markerMezzoSelezionato(state: MarkerStateModel): string {
        return state.markerMezzoSelezionato;
    }

    @Selector()
    static markerMezzoHover(state: MarkerStateModel): string {
        return state.markerMezzoHover;
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
        return (!state.markerRichiestaSelezionato && !state.markerMezzoSelezionato && !state.markerSedeSelezionato);
    }

    @Action(SetMarkerRichiestaSelezionato)
    setMarkerRichiestaSelezionato({ getState, patchState, dispatch }: StateContext<MarkerStateModel>, action: SetMarkerRichiestaSelezionato): void {
        dispatch(new SetRichiestaMarkerById(action.markerRichiestaSelezionato));
        const state = getState();
        this.richiestaMarkerById$.subscribe(s => {
            if (s && s.id === action.markerRichiestaSelezionato) {
                const uniqueId = 'richiesta-' + action.markerRichiestaSelezionato;
                dispatch(new GetMarkerDatiMeteo(uniqueId, s.localita.coordinate));
                dispatch(new SetCentroMappa(new CentroMappa(s.localita.coordinate, MAPSOPTIONS.zoomSelezionato.richiesta)));
            }
        });
        patchState({
            ...state,
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

    @Action(SetMarkerMezzoSelezionato)
    setMarkerMezzoSelezionato({ getState, patchState, dispatch }: StateContext<MarkerStateModel>, action: SetMarkerMezzoSelezionato): void {
        dispatch(new SetMezzoMarkerById(action.markerMezzoSelezionato));
        const state = getState();
        this.mezzoMarkerById$.subscribe(s => {
            if (s && s.mezzo.codice === action.markerMezzoSelezionato) {
                const uniqueId = 'mezzo-' + action.markerMezzoSelezionato;
                dispatch(new GetMarkerDatiMeteo(uniqueId, s.mezzo.coordinate));
                if (!action.composizione) {
                    dispatch(new SetCentroMappa(new CentroMappa(s.mezzo.coordinate, MAPSOPTIONS.zoomSelezionato.mezzo)));
                }
            }
        });
        patchState({
            ...state,
            markerMezzoSelezionato: action.markerMezzoSelezionato
        });
    }

    @Action(ClearMarkerMezzoSelezionato)
    clearMarkerMezzoSelezionato({ patchState }: StateContext<MarkerStateModel>): void {
        patchState({
            markerMezzoSelezionato: markerStateDefaults.markerMezzoSelezionato
        });
    }

    @Action(SetMarkerMezzoHover)
    setMarkerMezzoHover({ patchState }: StateContext<MarkerStateModel>, action: SetMarkerMezzoHover): void {
        patchState({
            markerMezzoHover: action.markerMezzoHover
        });
    }

    @Action(ClearMarkerMezzoHover)
    clearMarkerMezzoHover({ patchState }: StateContext<MarkerStateModel>): void {
        patchState({
            markerMezzoHover: markerStateDefaults.markerMezzoHover
        });
    }

    @Action(SetMarkerSedeSelezionato)
    setMarkerSedeSelezionato({ getState, patchState, dispatch }: StateContext<MarkerStateModel>, action: SetMarkerSedeSelezionato): void {
        dispatch(new SetSedeMarkerById(action.markerSedeSelezionato));
        const state = getState();
        this.sedeMarkerById$.subscribe(s => {
            if (s && s.codice === action.markerSedeSelezionato) {
                const uniqueId = 'sede-' + action.markerSedeSelezionato;
                dispatch(new GetMarkerDatiMeteo(uniqueId, s.coordinate));
                dispatch(new SetCentroMappa(new CentroMappa(s.coordinate, MAPSOPTIONS.zoomSelezionato.sede)));
            }
        });
        patchState({
            ...state,
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
    setMarkerSCSelezionato({ getState, patchState, dispatch }: StateContext<MarkerStateModel>, action: SetMarkerSCSelezionato): void {
        // dispatch(new SetSCMarkerById(action.markerSCSelezionato));
        const state = getState();
        patchState({
            ...state,
            markerSCSelezionato: action.markerSCSelezionato
        });
    }

    @Action(ClearMarkerSCSelezionato)
    clearMarkerSCSelezionato({ patchState, dispatch }: StateContext<MarkerStateModel>): void {
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
