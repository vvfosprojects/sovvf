import { Selector, State, Action, StateContext } from '@ngxs/store';
import { ModificaPartenza } from 'src/app/shared/interface/modifica-partenza-interface';
import { SequenzaValoriSelezionati } from 'src/app/shared/interface/sequenza-modifica-partenza.interface';
import { RequestAddModificaPartenza } from '../../actions/modifica-partenza-modal/modifica-partenza-modal-actions';

    export interface ModificaPartenzaModalStateModel {
        modificaPartenza: Array<ModificaPartenza>;
        modificaPartenzaForm: {
            model?: {
                codMezzo: string;
                codSquadre: string[];
                operatore: string;
                sede: string;
                sequenze: SequenzaValoriSelezionati[];
                mezzoDaAnnullare: string;
                squadreDaAnnullare: string[];
                motivazione: string;
                partenzaAnnullata: boolean,
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
            codMezzo: undefined,
            codSquadre: undefined,
            operatore: undefined,
            sede: undefined,
            sequenze: undefined,
            mezzoDaAnnullare: undefined,
            squadreDaAnnullare: undefined,
            motivazione: undefined,
            partenzaAnnullata: undefined,
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

    /*
    @Action(RequestAddModificaPartenza)
    requestAddModificaPartenza({ getState }: StateContext<ModificaPartenzaModalStateModel>) {
        const state = getState();
        const form = state.modificaPartenzaForm.model;
        const obj = {};
    }
    */
}
