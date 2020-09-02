import { Selector, State } from '@ngxs/store';
import { ModificaPartenza } from 'src/app/shared/interface/modifica-partenza-interface';

export interface ModificaPartenzaModalStateModel {
    modificaPartenza: Array<ModificaPartenza>;
    modificaPartenzaForm: {
        model?: {
            nuovoMezzo: string;
            operatore: string;
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const ModificaPartenzaModalStateDefaults: ModificaPartenzaModalStateModel = {
    modificaPartenza: undefined,
    modificaPartenzaForm: {
        model: {
            nuovoMezzo: undefined,
            operatore: undefined,
        },
        dirty: false,
        status: '',
        errors: {}
    }
};

@State<ModificaPartenzaModalStateModel>({
    name: 'modificaPartenzaModal',
    defaults: ModificaPartenzaModalStateDefaults
})

export class ModificaPartenzaModalState {

    @Selector()
    static formValid(state: ModificaPartenzaModalStateModel) {
        return state.modificaPartenzaForm.status !== 'INVALID';
    }
}