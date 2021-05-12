import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PosService } from '../../../../core/service/pos-service/pos.service';
import { AddPos, SetSelectedFile } from '../../actions/pos-modal/pos-modal.actions';
import { PosInterface } from '../../../interface/pos.interface';

export interface PosModalStateModel {
    selectedFile: File;
    posForm: {
        model?: {
            descrizionePos: string;
            codTipologia: string;
            codDettaglioTipologia?: string;
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const PosModalStateDefaults: PosModalStateModel = {
    selectedFile: undefined,
    posForm: {
        model: {
            descrizionePos: undefined,
            codTipologia: undefined,
            codDettaglioTipologia: undefined
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
    addPos({ getState }: StateContext<PosModalStateModel>): void {
        const state = getState();
        const formValue = state.posForm.model;
        const selectedFile = state.selectedFile;
        const formData = new FormData();
        formData.append('descrizionePos', formValue.descrizionePos);
        formData.append('FDFile', selectedFile);
        formData.append('fileName', selectedFile.name);
        formData.append('codTipologia', formValue.codTipologia);
        if (formValue.codDettaglioTipologia) {
            formData.append('codDettaglioTipologia', formValue.codDettaglioTipologia);
        }
        this.posService.add(formData).subscribe((response: PosInterface) => {
        });
    }

    @Action(SetSelectedFile)
    setSelectedFile({ patchState }: StateContext<PosModalStateModel>, action: SetSelectedFile): void {
        patchState({
            selectedFile: action.file
        });
    }
}
