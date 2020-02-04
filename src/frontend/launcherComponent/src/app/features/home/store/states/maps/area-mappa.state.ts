import { AreaMappa } from '../../../maps/maps-model/area-mappa-model';
import { Action, Select, State, StateContext, Store } from '@ngxs/store';
import { GetMarkersMappa, SetAreaMappa } from '../../actions/maps/area-mappa.actions';
import { ClearRichiesteMarkers, GetRichiesteMarkers } from '../../actions/maps/richieste-markers.actions';
import { ClearMezziMarkers, GetMezziMarkers } from '../../actions/maps/mezzi-markers.actions';
import { ClearSediMarkers, GetSediMarkers } from '../../actions/maps/sedi-markers.actions';
import { Observable, Subscription } from 'rxjs';
import { MapsFiltroState } from './maps-filtro.state';
import { FiltriMarkersState } from './filtri-markers.state';
import { FiltroRichieste } from '../../../maps/maps-model/filtro-richieste.interface';
import { FiltroMezzi } from '../../../maps/maps-model/filtro-mezzi.interface';
import { ReducerFiltroMarker } from '../../actions/maps/maps-filtro.actions';
import { ViewComponentState } from '../view/view.state';

export interface AreaMappaStateModel {
    areaMappa: AreaMappa;
}

export const AreaMappaStateDefaults: AreaMappaStateModel = {
    areaMappa: null
};

@State<AreaMappaStateModel>({
    name: 'areaMappa',
    defaults: AreaMappaStateDefaults
})
export class AreaMappaState {

    private subscription = new Subscription();
    @Select(MapsFiltroState.filtroMarkerAttivo) filtroMarkerAttivo$: Observable<string[]>;
    @Select(FiltriMarkersState.filtroRichieste) filtroRichieste$: Observable<FiltroRichieste>;
    @Select(FiltriMarkersState.filtroMezzi) filtroMezzi$: Observable<FiltroMezzi>;

    constructor(private store: Store) {
        this.subscription.add(
            this.filtroMarkerAttivo$.subscribe((filtri: string[]) => {
                if (filtri) {
                    this.store.dispatch(new GetMarkersMappa());
                }
            }));
        this.filtroRichieste$.subscribe((filtroRichieste: FiltroRichieste) => {
            if (filtroRichieste) {
                if (filtroRichieste.priorita || filtroRichieste.stato.length > 0) {
                    this.store.dispatch(new ReducerFiltroMarker('richiesta'));
                }
                this.store.dispatch(new GetMarkersMappa());
            }
        });
        this.filtroMezzi$.subscribe((filtroMezzi: FiltroMezzi) => {
            if (filtroMezzi) {
                if (filtroMezzi.stato.length > 0 || filtroMezzi.tipologia.length > 0) {
                    this.store.dispatch(new ReducerFiltroMarker('mezzo'));
                }
                this.store.dispatch(new GetMarkersMappa());
            }
        });
    }

    @Action(SetAreaMappa)
    setAreaMappa({ patchState, dispatch }: StateContext<AreaMappaStateModel>, action: SetAreaMappa) {
        patchState({
            areaMappa: action.areaMappa
        });
        dispatch(new GetMarkersMappa);
    }

    @Action(GetMarkersMappa)
    getMarkerMappa({ getState, dispatch }: StateContext<AreaMappaStateModel>) {
        const state = getState();
        if (state.areaMappa) {
            const filtriAttivi = this.store.selectSnapshot(MapsFiltroState.filtroMarkerAttivo);
            const filtroRichieste = this.store.selectSnapshot(FiltriMarkersState.filtroRichieste);
            const filtroMezzi = this.store.selectSnapshot(FiltriMarkersState.filtroMezzi);
            const schedaContattoModeOn = this.store.selectSnapshot(ViewComponentState.schedeContattoStatus);

            if (filtriAttivi.includes('richiesta')) {
                dispatch(new GetRichiesteMarkers(state.areaMappa, filtroRichieste));
            } else {
                dispatch(new ClearRichiesteMarkers());
            }
            if (filtriAttivi.includes('sede')) {
                dispatch(new GetSediMarkers(state.areaMappa));
            } else {
                dispatch(new ClearSediMarkers());
            }
            if (filtriAttivi.includes('mezzo')) {
                dispatch(new GetMezziMarkers(state.areaMappa, filtroMezzi));
            } else {
                dispatch(new ClearMezziMarkers());
            }
            // Todo schede contatto Markers
            if (schedaContattoModeOn) {
                // dispatch(new GetSchedeContattoMarkers(state.areaMappa));
            } else {
                // dispatch(new ClearSchedeContattoMarkers());
            }
        }
    }

}
