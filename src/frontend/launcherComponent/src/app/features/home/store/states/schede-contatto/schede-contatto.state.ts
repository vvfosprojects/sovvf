import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import {
    SetListaSchedeContatto,
    SetSchedaContattoTelefonata,
    ClearSchedaContattoTelefonata,
    GetListaSchedeContatto,
    SetSchedaContattoHover, ClearSchedaContattoHover
} from '../../actions/schede-contatto/schede-contatto.actions';
import { SchedeContattoServiceFake } from 'src/app/core/service/schede-contatto/schede-contatto.service.fake';

export interface SchedeContattoStateModel {
    schedeContatto: SchedaContatto[];
    schedaContattoTelefonata: SchedaContatto;
    idSchedaContattoHover: string;
}

export const SchedeContattoStateDefaults: SchedeContattoStateModel = {
    schedeContatto: [],
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
    static schedaContattoTelefonata(state: SchedeContattoStateModel) {
        return state.schedaContattoTelefonata;
    }

    @Selector()
    static numeroSchedeContatto(state: SchedeContattoStateModel) {
        return state.schedeContatto.length;
    }

    @Selector()
    static idSchedaContattoHover(state: SchedeContattoStateModel) {
        return state.idSchedaContattoHover;
    }

    constructor(private schedeContattoService: SchedeContattoServiceFake) {
    }

    // Todo: da togliere
    @Action(GetListaSchedeContatto)
    getListaSchedeContatto({ patchState }: StateContext<SchedeContattoStateModel>) {
        this.schedeContattoService.getSchedeContatto().subscribe(() => {
        });
    }

    @Action(SetListaSchedeContatto)
    setListaSchedeContatto({ patchState }: StateContext<SchedeContattoStateModel>, action: SetListaSchedeContatto) {
        patchState({
            schedeContatto: action.schedeContatto
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
