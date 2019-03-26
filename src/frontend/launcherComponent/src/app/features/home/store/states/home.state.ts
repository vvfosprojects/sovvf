import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { ClearDataHome, GetDataHome, SetMapLoaded } from '../actions/home.actions';
import { ClearRichieste, GetRichieste } from '../actions/richieste/richieste.actions';
import { ClearSediMarkers, GetSediMarkers } from '../actions/maps/sedi-markers.actions';
import { ClearCentroMappa, GetCentroMappa } from '../actions/maps/centro-mappa.actions';
import { ClearMezziMarkers, GetMezziMarkers } from '../actions/maps/mezzi-markers.actions';
import { ClearRichiesteMarkers, GetRichiesteMarkers } from '../actions/maps/richieste-markers.actions';
import { ClearBoxRichieste, GetBoxRichieste } from '../actions/boxes/box-richieste.actions';
import { ClearBoxMezzi, GetBoxMezzi } from '../actions/boxes/box-mezzi.actions';
import { ClearBoxPersonale, GetBoxPersonale } from '../actions/boxes/box-personale.actions';
import { SignalRService } from '../../../../core/signalr/signalR.service';
import { SignalRNotification } from '../../../../core/signalr/interface/signalr-notification.interface';
import { SignalRState } from '../../../../core/signalr/store/signalR.state';

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

    constructor(private store: Store) {

    }

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
        // Todo: test effettuato con signalr
        // const notification: SignalRNotification = {
        //     CodiceSede: null,
        //     NominativoUtente: null,
        //     idUtente: null
        // };
        // this.signalR.getChiamate();
        const connectionID = this.store.selectSnapshot(SignalRState.connectionIdSignalR);
        dispatch(new GetRichieste(connectionID));
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

    @Action(SetMapLoaded)
    setMapLoaded({ patchState }: StateContext<HomeStateModel>) {
        patchState({
            mapIsLoaded: true
        });
    }
}
