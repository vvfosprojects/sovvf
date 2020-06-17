import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetContentHeight, SetAvailHeight } from '../../actions/viewport/viewport.actions';
import { RouterState } from '@ngxs/router-plugin';
import { RouterStateModel } from '@ngxs/router-plugin/src/router.state';
import { AuthState, AuthStateModel } from '../../../../features/auth/store/auth.state';
import { AppState, AppStateModel } from '../app/app.state';
import { RoutesPath } from '../../../enum/routes-path.enum';

export interface ViewportStateModel {
    availHeight: number;
    contentHeight: number;
}

export const ViewportStateDefaults: ViewportStateModel = {
    availHeight: null,
    contentHeight: null
};

@Injectable()
@State<ViewportStateModel>({
    name: 'viewport',
    defaults: ViewportStateDefaults
})
export class ViewportState {

    @Selector([ RouterState ])
    static footerFixed(state: ViewportStateModel, routerState: RouterStateModel) {
        const grantUrl = routerState.state.url.includes(`/${RoutesPath.Home}`);
        return state.availHeight > state.contentHeight && grantUrl;
    }

    @Selector([ RouterState, AuthState, AppState ])
    static footerVisible(state: ViewportStateModel, routerState: RouterStateModel, authState: AuthStateModel, appState: AppStateModel) {
        const grantUrl = [`/${RoutesPath.Home}`, `/${RoutesPath.GestioneUtenti}`];
        const granted = grantUrl.includes(routerState.state.url);
        const logged = authState.logged;
        const appReady = appState.appIsLoaded;
        return granted && logged && appReady;
    }

    @Action(SetAvailHeight)
    setAvailHeight({ patchState }: StateContext<ViewportStateModel>, { availHeight }: SetAvailHeight) {
        patchState({ availHeight });
    }

    @Action(SetContentHeight)
    setContentHeight({ patchState }: StateContext<ViewportStateModel>, { contentHeight }: SetContentHeight) {
        patchState({ contentHeight });
    }
}
