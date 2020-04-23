import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetNewVersion, SetNewVersion } from '../../actions/nuova-versione/nuova-versione.actions';
import { ShowToastr } from '../../actions/toastr/toastr.actions';
import { ToastrType } from '../../../enum/toastr';

export interface NewVersionStateModel {
    newVersion: boolean;
}

export const NewVersionStateModelDefaults: NewVersionStateModel = {
    newVersion: false
};

@State<NewVersionStateModel>({
    name: 'newVersion',
    defaults: NewVersionStateModelDefaults
})
export class NewVersionState {

    @Selector()
    static newVersion(state: NewVersionStateModel) {
        return state.newVersion;
    }

    @Action(SetNewVersion)
    setNewVersion({ patchState, dispatch }: StateContext<NewVersionStateModel>, action: SetNewVersion) {
        if (action.value) {
            // TODO: se c'è una nuova versione dispatch actions
            dispatch(new ShowToastr(ToastrType.Info, 'Nuova versione disponibile!', 'Premi sul bottone in alto per aggiornare l\'applicazione'));
        } else if (!action.value) {
            // TODO: se c'è una nuova versione dispatch actions
        }
        patchState({
            newVersion: action.value
        });
    }

    @Action(GetNewVersion)
    getNewVersion({ patchState }: StateContext<NewVersionStateModel>) {
        // TODO: logica per prendere la nuova versione disponibile
    }
}
