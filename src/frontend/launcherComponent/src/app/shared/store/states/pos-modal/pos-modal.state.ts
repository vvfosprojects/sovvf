import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PosService } from '../../../../core/service/pos-service/pos.service';
import { AddPos } from '../../actions/pos-modal/pos-modal.actions';
import { PosInterface } from '../../../interface/pos.interface';

export interface PosModalStateModel {
    posForm: {
        model?: {
            descrizionePos: string;
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const PosModalStateDefaults: PosModalStateModel = {
    posForm: {
        model: {
            descrizionePos: undefined
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
        const obj = {
            descrizionePos: formValue.descrizionePos
        };
        this.posService.add(obj).subscribe((response: PosInterface) => {
        });
    }
}
