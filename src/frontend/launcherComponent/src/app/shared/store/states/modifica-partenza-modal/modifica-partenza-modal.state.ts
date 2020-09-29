import { Selector, State } from '@ngxs/store';
import { SequenzaValoriSelezionati } from 'src/app/shared/interface/sequenza-modifica-partenza.interface';
import { MezzoComposizione } from '../../../interface/mezzo-composizione-interface';
import { SquadraComposizione } from 'src/app/shared/interface/squadra-composizione-interface';

export interface ModificaPartenzaModalStateModel {
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
            dataAnnullamento: string;
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const ModificaPartenzaModalStateDefaults: ModificaPartenzaModalStateModel = {
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
            sequenzaStati: undefined,
            dataAnnullamento: undefined,
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
    static formValue(state: ModificaPartenzaModalStateModel): any {
        return state.modificaPartenzaForm.model;
    }

    @Selector()
    static formValid(state: ModificaPartenzaModalStateModel): boolean {
        return state.modificaPartenzaForm.status !== 'INVALID';
    }

}
