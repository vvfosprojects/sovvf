import { Action, State, StateContext } from '@ngxs/store';
import { ClearDataHome, GetDataHome } from '../actions/home.actions';
import { ClearRichieste, GetRichieste } from '../actions/richieste/richieste.actions';
import { ClearSediMarkers, GetSediMarkers } from '../actions/maps/sedi-markers.actions';
import { ClearCentroMappa, GetCentroMappa } from '../actions/maps/centro-mappa.actions';
import { ClearMezziMarkers, GetMezziMarkers } from '../actions/maps/mezzi-markers.actions';
import { ClearRichiesteMarkers, GetRichiesteMarkers } from '../actions/maps/richieste-markers.actions';
import { ClearBoxRichieste, GetBoxRichieste } from '../actions/boxes/box-richieste.actions';
import { ClearBoxMezzi, GetBoxMezzi } from '../actions/boxes/box-mezzi.actions';
import { ClearBoxPersonale, GetBoxPersonale } from '../actions/boxes/box-personale.actions';

export interface HomeStateModel {
    loaded: boolean;
}

export const HomeStateDefaults: HomeStateModel = {
    loaded: false,
};

@State<HomeStateModel>({
    name: 'home',
    defaults: HomeStateDefaults
})
export class HomeState {
    @Action(ClearDataHome)
    clearDataHome({ patchState, dispatch }: StateContext<HomeStateModel>) {
        dispatch(new ClearCentroMappa());
        dispatch(new ClearSediMarkers());
        dispatch(new ClearMezziMarkers());
        dispatch(new ClearRichiesteMarkers());
        dispatch(new ClearBoxRichieste());
        dispatch(new ClearBoxMezzi());
        dispatch(new ClearBoxPersonale());
        dispatch(new ClearRichieste());
        patchState(HomeStateDefaults);
    }

    @Action(GetDataHome)
    getDataHome({ patchState, dispatch }: StateContext<HomeStateModel>) {
        dispatch(new GetRichieste('0'));
        dispatch(new GetCentroMappa());
        dispatch(new GetSediMarkers());
        dispatch(new GetMezziMarkers());
        dispatch(new GetRichiesteMarkers());
        dispatch(new GetBoxRichieste());
        dispatch(new GetBoxMezzi());
        dispatch(new GetBoxPersonale());
        patchState({
            loaded: true
        });
    }
}
