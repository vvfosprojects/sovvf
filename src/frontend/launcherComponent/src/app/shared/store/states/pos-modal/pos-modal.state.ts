import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PosService } from '../../../../core/service/pos-service/pos.service';
import { AddPos, ResetPosModal } from '../../actions/pos-modal/pos-modal.actions';
import { PosInterface, TipologiaPos } from '../../../interface/pos.interface';

export interface PosModalStateModel {
    posForm: {
        model?: {
            descrizionePos: string;
            codTipologie: number[];
            codTipologieDettagli: number[];
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const PosModalStateDefaults: PosModalStateModel = {
    posForm: {
        model: {
            descrizionePos: undefined,
            codTipologie: undefined,
            codTipologieDettagli: undefined
        },
        dirty: false,
        status: '',
        errors: {}
    }
};

@Injectable()
@State<PosModalStateModel>({
    name: 'posModal',
    defaults: PosModalStateDefaults
})

export class PosModalState {

    constructor(private posService: PosService) {
    }

    @Selector()
    static formValid(state: PosModalStateModel): boolean {
        return state.posForm.status !== 'INVALID';
    }

    @Action(AddPos)
    addPos({ getState, dispatch }: StateContext<PosModalStateModel>, action: AddPos): void {
        const state = getState();
        const formValue = state.posForm.model;
        // TODO: mappare i dati con l'interfaccia AddPosDtoInterface !!!!!!
        const listaTipologie = [
            {
                codTipologia: 1
            }
        ] as TipologiaPos[];
        const formData = action.formData;
        formData.append('descrizionePos', formValue.descrizionePos);
        formData.append('listaTipologie', JSON.stringify(listaTipologie));
        dispatch(new ResetPosModal());
        this.posService.add(formData).subscribe((response: PosInterface) => {
        });
    }

    @Action(ResetPosModal)
    resetPosModal({ patchState }: StateContext<PosModalStateModel>): void {
        patchState(PosModalStateDefaults);
    }
}
