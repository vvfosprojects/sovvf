import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { SetListaSchedeContatto, SetSchedaContattoTelefonata, ClearSchedaContattoTelefonata, GetListaSchedeContatto } from '../../actions/schede-contatto/schede-contatto.actions';
import { SchedeContattoServiceFake } from 'src/app/core/service/schede-contatto/schede-contatto.service.fake';

export interface SchedeContattoStateModel {
    schedeContatto: SchedaContatto[];
    schedaContattoTelefonata: SchedaContatto;
}

export const SchedeContattoStateDefaults: SchedeContattoStateModel = {
    schedeContatto: [],
    schedaContattoTelefonata: null
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

    constructor(private schedeContattoService: SchedeContattoServiceFake) { }

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
}
