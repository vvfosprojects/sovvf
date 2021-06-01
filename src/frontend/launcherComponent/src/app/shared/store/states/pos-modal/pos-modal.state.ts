import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PosService } from '../../../../core/service/pos-service/pos.service';
import { AddPos, DeletePos, EditPos, ResetPosModal } from '../../actions/pos-modal/pos-modal.actions';
import { PosInterface, TipologiaPos } from '../../../interface/pos.interface';
import { Tipologia } from '../../../model/tipologia.model';
import { DettaglioTipologia } from '../../../interface/dettaglio-tipologia.interface';
import { GetPos } from '../../../../features/pos/store/actions/pos/pos.actions';

export interface PosModalStateModel {
    posForm: {
        model?: {
            descrizionePos: string;
            tipologie: Tipologia[];
            tipologieDettagli: DettaglioTipologia[];
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
            tipologie: undefined,
            tipologieDettagli: undefined
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
        const listaTipologiePos = [] as TipologiaPos[];
        const tipologie = formValue.tipologie;
        const tipologieDettagli = formValue.tipologieDettagli;
        tipologie.forEach((t: Tipologia) => {
            let tempTipologiaPos = null as TipologiaPos;
            tempTipologiaPos = {
                codTipologia: +t.codice,
                codTipologiaDettaglio: []
            };
            if (tipologieDettagli) {
                tipologieDettagli.forEach((dT: DettaglioTipologia) => {
                    if (dT.codiceTipologia === +t.codice) {
                        tempTipologiaPos.codTipologiaDettaglio.push(+dT.codiceDettaglioTipologia);
                    }
                });
            }
            listaTipologiePos.push(tempTipologiaPos);
        });
        const formData = action.formData;
        formData.append('descrizionePos', formValue.descrizionePos);
        formData.append('listaTipologie', JSON.stringify(listaTipologiePos));
        this.posService.add(formData).subscribe((response: PosInterface) => {
            dispatch([
                new ResetPosModal(),
                new GetPos()
            ]);
        }, (err => dispatch(new ResetPosModal())));
    }

    @Action(EditPos)
    editPos({ getState, dispatch }: StateContext<PosModalStateModel>, action: EditPos): void {
        const state = getState();
        const formValue = state.posForm.model;
        const listaTipologiePos = [] as TipologiaPos[];
        const tipologie = formValue.tipologie;
        const tipologieDettagli = formValue.tipologieDettagli;
        tipologie.forEach((t: Tipologia) => {
            let tempTipologiaPos = null as TipologiaPos;
            tempTipologiaPos = {
                codTipologia: +t.codice,
                codTipologiaDettaglio: []
            };
            tipologieDettagli.forEach((dT: DettaglioTipologia) => {
                if (dT.codiceTipologia === +t.codice) {
                    tempTipologiaPos.codTipologiaDettaglio.push(+dT.codiceDettaglioTipologia);
                }
            });
            listaTipologiePos.push(tempTipologiaPos);
        });
        const formData = action.formData;
        formData.append('id', action.id);
        formData.append('descrizionePos', formValue.descrizionePos);
        formData.append('listaTipologie', JSON.stringify(listaTipologiePos));
        this.posService.edit(formData).subscribe((response: PosInterface) => {
            dispatch([
                new ResetPosModal(),
                new GetPos()
            ]);
        }, (err => dispatch(new ResetPosModal())));
    }

    @Action(DeletePos)
    deletePos({ getState, dispatch }: StateContext<PosModalStateModel>, action: DeletePos): void {
        this.posService.delete(action.id).subscribe(() => {
            dispatch([
                new ResetPosModal(),
                new GetPos()
            ]);
        }, (err => dispatch(new ResetPosModal())));
    }

    @Action(ResetPosModal)
    resetPosModal({ patchState }: StateContext<PosModalStateModel>): void {
        patchState(PosModalStateDefaults);
    }
}
