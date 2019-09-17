import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import {
    SetListaSchedeContatto,
    SetSchedaContattoTelefonata,
    ClearSchedaContattoTelefonata,
    SetSchedaContattoHover, ClearSchedaContattoHover
} from '../../actions/schede-contatto/schede-contatto.actions';

export interface SchedeContattoStateModel {
    schedeContatto: SchedaContatto[];
    schedeContattoCompetenza: SchedaContatto[];
    schedeContattoConoscenza: SchedaContatto[];
    schedaContattoTelefonata: SchedaContatto;
    idSchedaContattoHover: string;
}

export const SchedeContattoStateDefaults: SchedeContattoStateModel = {
    schedeContatto: [],
    schedeContattoCompetenza: [],
    schedeContattoConoscenza: [],
    schedaContattoTelefonata: null,
    idSchedaContattoHover: null
};

@State<SchedeContattoStateModel>({
    name: 'schedeContatto',
    defaults: SchedeContattoStateDefaults
})
export class SchedeContattoState {

    @Selector()
    static schedeContatto(state: SchedeContattoStateModel) {
        return state.schedeContatto;
    }

    @Selector()
    static schedeContattoCompetenza(state: SchedeContattoStateModel) {
        return state.schedeContattoCompetenza;
    }

    @Selector()
    static schedeContattoConoscenza(state: SchedeContattoStateModel) {
        return state.schedeContattoConoscenza;
    }

    @Selector()
    static schedaContattoTelefonata(state: SchedeContattoStateModel) {
        return state.schedaContattoTelefonata;
    }

    @Selector()
    static numeroSchedeContattoCompetenza(state: SchedeContattoStateModel) {
        return state.schedeContattoCompetenza.length;
    }

    @Selector()
    static idSchedaContattoHover(state: SchedeContattoStateModel) {
        return state.idSchedaContattoHover;
    }

    constructor() {
    }

    @Action(SetListaSchedeContatto)
    setListaSchedeContatto({ patchState }: StateContext<SchedeContattoStateModel>, action: SetListaSchedeContatto) {
        patchState({
            schedeContatto: action.schedeContatto,
            schedeContattoCompetenza: action.schedeContatto.filter( schedaContatto => schedaContatto.perCompetenza === true),
            schedeContattoConoscenza: action.schedeContatto.filter( schedaContatto => schedaContatto.perCompetenza !== true)
        });
    }

    @Action(SetSchedaContattoTelefonata)
    setSchedaContattoTelefonata({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoTelefonata) {
        patchState({
            schedaContattoTelefonata: action.schedaContatto
        });
    }

    @Action(ClearSchedaContattoTelefonata)
    clearSchedaContattoTelefonata({ patchState }: StateContext<SchedeContattoStateModel>) {
        patchState({
            schedaContattoTelefonata: null
        });
    }

    @Action(SetSchedaContattoHover)
    setSchedaContattoHover({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoHover) {
        patchState({
            idSchedaContattoHover: action.idSchedaContatto
        });
    }

    @Action(ClearSchedaContattoHover)
    clearSchedaContattoHover({ patchState }: StateContext<SchedeContattoStateModel>) {
        patchState({
            idSchedaContattoHover: null
        });
    }
}
