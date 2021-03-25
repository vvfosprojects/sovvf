import { Selector, State } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { RichiestaForm } from '../../../../../shared/interface/forms/richiesta-form.interface';

export interface FormRichiestaStateModel {
    richiestaForm: {
        model: RichiestaForm,
        dirty: boolean,
        status: string,
        errors: any
    };
}

export const FormRichiestaStateDefaults: FormRichiestaStateModel = {
    richiestaForm: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {}
    },
};

@Injectable()
@State<FormRichiestaStateModel>({
    name: 'formRichiesta',
    defaults: FormRichiestaStateDefaults
})
export class FormRichiestaState {

    @Selector()
    static formValue(state: FormRichiestaStateModel): RichiestaForm {
        return state.richiestaForm.model;
    }
}
