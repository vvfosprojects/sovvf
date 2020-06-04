import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetNewVersion, SetCurrentVersion, SetNewVersion } from '../../actions/nuova-versione/nuova-versione.actions';
import { ShowToastr } from '../../actions/toastr/toastr.actions';
import { ToastrType } from '../../../enum/toastr';
import { VersionInterface } from '../../../interface/version.interface';

export interface NewVersionStateModel {
    currentVersion: VersionInterface;
    newVersion: VersionInterface;
}

export const NewVersionStateModelDefaults: NewVersionStateModel = {
    currentVersion: null,
    newVersion: null
};

@State<NewVersionStateModel>({
    name: 'newVersion',
    defaults: NewVersionStateModelDefaults
})
export class NewVersionState {

    @Selector()
    static newVersion(state: NewVersionStateModel) {
        return state.newVersion && (state.newVersion.hash !== state.currentVersion.hash);
    }

    @Selector()
    static version(state: NewVersionStateModel) {
        return state.currentVersion;
    }

    @Action(SetNewVersion)
    setNewVersion({ getState, patchState, dispatch }: StateContext<NewVersionStateModel>, { newVersion }: SetNewVersion) {
        const state = getState();
        if (state.newVersion && state.newVersion.hash !== newVersion.hash) {
            dispatch(new ShowToastr(ToastrType.Info, 'Nuova versione disponibile!', 'Premi sul bottone in alto per aggiornare l\'applicazione', 5, true, true));
        }
        patchState({ newVersion });
    }

    @Action(SetCurrentVersion)
    setCurrentVersion({ getState, patchState, dispatch }: StateContext<NewVersionStateModel>, { currentVersion }: SetCurrentVersion) {
        patchState({ currentVersion });
    }

    @Action(GetNewVersion)
    getNewVersion() {
        window.location.reload();
    }
}
