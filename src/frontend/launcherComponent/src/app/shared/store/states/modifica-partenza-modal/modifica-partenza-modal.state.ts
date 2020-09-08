import { Selector, State, Action } from '@ngxs/store';
import { ModificaPartenza } from 'src/app/shared/interface/modifica-partenza-interface';

export interface ModificaPartenzaModalStateModel {
    modificaPartenza: Array<ModificaPartenza>;
    modificaPartenzaForm: {
        model?: {
            codMezzo: string;
            codSquadre: string[];
            operatore: string;
            sede: string;
            sequenza: [{
                stato: string;
                time: {
                        hour: number, minute: number };
            }];
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
            sequenza: undefined,
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