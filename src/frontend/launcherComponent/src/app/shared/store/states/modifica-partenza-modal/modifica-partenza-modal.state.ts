import { Selector, State, Action } from '@ngxs/store';
import { ModificaPartenza } from 'src/app/shared/interface/modifica-partenza-interface';
import { SequenzaValoriSelezionati } from 'src/app/shared/modal/modifica-partenza-modal/modifica-partenza-modal.component';

export interface ModificaPartenzaModalStateModel {
    modificaPartenza: Array<ModificaPartenza>;
    modificaPartenzaForm: {
        model?: {
            codMezzo: string;
            codSquadre: string[];
            operatore: string;
            sede: string;
            sequenze: SequenzaValoriSelezionati[];
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
    /*
    constructor(private modificaPartenzaService: ModificaPartenzaService) {
    }
    */

    @Selector()
    static formValid(state: ModificaPartenzaModalStateModel) {
        return state.modificaPartenzaForm.status !== 'INVALID';
    }

    /*
    @Action(GetListaMezziSquadre)
    getListaMezziSquadre({ patchState }: StateContext<ModificaPartenzaModalStateModel>) {
    this.modificaPartenzaService.getListaMezziSquadre().subscribe((codMezzo: string, codSquadre: string[]) => {
        patchState({
            codMezzo: codMezzo,
            codSquadre: codSquadre,
        });
    })
    */
}
