import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetNewVersion, SetCurrentVersion, SetNewVersion } from '../../actions/nuova-versione/nuova-versione.actions';
import { ShowToastr } from '../../actions/toastr/toastr.actions';
import { ToastrType } from '../../../enum/toastr';
import { VersionResponseInterface } from '../../../interface/version-response.interface';

export interface NewVersionStateModel {
    currentVersion: VersionResponseInterface;
    newVersion: VersionResponseInterface;
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
        return state.currentVersion && state.currentVersion.version;
    }

    @Action(SetNewVersion)
    setNewVersion({ getState, patchState, dispatch }: StateContext<NewVersionStateModel>, { newVersion }: SetNewVersion) {
        const state = getState();
        if (state.newVersion.hash !== newVersion.hash) {
            dispatch(new ShowToastr(ToastrType.Info, 'Nuova versione disponibile!', 'Premi sul bottone in alto per aggiornare l\'applicazione'));
            patchState({ newVersion });
        }
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
