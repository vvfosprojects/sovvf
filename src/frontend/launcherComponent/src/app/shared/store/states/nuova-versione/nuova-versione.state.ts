import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetNewVersion, SetCurrentVersion, SetNewVersion } from '../../actions/nuova-versione/nuova-versione.actions';
import { ShowToastr } from '../../actions/toastr/toastr.actions';
import { ToastrType } from '../../../enum/toastr';

export interface NewVersionStateModel {
    currentVersion: string;
    newVersion: string;
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
        return state.newVersion && (state.newVersion !== state.currentVersion);
    }

    @Action(SetNewVersion)
    setNewVersion({ getState, patchState, dispatch }: StateContext<NewVersionStateModel>, { newVersion }: SetNewVersion) {
        const state = getState();
        if (state.newVersion !== newVersion) {
            // TODO: se c'è una nuova versione dispatch actions
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
