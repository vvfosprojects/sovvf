import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AddScheda, AddSchedaId, ClearMergeSchedeContatto, InitSaveMergeSchedeContatto, RemoveScheda, RemoveSchedaId, SetMergeClassificazione, SetMergeSchedaId, ToggleModalitaMerge } from '../../actions/schede-contatto/merge-schede-contatto.actions';
import { ClassificazioneSchedaContatto } from '../../../../../shared/enum/classificazione-scheda-contatto.enum';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { SaveMergeSchedeContatto } from '../../actions/schede-contatto/schede-contatto.actions';
import { Injectable } from '@angular/core';
import { SchedaContatto } from '../../../../../shared/interface/scheda-contatto.interface';
import { AddConcorrenzaDtoInterface } from '../../../../../shared/interface/dto/concorrenza/add-concorrenza-dto.interface';
import { TipoConcorrenzaEnum } from '../../../../../shared/enum/tipo-concorrenza.enum';
import { AddConcorrenza, DeleteConcorrenza } from '../../../../../shared/store/actions/concorrenza/concorrenza.actions';

export interface MergeSchedeContattoStateModel {
    statoModalita: boolean;
    classificazione: ClassificazioneSchedaContatto;
    schedeSelezionateId: string[];
    schedeSelezionate: SchedaContatto[];
}

export const MergeSchedeContattoStateDefaults: MergeSchedeContattoStateModel = {
    statoModalita: false,
    classificazione: null,
    schedeSelezionateId: [],
    schedeSelezionate: []
};

@Injectable()
@State<MergeSchedeContattoStateModel>({
    name: 'mergeSchedeContatto',
    defaults: MergeSchedeContattoStateDefaults
})
export class MergeSchedeContattoState {

    @Selector()
    static statoModalita(state: MergeSchedeContattoStateModel): boolean {
        return state.statoModalita;
    }

    @Selector()
    static classificazione(state: MergeSchedeContattoStateModel): ClassificazioneSchedaContatto {
        return state.classificazione;
    }

    @Selector()
    static schedeSelezionateId(state: MergeSchedeContattoStateModel): string[] {
        return state.schedeSelezionateId;
    }

    @Selector()
    static schedeSelezionate(state: MergeSchedeContattoStateModel): SchedaContatto[] {
        return state.schedeSelezionate;
    }

    @Action(ToggleModalitaMerge)
    toggleModalitaMerge({ getState, patchState, dispatch }: StateContext<MergeSchedeContattoStateModel>): void {
        if (getState().statoModalita) {
            dispatch([
                new DeleteConcorrenza(TipoConcorrenzaEnum.RaggruppamentoSchedeContatto),
                new ClearMergeSchedeContatto()
            ]);
        } else {
            patchState({
                statoModalita: true
            });
        }
    }

    @Action(SetMergeSchedaId)
    setMergeSchedaId({ getState, patchState, dispatch }: StateContext<MergeSchedeContattoStateModel>, action: SetMergeSchedaId): void {
        const scheda = action.scheda;
        const codiceScheda = scheda.codiceScheda;
        if (getState().schedeSelezionateId.includes(codiceScheda)) {
            dispatch([
                new DeleteConcorrenza(TipoConcorrenzaEnum.RaggruppamentoSchedeContatto, [scheda.codiceScheda]),
                new RemoveScheda(scheda),
                new RemoveSchedaId(codiceScheda)
            ]);
        } else {
            const data = {
                type: TipoConcorrenzaEnum.RaggruppamentoSchedeContatto,
                value: scheda.codiceScheda
            } as AddConcorrenzaDtoInterface;
            dispatch([
                new AddConcorrenza([data]),
                new AddScheda(scheda),
                new AddSchedaId(codiceScheda)
            ]);
        }
        dispatch(new SetMergeClassificazione(action.scheda.classificazione));
    }

    @Action(SetMergeClassificazione)
    setMergeClassificazione({ getState, patchState }: StateContext<MergeSchedeContattoStateModel>, action: SetMergeClassificazione): void {
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

    @Action(AddSchedaId)
    addSchedaId({ setState }: StateContext<MergeSchedeContattoStateModel>, { payload }: AddSchedaId): void {
        setState(
            patch({
                schedeSelezionateId: insertItem(payload)
            })
        );
    }

    @Action(RemoveSchedaId)
    removeSchedaId({ setState }: StateContext<MergeSchedeContattoStateModel>, { payload }: RemoveSchedaId): void {
        setState(
            patch({
                schedeSelezionateId: removeItem<string>(id => id === payload)
            })
        );
    }

    @Action(AddScheda)
    addScheda({ setState }: StateContext<MergeSchedeContattoStateModel>, { payload }: AddScheda): void {
        setState(
            patch({
                schedeSelezionate: insertItem(payload)
            })
        );
    }

    @Action(RemoveScheda)
    removeScheda({ setState }: StateContext<MergeSchedeContattoStateModel>, { payload }: RemoveScheda): void {
        setState(
            patch({
                schedeSelezionate: removeItem<SchedaContatto>(scheda => scheda.codiceScheda === payload.codiceScheda)
            })
        );
    }

    @Action(InitSaveMergeSchedeContatto)
    initSaveMergeSchedeContatto({ getState, dispatch }: StateContext<MergeSchedeContattoStateModel>): void {
        dispatch(new SaveMergeSchedeContatto(getState().schedeSelezionateId));
    }

    @Action(ClearMergeSchedeContatto)
    clearMergeSchedeContatto({ patchState, dispatch }: StateContext<MergeSchedeContattoStateModel>): void {
        dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.RaggruppamentoSchedeContatto));
        patchState(MergeSchedeContattoStateDefaults);
    }

}
