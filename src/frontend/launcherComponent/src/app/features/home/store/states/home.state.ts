import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearDataHome, GetDataHome, SetBoundsIniziale } from '../actions/home.actions';
import { ClearRichieste } from '../actions/richieste/richieste.actions';
import { ClearCentroMappa } from '../../../maps/store/actions/centro-mappa.actions';
import { ClearBoxRichieste } from '../actions/boxes/box-richieste.actions';
import { ClearBoxMezzi } from '../actions/boxes/box-mezzi.actions';
import { ClearBoxPersonale } from '../actions/boxes/box-personale.actions';
import { ClearChiamateMarkers, SetChiamateMarkers } from '../../../maps/store/actions/chiamate-markers.actions';
import { HomeService } from '../../../../core/service/home-service/home.service';
import { Welcome } from '../../../../shared/interface/welcome.interface';
import { SetTipologicheMezzi } from '../actions/composizione-partenza/tipologiche-mezzi.actions';
import { SetCurrentUrl } from '../../../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../../../shared/enum/routes-path.enum';
import { ClearViewState } from '../actions/view/view.actions';
import { SetEnti } from 'src/app/shared/store/actions/enti/enti.actions';
import { Injectable } from '@angular/core';
import { StopBigLoading } from '../../../../shared/store/actions/loading/loading.actions';
import { ConcorrenzaService } from '../../../../core/service/concorrenza-service/concorrenza.service';
import { GetAllResponseInterface } from '../../../../shared/interface/response/concorrenza/get-all-response.interface';
import { SetConcorrenza } from '../../../../shared/store/actions/concorrenza/concorrenza.actions';

export interface HomeStateModel {
    markerLoading: boolean;
    bounds: any;
}

export const HomeStateDefaults: HomeStateModel = {
    markerLoading: false,
    bounds: null
};

@Injectable()
@State<HomeStateModel>({
    name: 'home',
    defaults: HomeStateDefaults
})
export class HomeState {

    @Selector()
    static markerOnLoading(state: HomeStateModel): boolean {
        return state.markerLoading;
    }

    @Selector()
    static bounds(state: HomeStateModel): any {
        return state.bounds;
    }

    constructor(private concorrenzaService: ConcorrenzaService,
                private homeService: HomeService) {
    }

    @Action(GetDataHome)
    getDataHome({ dispatch }: StateContext<HomeStateModel>): void {
        this.concorrenzaService.deleteAll().subscribe((deleteAllResponse: any) => {
            console.log('DeleteAll - Concorrenza', deleteAllResponse);
            this.concorrenzaService.get().subscribe((getResponse: GetAllResponseInterface) => {
                console.log('Get - Concorrenza', getResponse);
                dispatch(new SetConcorrenza(getResponse.blocksList));
                this.homeService.getHome().subscribe((getHomeResponse: Welcome) => {
                    console.log('Get - Welcome', getHomeResponse);
                    dispatch([
                        new StopBigLoading(),
                        new SetCurrentUrl(RoutesPath.Home),
                        new SetChiamateMarkers(getHomeResponse.listaChiamateInCorso),
                        new SetTipologicheMezzi(getHomeResponse.listaFiltri),
                        new SetEnti(getHomeResponse.rubrica),
                        // new SetZoneEmergenza(data.zoneEmergenza)
                    ]);
                });
            });
        });
    }

    @Action(ClearDataHome)
    clearDataHome({ patchState, dispatch }: StateContext<HomeStateModel>): void {
        dispatch([
            new ClearCentroMappa(),
            new ClearChiamateMarkers(),
            new ClearBoxRichieste(),
            new ClearBoxMezzi(),
            new ClearBoxPersonale(),
            new ClearRichieste(),
            new ClearViewState()
        ]);
        patchState(HomeStateDefaults);
    }

    @Action(SetBoundsIniziale)
    setBoundsIniziale({ getState, patchState }: StateContext<HomeStateModel>, { bounds }: SetBoundsIniziale): void {
        if (!getState().bounds) {
            patchState({
                bounds
            });
        }
    }
}
