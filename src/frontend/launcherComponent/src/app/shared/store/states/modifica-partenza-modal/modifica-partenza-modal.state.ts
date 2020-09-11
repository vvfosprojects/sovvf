import { Selector, State, Action, StateContext } from '@ngxs/store';
import { ModificaPartenza } from 'src/app/shared/interface/modifica-partenza-interface';
import { SequenzaValoriSelezionati } from 'src/app/shared/interface/sequenza-modifica-partenza.interface';
import { RequestAddModificaPartenza } from '../../actions/modifica-partenza-modal/modifica-partenza-modal-actions';
import { MezzoComposizione } from '../../../interface/mezzo-composizione-interface';
import { SquadraComposizione } from '../../../interface/squadra-composizione-interface';

export interface ModificaPartenzaModalStateModel {
    modificaPartenza: Array<ModificaPartenza>;
    modificaPartenzaForm: {
        model?: {
            operatore: string;
            sede: string;
            codRichiesta: string;
            annullamento: boolean;
            codMezzoDaAnnullare: string;
            codSquadreDaAnnullare: string[];
            mezzo: MezzoComposizione;
            squadre: SquadraComposizione[];
            motivazioneAnnullamento: string;
            sequenzaStati: SequenzaValoriSelezionati[];
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
            operatore: undefined,
            sede: undefined,
            codRichiesta: undefined,
            annullamento: undefined,
            codMezzoDaAnnullare: undefined,
            codSquadreDaAnnullare: undefined,
            mezzo: null,
            squadre: undefined,
            motivazioneAnnullamento: undefined,
            sequenzaStati: undefined
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

    @Action(RequestAddModificaPartenza)
    requestAddModificaPartenza({ getState }: StateContext<ModificaPartenzaModalStateModel>) {
        const state = getState();
        const form = state.modificaPartenzaForm.model;
        const obj = {};
        console.log('RequestAddModificaPartenza FORM', form);
    }
}
