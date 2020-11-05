import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    ReloadApp,
    SetVistaSedi,
    SetTimeSync,
    ClearVistaSedi,
    SetMapLoaded,
    SetCurrentUrl
} from '../../actions/app/app.actions';
import { SetCodiceSede } from '../../../../core/signalr/store/signalR.actions';
import { SignalRState, SignalRStateModel } from '../../../../core/signalr/store/signalR.state';
import { Navigate, RouterState } from '@ngxs/router-plugin';
import { RouterStateModel } from '@ngxs/router-plugin/src/router.state';
import { RoutesPath } from '../../../enum/routes-path.enum';
import { AuthState, AuthStateModel } from '../../../../features/auth/store/auth.state';
import { Injectable } from '@angular/core';

export interface AppStateModel {
    previusUrl: string;
    appIsLoaded: boolean;
    vistaSedi: string[];
    offsetTimeSync: number;
    mapIsLoaded: boolean;
}

export const appStateDefaults: AppStateModel = {
    previusUrl: RoutesPath.Home,
    appIsLoaded: true,
    vistaSedi: null,
    offsetTimeSync: 0,
    mapIsLoaded: null
};

@Injectable()
@State<AppStateModel>({
    name: 'appState',
    defaults: appStateDefaults
})
export class AppState {

    @Selector([SignalRState, RouterState])
    static appIsLoaded(state: AppStateModel, signalRState: SignalRStateModel, routerState: RouterStateModel): boolean {
        const currentUrl = routerState.state.url;
        let currentPage = true;
        if (currentUrl === '/home') {
            currentPage = state.mapIsLoaded;
        }
        let signalR = true;
        if (signalRState.reconnected === null) {
            signalR = signalRState.connected && !!signalRState.connectionId && !signalRState.disconnected;
        }
        return state.appIsLoaded && signalR && currentPage;
    }

    @Selector()
    static offsetTimeSync(state: AppStateModel): number {
        return state.offsetTimeSync;
    }

    @Selector()
    static vistaSedi(state: AppStateModel): string[] {
        return state.vistaSedi;
    }

    @Selector([AuthState])
    static previousUrl(state: AppStateModel, authState: AuthStateModel): string {
        const userLogged = authState.currentUser;
        return userLogged ? state.previusUrl : RoutesPath.Login;
    }

    @Action(ReloadApp)
    reloadApp({ dispatch }: StateContext<AppStateModel>): void {
        dispatch(new Navigate([`/${RoutesPath.Logged}`]));
    }

    @Action(SetVistaSedi)
    setVistaSedi({ patchState, dispatch }: StateContext<AppStateModel>, { vistaSedi }: SetVistaSedi): void {
        patchState({ vistaSedi });
        dispatch(new SetCodiceSede(vistaSedi));
    }

    @Action(ClearVistaSedi)
    clearVistaSedi({ patchState }: StateContext<AppStateModel>): void {
        patchState({ vistaSedi: appStateDefaults.vistaSedi });
    }

    @Action(SetTimeSync)
    setTimeSync({ patchState }: StateContext<AppStateModel>, action: SetTimeSync): void {
        patchState({
            offsetTimeSync: new Date(action.time).getTime() - new Date().getTime()
        });
    }

    @Action(SetMapLoaded)
    setMapLoaded({ patchState }: StateContext<AppStateModel>, { mapIsLoaded }: SetMapLoaded): void {
        patchState({ mapIsLoaded });
    }

    @Action(SetCurrentUrl)
    setCurrentUrl({ patchState }: StateContext<AppStateModel>, { previusUrl }: SetCurrentUrl): void {
        patchState({ previusUrl });
    }

}
