import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    AddSchedaId, CheckboxError, ClearMergeSchedeContatto, InitSaveMergeSchedeContatto,
    RemoveSchedaId,
    SetMergeClassificazione,
    SetMergeSchedaId,
    ToggleModalitaMerge
} from '../../actions/schede-contatto/merge-schede-contatto.actions';
import { ClassificazioneSchedaContatto } from '../../../../../shared/enum/classificazione-scheda-contatto.enum';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { SaveMergeSchedeContatto } from '../../actions/schede-contatto/schede-contatto.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';

export interface MergeSchedeContattoStateModel {
    statoModalita: boolean;
    classificazione: ClassificazioneSchedaContatto;
    schedeSelezionateId: string[];
}

export const MergeSchedeContattoStateDefaults: MergeSchedeContattoStateModel = {
    statoModalita: false,
    classificazione: null,
    schedeSelezionateId: []
};

@State<MergeSchedeContattoStateModel>({
    name: 'mergeSchedeContatto',
    defaults: MergeSchedeContattoStateDefaults
})
export class MergeSchedeContattoState {

    @Selector()
    static statoModalita(state: MergeSchedeContattoStateModel) {
        return state.statoModalita;
    }

    @Selector()
    static classificazione(state: MergeSchedeContattoStateModel) {
        return state.classificazione;
    }

    @Selector()
    static schedeSelezionateId(state: MergeSchedeContattoStateModel) {
        return state.schedeSelezionateId;
    }

    @Action(ToggleModalitaMerge)
    toggleModalitaMerge({ getState, patchState, dispatch }: StateContext<MergeSchedeContattoStateModel>) {
        if (getState().statoModalita) {
            dispatch(new ClearMergeSchedeContatto());
        } else {
            patchState({
                statoModalita: true
            });
        }
    }

    @Action(SetMergeSchedaId)
    setMergeSchedaId({ getState, patchState, dispatch }: StateContext<MergeSchedeContattoStateModel>, action: SetMergeSchedaId) {
        const codiceScheda = action.scheda.codiceScheda;
        if (getState().schedeSelezionateId.includes(codiceScheda)) {
            dispatch(new RemoveSchedaId(codiceScheda));
        } else {
            dispatch(new AddSchedaId(codiceScheda));
        }
        dispatch(new SetMergeClassificazione(action.scheda.classificazione));
    }

    @Action(SetMergeClassificazione)
    setMergeClassificazione({ getState, patchState }: StateContext<MergeSchedeContattoStateModel>, action: SetMergeClassificazione) {
        if (getState().schedeSelezionateId.length === 0) {
            patchState({
                classificazione: MergeSchedeContattoStateDefaults.classificazione
            });
        } else {
            patchState({
                classificazione: action.tipoClassificazione
            });
        }
    }

    @Action(RemoveSchedaId)
    removeSchedaId({ setState }: StateContext<MergeSchedeContattoStateModel>, { payload }: RemoveSchedaId) {
        setState(
            patch({
                schedeSelezionateId: removeItem<string>(id => id === payload)
            })
        );
    }

    @Action(AddSchedaId)
    addSchedaId({ setState }: StateContext<MergeSchedeContattoStateModel>, { payload }: AddSchedaId) {
        setState(
            patch({
                schedeSelezionateId: insertItem(payload)
            })
        );
    }

    @Action(CheckboxError)
    checkboxError({ getState, dispatch }: StateContext<MergeSchedeContattoStateModel>) {
        const plural = getState().schedeSelezionateId.length > 1 ? 'e' : 'a';
        dispatch(new ShowToastr(ToastrType.Warning, 'Selezione scheda contatto', `Impossibile unire una scheda con una classificazione differente da quell${plural} già selezionat${plural}`));
    }

    @Action(InitSaveMergeSchedeContatto)
    initSaveMergeSchedeContatto({ getState, dispatch }: StateContext<MergeSchedeContattoStateModel>) {
        dispatch(new SaveMergeSchedeContatto(getState().schedeSelezionateId));
    }

    @Action(ClearMergeSchedeContatto)
    clearMergeSchedeContatto({ patchState }: StateContext<MergeSchedeContattoStateModel>) {
        patchState(MergeSchedeContattoStateDefaults);
    }

}
