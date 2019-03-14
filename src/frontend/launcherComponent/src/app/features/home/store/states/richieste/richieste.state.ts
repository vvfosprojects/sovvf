import { Action, Selector, State, StateContext, NgxsOnInit } from '@ngxs/store';

// Model
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Action
import { ClearRichieste, GetRichieste, SetRichieste } from '../../actions/richieste/richieste.actions';

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
    static getRichiestaById(state: RichiesteStateModel) {
        return (id: string) => state.richieste.find(x => x.id === id);
    }

    constructor(private richiesteService: SintesiRichiesteService) {
    }

    ngxsOnInit(ctx: StateContext<RichiesteState>) {
        // ctx.dispatch(new GetRichieste('0'));
    }

    @Action(GetRichieste, { cancelUncompleted: true })
    getRichieste({ dispatch }: StateContext<RichiesteStateModel>, action: GetRichieste) {
        console.log('Get Richieste');
        this.richiesteService.getRichieste(action.idUltimaRichiesta).subscribe((r: SintesiRichiesta[]) => {
            dispatch(new SetRichieste(r));
        });

    }

    @Action(SetRichieste)
    setRichieste({ getState, patchState }: StateContext<RichiesteStateModel>, action: SetRichieste) {
        const state = getState();

        patchState({
            ...state,
            richieste: [...state.richieste, ...action.richieste]
        });
    }

    @Action(ClearRichieste)
    clearRichieste({ patchState}: StateContext<RichiesteStateModel>) {
        patchState(RichiesteStateDefaults);
    }
}
