import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetAppLoaded, SetAppSede } from '../../actions/app/app.actions';

export interface AppStateModel {
    appIsLoaded: boolean;
    sedeAttuale: string[];
}

export const appStateDefaults: AppStateModel = {
    appIsLoaded: true,
    sedeAttuale: []
};

@State<AppStateModel>({
    name: 'appState',
    defaults: appStateDefaults
})
export class AppState {

    @Selector()
    static appIsLoaded(state: AppStateModel) {
        return state.appIsLoaded;
    }

    constructor() {
    }

    @Action(SetAppLoaded)
    setAppLoaded({ getState, patchState }: StateContext<AppStateModel>) {

        const appLoaded = getState().appIsLoaded;

        if (appLoaded) {
            /**
             * preloader fake, simula il ricaricamento dell'applicazione
             */
            fakeReloading();

            setTimeout(() => {
                fakeReloading();
            }, 1000);

        }

        function fakeReloading() {
            patchState({
                appIsLoaded: !getState().appIsLoaded
            });
        }
    }

    @Action(SetAppSede)
    setAppSede({ patchState }: StateContext<AppStateModel>, action: SetAppSede) {
        patchState({
            sedeAttuale: action.idSede
        });
    }
}
