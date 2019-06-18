import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearDataHome, GetDataHome, SetMapLoaded } from '../actions/home.actions';
import { ClearRichieste, SetRichieste } from '../actions/richieste/richieste.actions';
import { ClearSediMarkers, SetSediMarkers } from '../actions/maps/sedi-markers.actions';
import { ClearCentroMappa, GetCentroMappa } from '../actions/maps/centro-mappa.actions';
import { ClearMezziMarkers, SetMezziMarkers } from '../actions/maps/mezzi-markers.actions';
import { ClearRichiesteMarkers, SetRichiesteMarkers } from '../actions/maps/richieste-markers.actions';
import { ClearBoxRichieste, SetBoxRichieste } from '../actions/boxes/box-richieste.actions';
import { ClearBoxMezzi, SetBoxMezzi } from '../actions/boxes/box-mezzi.actions';
import { ClearBoxPersonale, SetBoxPersonale } from '../actions/boxes/box-personale.actions';
import { ClearChiamateMarkers, SetChiamateMarkers } from '../actions/maps/chiamate-markers.actions';
import { HomeService } from '../../../../core/service/home-service/home.service';
import { ShowToastr } from '../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../shared/enum/toastr';
import { Welcome } from '../../../../shared/interface/welcome.interface';

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
        this.homeService.getHome().subscribe((data: Welcome) => {
            console.log(data);
            dispatch([
                new SetRichieste(data.listaSintesi),
                new SetSediMarkers(data.listaSediMarker),
                new SetMezziMarkers(data.listaMezziMarker),
                new SetRichiesteMarkers(data.listaRichiesteMarker),
                new SetBoxRichieste(data.boxListaInterventi),
                new SetBoxMezzi(data.boxListaMezzi),
                new SetBoxPersonale(data.boxListaPersonale),
                new SetChiamateMarkers(data.listaChiamateInCorso)
            ]);
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
