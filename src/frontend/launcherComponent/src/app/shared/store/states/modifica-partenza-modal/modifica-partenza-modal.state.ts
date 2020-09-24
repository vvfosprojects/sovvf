import { Selector, State, Action, StateContext, Store } from '@ngxs/store';
import { SequenzaValoriSelezionati } from 'src/app/shared/interface/sequenza-modifica-partenza.interface';
import { RequestAddModificaPartenza } from '../../actions/modifica-partenza-modal/modifica-partenza-modal-actions';
import { MezzoComposizione } from '../../../interface/mezzo-composizione-interface';
import { ModificaPartenzaService } from 'src/app/core/service/modifica-partenza/modifica-partenza.service';
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

    constructor(private modificaPartenzaService: ModificaPartenzaService) {
    }

    @Selector()
    static formValid(state: ModificaPartenzaModalStateModel) {
        return state.modificaPartenzaForm.status !== 'INVALID';
    }

    @Action(RequestAddModificaPartenza)
    requestAddModificaPartenza({ getState }: StateContext<ModificaPartenzaModalStateModel>) {
        const state = getState();
        const form = state.modificaPartenzaForm.model;
        const obj = {
            codRichiesta: form.codRichiesta,
            annullamento: form.annullamento,
            codMezzoDaAnnullare: form.codMezzoDaAnnullare,
            codSquadreDaAnnullare: form.codSquadreDaAnnullare,
            mezzo: form.mezzo.mezzo ? form.mezzo.mezzo : form.mezzo,
            squadre: form.squadre,
            motivazioneAnnullamento: form.motivazioneAnnullamento,
            sequenzaStati: form.sequenzaStati.map(x => ({
                dataOraAggiornamento: x.dataOraAggiornamento,
                stato: x.stato ? x.stato: undefined,
                codMezzo: x.codMezzo ? x.codMezzo['codice'] : undefined,
            })),
            dataAnnullamento: form.dataAnnullamento,
        } as any; //adattate squadre e mezzo al BE => non rispetta piu ModificaPartenz => Squadra[] - Mezzo, necessari.
        console.log('RequestAddModificaPartenza FORM', obj);
        this.modificaPartenzaService.addModificaPartenza(obj).subscribe(() => {
        });
    }
}
