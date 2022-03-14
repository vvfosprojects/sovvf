import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { SintesiRichiesteService } from '../../../../../core/service/lista-richieste-service/lista-richieste.service';
import { SetRichiestaSganciamento, UpdateRichiestaSganciamento } from '../../actions/composizione-partenza/richiesta-sganciamento.actions';

export interface RichiestaSganciamentoStateModel {
    richiestaSganciamento: SintesiRichiesta;
}

export const RichiestaSganciamentoStateDefaults: RichiestaSganciamentoStateModel = {
    richiestaSganciamento: null
};

@Injectable()
@State<RichiestaSganciamentoStateModel>({
    name: 'richiestaSganciamento',
    defaults: RichiestaSganciamentoStateDefaults
})
export class RichiestaSganciamentoState {

    @Selector()
    static richiestaSganciamento(state: RichiestaSganciamentoStateModel): SintesiRichiesta {
        return state.richiestaSganciamento;
    }

    constructor(private richiesteService: SintesiRichiesteService) {
    }

    @Action(SetRichiestaSganciamento)
    setRichiestaSganciamento({ patchState }: StateContext<RichiestaSganciamentoStateModel>, action: SetRichiestaSganciamento): void {
        patchState({
            richiestaSganciamento: action.richiesta
        });
    }

    @Action(UpdateRichiestaSganciamento)
    updateRichiestaSganciamento({ getState, dispatch }: StateContext<RichiestaSganciamentoStateModel>): void {
        const state = getState();
        const richiestaSganciamento = state.richiestaSganciamento;
        if (richiestaSganciamento) {
            this.richiesteService.getRichiestaById(richiestaSganciamento.codice).subscribe((richiesta: SintesiRichiesta) => {
                dispatch(new SetRichiestaSganciamento(richiesta));
            });
        }
    }
}
