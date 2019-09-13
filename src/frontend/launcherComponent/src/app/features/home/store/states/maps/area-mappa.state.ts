import { AreaMappa } from '../../../maps/maps-model/area-mappa-model';
import { Action, Select, State, StateContext, Store } from '@ngxs/store';
import { GetMarkersMappa, SetAreaMappa } from '../../actions/maps/area-mappa.actions';
import { GetRichiesteMarkers } from '../../actions/maps/richieste-markers.actions';
import { GetMezziMarkers } from '../../actions/maps/mezzi-markers.actions';
import { GetSediMarkers } from '../../actions/maps/sedi-markers.actions';
import { Observable, Subscription } from 'rxjs';
import { MapsFiltroState } from './maps-filtro.state';
import { FiltriMarkersState } from './filtri-markers.state';
import { FiltroRichieste } from '../../../maps/maps-model/filtro-richieste.interface';

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

    constructor(private store: Store) {
        this.subscription.add(
            this.filtroMarkerAttivo$.subscribe((filtri: string[]) => {
                if (filtri) {
                    this.store.dispatch(new GetMarkersMappa());
                }
            }));
        this.filtroRichieste$.subscribe((filtroRichieste: FiltroRichieste) => {
            if (filtroRichieste) {
                this.store.dispatch(new GetMarkersMappa());
            }
        });
        // TODO: quando c'è un cambiamento nei filtri selezionati faccio il dispatch di getMarkerMappa
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
            // TODO: mi prendo i filtri selezionati (filtro-mezzo / filtro-richiesta)

            if (filtriAttivi.includes('richiesta')) {
                dispatch(new GetRichiesteMarkers(state.areaMappa, filtroRichieste));
            }
            if (filtriAttivi.includes('sede')) {
                dispatch(new GetSediMarkers(state.areaMappa));
            }
            if (filtriAttivi.includes('mezzo')) {
                dispatch(new GetMezziMarkers(state.areaMappa));
            }
        }
    }

}
