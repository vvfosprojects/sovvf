import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearDataHome, GetDataHome, SetMapLoaded } from '../actions/home.actions';
import { ClearRichieste } from '../actions/richieste/richieste.actions';
import { ClearSediMarkers } from '../actions/maps/sedi-markers.actions';
import { ClearCentroMappa, GetCentroMappa } from '../actions/maps/centro-mappa.actions';
import { ClearMezziMarkers } from '../actions/maps/mezzi-markers.actions';
import { ClearRichiesteMarkers } from '../actions/maps/richieste-markers.actions';
import { ClearBoxRichieste } from '../actions/boxes/box-richieste.actions';
import { ClearBoxMezzi } from '../actions/boxes/box-mezzi.actions';
import { ClearBoxPersonale } from '../actions/boxes/box-personale.actions';
import { ClearChiamateMarkers } from '../actions/maps/chiamate-markers.actions';
import { HomeService } from '../../../../core/service/home-service/home.service';
import { ShowToastr } from '../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../shared/enum/toastr';

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

    constructor(private homeService: HomeService) {
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
        this.homeService.getHome().subscribe(() => {
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
        dispatch([
            new GetCentroMappa(), // Todo: controller da fare
        ]);
        patchState({
            loaded: true
        });

    }

    @Action(SetMapLoaded)
    setMapLoaded({ patchState }: StateContext<HomeStateModel>) {
        patchState({
            mapIsLoaded: true
        });
    }
}
