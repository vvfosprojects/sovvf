import { Action, Selector, State, StateContext } from '@ngxs/store';

// Model
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Action
import { GetRichieste } from '../actions/richieste.actions';

// Service
import { SintesiRichiesteService } from 'src/app/core/service/lista-richieste-service/lista-richieste.service';

// State
import { RichiestaFissataState } from './richiesta-fissata.state';

export interface RichiesteStateModel {
    richieste: SintesiRichiesta[];
}

export const RichiesteStateDefaults: RichiesteStateModel = {
    richieste: []
};

@State<RichiesteStateModel>({
    name: 'richieste',
    defaults: RichiesteStateDefaults
})
export class RichiesteState {

    constructor(private richiesteService: SintesiRichiesteService) { }

    // SELECTORS
    @Selector()
    static richieste(state: RichiesteStateModel) {
        return state.richieste;
    }

    // SET
    @Action(GetRichieste)
    getRichieste({ getState, patchState }: StateContext<RichiesteStateModel>, action: GetRichieste) {
        const state = getState();
        let newRichieste: SintesiRichiesta[];

        this.richiesteService.getRichieste(action.idUltimaRichiesta).subscribe((r: SintesiRichiesta[]) => {
            newRichieste = r;
        });

        patchState({
            ...state,
            richieste: newRichieste
        });
    }
}
