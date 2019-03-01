import { Action, Selector, State, StateContext, NgxsOnInit } from '@ngxs/store';

// Model
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Action
import { GetRichieste } from '../../actions/richieste/richieste.actions';

// Service
import { SintesiRichiesteService } from 'src/app/core/service/lista-richieste-service/lista-richieste.service';

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
export class RichiesteState implements NgxsOnInit {

    // SELECTORS
    @Selector()
    static richieste(state: RichiesteStateModel) {
        return state.richieste;
    }

    @Selector()
    static richiesta(state: RichiesteStateModel) {
        return state.richieste;
    }

    constructor(private richiesteService: SintesiRichiesteService) { }

    ngxsOnInit(ctx: StateContext<RichiesteState>) {
        ctx.dispatch(new GetRichieste('0'));
    }

    // SET
    @Action(GetRichieste, { cancelUncompleted: true })
    getRichieste({ getState, patchState }: StateContext<RichiesteStateModel>, action: GetRichieste) {
        const state = getState();
        let newRichieste: SintesiRichiesta[] = null;

        this.richiesteService.getRichieste(action.idUltimaRichiesta).subscribe((r: SintesiRichiesta[]) => {
            newRichieste = r;
            // console.log('New Richieste', newRichieste);
        });

        patchState({
            ...state,
            richieste: [...state.richieste, ...newRichieste]
        });
    }
}
