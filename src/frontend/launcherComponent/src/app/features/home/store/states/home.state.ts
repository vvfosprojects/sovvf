import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearDataHome, GetDataHome, SetMapLoaded } from '../actions/home.actions';
import { ClearRichieste, GetRichieste } from '../actions/richieste/richieste.actions';
import { ClearSediMarkers, GetSediMarkers } from '../actions/maps/sedi-markers.actions';
import { ClearCentroMappa, GetCentroMappa } from '../actions/maps/centro-mappa.actions';
import { ClearMezziMarkers, GetMezziMarkers } from '../actions/maps/mezzi-markers.actions';
import { ClearRichiesteMarkers, GetRichiesteMarkers } from '../actions/maps/richieste-markers.actions';
import { ClearBoxRichieste, GetBoxRichieste } from '../actions/boxes/box-richieste.actions';
import { ClearBoxMezzi, GetBoxMezzi } from '../actions/boxes/box-mezzi.actions';
import { ClearBoxPersonale, GetBoxPersonale } from '../actions/boxes/box-personale.actions';
import { ClearChiamateMarkers, GetChiamateMarkers } from '../actions/maps/chiamate-markers.actions';
import { HttpClient } from '@angular/common/http';

export interface HomeStateModel {
    loaded: boolean;
    mapIsLoaded: boolean;
}

export const HomeStateDefaults: HomeStateModel = {
    loaded: false,
    mapIsLoaded: false
};

@State<HomeStateModel>({
    name: 'home',
    defaults: HomeStateDefaults
})
export class HomeState {

    @Selector()
    static mapIsLoaded(state: HomeStateModel) {
        return state.mapIsLoaded;
    }

    constructor(private http: HttpClient) {

    }

    @Action(ClearDataHome)
    clearDataHome({ patchState, dispatch }: StateContext<HomeStateModel>) {
        dispatch([
            new ClearCentroMappa(),
            new ClearSediMarkers(),
            new ClearMezziMarkers(),
            new ClearRichiesteMarkers(),
            new ClearChiamateMarkers(),
            new ClearBoxRichieste(),
            new ClearBoxMezzi(),
            new ClearBoxPersonale(),
            new ClearRichieste()
        ]);
        patchState(HomeStateDefaults);
    }

    @Action(GetDataHome)
    getDataHome({ patchState, dispatch }: StateContext<HomeStateModel>) {
        // Todo: da sistemare
        setTimeout( () => {
            this.http.get('/api/Welcome').subscribe(() => {
                console.log('ok');
            }, () => console.error('error'));
            dispatch([
                new GetChiamateMarkers(),
                new GetCentroMappa(),
                // new GetRichieste(),
                // new GetSediMarkers(),
                // new GetMezziMarkers(),
                // new GetRichiesteMarkers(),
                // new GetBoxRichieste(),
                // new GetBoxMezzi(),
                // new GetBoxPersonale()
            ]);
            patchState({
                loaded: true
            });
        }, 500);

    }

    @Action(SetMapLoaded)
    setMapLoaded({ patchState }: StateContext<HomeStateModel>) {
        patchState({
            mapIsLoaded: true
        });
    }
}
