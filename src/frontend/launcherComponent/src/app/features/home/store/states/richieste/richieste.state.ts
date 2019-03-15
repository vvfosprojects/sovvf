import { Action, Selector, State, StateContext } from '@ngxs/store';

// Model
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Action
import { ClearRichieste, GetRichieste, SetRichieste } from '../../actions/richieste/richieste.actions';

// Service
import { SintesiRichiesteService } from 'src/app/core/service/lista-richieste-service/lista-richieste.service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';

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

    @Action(GetRichieste, { cancelUncompleted: true })
    getRichieste({ dispatch }: StateContext<RichiesteStateModel>, action: GetRichieste) {
        this.richiesteService.getRichieste(action.idUltimaRichiesta).subscribe((r: SintesiRichiesta[]) => {
            if (r.length === 0) {
                dispatch(new ShowToastr('warning', 'Non ci sono altre richieste da visualizzare', 'Richieste terminate', 5000));
            }
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
