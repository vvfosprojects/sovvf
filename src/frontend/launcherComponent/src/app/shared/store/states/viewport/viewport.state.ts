import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetContentHeight, SetAvailHeight, SetInnerWidth, SunMode } from '../../actions/viewport/viewport.actions';
import { RouterState } from '@ngxs/router-plugin';
import { RouterStateModel } from '@ngxs/router-plugin/src/router.state';
import { AuthState, AuthStateModel } from '../../../../features/auth/store/auth.state';
import { AppState, AppStateModel } from '../app/app.state';
import { RoutesPath } from '../../../enum/routes-path.enum';

export interface ViewportStateModel {
    availHeight: number;
    contentHeight: number;
    innerWidth: number;
    maxInnerWidthDoubleMonitor: number;
    maxInnerWidthChiamataConMappa: number;
    sunMode: boolean;
}

export const ViewportStateDefaults: ViewportStateModel = {
    availHeight: null,
    contentHeight: null,
    innerWidth: null,
    maxInnerWidthDoubleMonitor: 3700,
    maxInnerWidthChiamataConMappa: 2400,
    sunMode: true,
};

@Injectable()
@State<ViewportStateModel>({
    name: 'viewport',
    defaults: ViewportStateDefaults
})
export class ViewportState {

    @Selector([RouterState, AppState])
    static footerFixed(state: ViewportStateModel, routerState: RouterStateModel, appState: AppStateModel): boolean {
        const grantUrl = [
            `/${RoutesPath.Home}`,
            `/${RoutesPath.GestioneUtenti}`,
            `/${RoutesPath.Rubrica}`,
            `/${RoutesPath.RubricaPersonale}`,
            `/${RoutesPath.TrasferimentoChiamata}`,
            `/${RoutesPath.Changelog}`,
            `/${RoutesPath.Profilo}`,
            `/${RoutesPath.Preferenze}`
        ];
        let granted = false;
        const appReady = appState.appIsLoaded;
        grantUrl.forEach((url: string) => {
            if (url.indexOf(routerState.state.url.split('#')[0].substring(1)) !== -1) {
                granted = true;
            }
        });
        return state.availHeight > state.contentHeight && granted && appReady;
    }


    @Selector()
    static sunMode(state: ViewportStateModel): boolean {
        return state.sunMode;
    }

    @Selector([RouterState, AuthState, AppState])
    static footerVisible(state: ViewportStateModel, routerState: RouterStateModel, authState: AuthStateModel, appState: AppStateModel): boolean {
        return;
        /*
        const grantUrl = [
            `/${RoutesPath.Home}`,
            `/${RoutesPath.GestioneUtenti}`,
            `/${RoutesPath.Rubrica}`,
            `/${RoutesPath.RubricaPersonale}`,
            `/${RoutesPath.TrasferimentoChiamata}`,
            `/${RoutesPath.Changelog}`,
            `/${RoutesPath.Profilo}`,
            `/${RoutesPath.Preferenze}`
        ];
        let granted = false;
        grantUrl.forEach((url: string) => {
            if (url.indexOf(routerState.state.url.split('#')[0].substring(1)) !== -1) {
                granted = true;
            }
        });
        const logged = authState.logged;
        const appReady = appState.appIsLoaded;
        return granted && logged && appReady;
        */
    }

    @Selector()
    static doubleMonitor(state: ViewportStateModel): boolean {
        return state.innerWidth > state.maxInnerWidthDoubleMonitor;
    }

    @Action(SetAvailHeight)
    setAvailHeight({ patchState }: StateContext<ViewportStateModel>, { availHeight }: SetAvailHeight): void {
        patchState({ availHeight });
    }

    @Action(SetContentHeight)
    setContentHeight({ patchState }: StateContext<ViewportStateModel>, { contentHeight }: SetContentHeight): void {
        patchState({ contentHeight });
    }

    @Action(SetInnerWidth)
    setInnerWidth({ getState, patchState, dispatch }: StateContext<ViewportStateModel>, { innerWidth }: SetInnerWidth): void {
        // const state = getState();
        // if (innerWidth > state.maxInnerWidthDoubleMonitor) {
        //     dispatch(new ChangeView(8));
        // }
        patchState({ innerWidth });
    }

    @Action(SunMode)
    sunMode({ patchState, getState }: StateContext<ViewportStateModel>, value: any): void {
        patchState({
            sunMode: value.sunMode,
        });
    }
}
