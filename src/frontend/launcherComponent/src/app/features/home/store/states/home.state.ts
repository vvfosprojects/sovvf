import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearDataHome, GetDataHome, SetBoundsIniziale, SetDataTipologie } from '../actions/home.actions';
import { ClearRichieste, AddRichieste } from '../actions/richieste/richieste.actions';
import { ClearSediMarkers } from '../actions/maps/sedi-markers.actions';
import {
    ClearCentroMappa,
    SetInitCentroMappa
} from '../actions/maps/centro-mappa.actions';
import { ClearMezziMarkers } from '../actions/maps/mezzi-markers.actions';
import { ClearRichiesteMarkers } from '../actions/maps/richieste-markers.actions';
import { ClearBoxRichieste, SetBoxRichieste } from '../actions/boxes/box-richieste.actions';
import { ClearBoxMezzi, SetBoxMezzi } from '../actions/boxes/box-mezzi.actions';
import { ClearBoxPersonale, SetBoxPersonale } from '../actions/boxes/box-personale.actions';
import { ClearChiamateMarkers, SetChiamateMarkers } from '../actions/maps/chiamate-markers.actions';
import { HomeService } from '../../../../core/service/home-service/home.service';
import { Welcome } from '../../../../shared/interface/welcome.interface';
import { SetTipologicheMezzi } from '../actions/composizione-partenza/tipologiche-mezzi.actions';
import { SetContatoriSchedeContatto } from '../actions/schede-contatto/schede-contatto.actions';
import { Tipologia } from '../../../../shared/model/tipologia.model';
import { GetFiltriRichieste } from '../actions/filterbar/filtri-richieste.actions';
import { PatchPagination } from '../../../../shared/store/actions/pagination/pagination.actions';
import { SetCurrentUrl, SetMapLoaded } from '../../../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../../../shared/enum/routes-path.enum';
import { ClearViewState } from '../actions/view/view.actions';
import { LatLngBounds } from 'ngx-google-places-autocomplete/objects/latLngBounds';

export interface HomeStateModel {
    markerLoading: boolean;
    tipologie: Tipologia[];
    bounds: LatLngBounds;
}

export const HomeStateDefaults: HomeStateModel = {
    markerLoading: false,
    tipologie: null,
    bounds: null
};

@State<HomeStateModel>({
    name: 'home',
    defaults: HomeStateDefaults
})
export class HomeState {

    @Selector()
    static markerOnLoading(state: HomeStateModel) {
        return state.markerLoading;
    }

    @Selector()
    static tipologie(state: HomeStateModel) {
        return state.tipologie;
    }

    @Selector()
    static bounds(state: HomeStateModel) {
        return state.bounds;
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
            new ClearRichieste(),
            new SetMapLoaded(false),
            new ClearViewState()
        ]);
        patchState(HomeStateDefaults);
    }

    @Action(GetDataHome)
    getDataHome({ dispatch }: StateContext<HomeStateModel>) {
        this.homeService.getHome().subscribe((data: Welcome) => {
            console.log('Welcome', data);
            dispatch([
                new SetCurrentUrl(RoutesPath.Home),
                new AddRichieste(data.listaSintesi.sintesiRichiesta),
                new PatchPagination(data.listaSintesi.pagination),
                new SetBoxRichieste(data.boxListaInterventi),
                new SetBoxMezzi(data.boxListaMezzi),
                new SetBoxPersonale(data.boxListaPersonale),
                new SetChiamateMarkers(data.listaChiamateInCorso),
                new SetInitCentroMappa(data.centroMappaMarker),
                new SetTipologicheMezzi(data.listaFiltri),
                new SetContatoriSchedeContatto(data.infoNue),
                new SetDataTipologie(data.tipologie)
            ]);
        });
    }

    @Action(SetDataTipologie)
    setDataTipologie({ patchState, dispatch }: StateContext<HomeStateModel>, action: SetDataTipologie) {
        patchState({
            tipologie: action.tipologie
        });
        dispatch(new GetFiltriRichieste());
    }

    @Action(SetBoundsIniziale)
    setBoundsIniziale({ getState, patchState }: StateContext<HomeStateModel>, { bounds }: SetBoundsIniziale) {
        if (!getState().bounds) {
            patchState({
                bounds
            });
        }
    }
}
