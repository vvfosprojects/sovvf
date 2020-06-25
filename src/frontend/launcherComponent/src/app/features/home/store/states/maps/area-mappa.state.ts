import { AreaMappa } from '../../../maps/maps-model/area-mappa-model';
import { Action, Select, Selector, State, StateContext, Store } from '@ngxs/store';
import { GetMarkersMappa, SetAreaMappa, StartLoadingAreaMappa, StopLoadingAreaMappa } from '../../actions/maps/area-mappa.actions';
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
import { ClearSchedeContattoMarkers, GetSchedeContattoMarkers } from '../../actions/maps/schede-contatto-markers.actions';
import { FiltroSchedeContatto } from '../../../maps/maps-model/filtro-schede-contatto';
import { makeCopy } from '../../../../../shared/helper/function';

export interface AreaMappaStateModel {
    areaMappa: AreaMappa;
    areaMappaLoading: number;
}

export const AreaMappaStateDefaults: AreaMappaStateModel = {
    areaMappa: null,
    areaMappaLoading: 0
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
    @Select(FiltriMarkersState.filtroSC) filtroSC$: Observable<FiltroSchedeContatto>;

    @Selector()
    static areaMappa(state: AreaMappaStateModel) {
        return state.areaMappa;
    }

    @Selector()
    static areaMappaLoading(state: AreaMappaStateModel) {
        return state.areaMappaLoading;
    }

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
        this.filtroSC$.subscribe((filtroSC: FiltroSchedeContatto) => {
            if (filtroSC) {
                this.store.dispatch(new GetMarkersMappa());
            }
        });
    }

    @Action(SetAreaMappa)
    setAreaMappa({ patchState, dispatch }: StateContext<AreaMappaStateModel>, action: SetAreaMappa) {
        patchState({
            areaMappa: action.areaMappa
        });
        dispatch([
            new GetMarkersMappa
        ]);
    }

    @Action(GetMarkersMappa)
    getMarkerMappa({ getState, dispatch }: StateContext<AreaMappaStateModel>) {
        const state = getState();
        if (state.areaMappa) {
            const filtriAttivi = this.store.selectSnapshot(MapsFiltroState.filtroMarkerAttivo);
            const filtroRichieste = this.store.selectSnapshot(FiltriMarkersState.filtroRichieste);
            const filtroMezzi = this.store.selectSnapshot(FiltriMarkersState.filtroMezzi);
            const filtroSC = this.store.selectSnapshot(FiltriMarkersState.filtroSC);
            const schedaContattoModeOn = this.store.selectSnapshot(ViewComponentState.schedeContattoStatus);

            if (filtriAttivi.includes('richiesta')) {
                dispatch([
                    new GetRichiesteMarkers(state.areaMappa, filtroRichieste)
                ]);
            } else {
                dispatch(new ClearRichiesteMarkers());
            }
            if (filtriAttivi.includes('sede')) {
                dispatch([
                    new GetSediMarkers(state.areaMappa)
                ]);
            } else {
                dispatch(new ClearSediMarkers());
            }
            if (filtriAttivi.includes('mezzo')) {
                dispatch([
                    new GetMezziMarkers(state.areaMappa, filtroMezzi)
                ]);
            } else {
                dispatch(new ClearMezziMarkers());
            }
            if (schedaContattoModeOn) {
                dispatch([
                    new GetSchedeContattoMarkers(state.areaMappa, filtroSC)
                ]);
            } else {
                dispatch(new ClearSchedeContattoMarkers());
            }
        }
    }

    @Action(StartLoadingAreaMappa)
    startLoadingAreaMappa({ getState, patchState }: StateContext<AreaMappaStateModel>) {
        const valoreAttuale = makeCopy(getState().areaMappaLoading);
        const nuovoValore = valoreAttuale + 1;
        patchState({
            areaMappaLoading: nuovoValore
        });
    }

    @Action(StopLoadingAreaMappa)
    stopLoadingAreaMappa({ getState, patchState }: StateContext<AreaMappaStateModel>) {
        const valoreAttuale = makeCopy(getState().areaMappaLoading);
        const nuovoValore = valoreAttuale - 1;
        patchState({
            areaMappaLoading: nuovoValore
        });
    }

}
