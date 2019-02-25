import { Action, Selector, State, StateContext } from '@ngxs/store';

// Service
import { EventiRichiestaService } from 'src/app/core/service/eventi-richiesta-service/eventi-richiesta.service';

// Model
import { EventoRichiesta } from '../../eventi-model/evento-richiesta.model';

// Action
import { GetEventiRichiesta, SetIdRichiestaEventi } from '../actions/eventi-richiesta.actions';

export interface EventiRichiestaStateModel {
    idRichiesta: string;
    eventi: EventoRichiesta[];
}

export const eventiRichiestaStateDefaults: EventiRichiestaStateModel = {
    idRichiesta: null,
    eventi: null,
};

@State<EventiRichiestaStateModel>({
    name: 'eventiRichiesta',
    defaults: eventiRichiestaStateDefaults
})
export class EventiRichiestaState {

    constructor(private _eventiRichiesta: EventiRichiestaService) {
    }

    @Selector()
    static eventi(state: EventiRichiestaStateModel) {
        return state.eventi;
    }

    @Action(SetIdRichiestaEventi)
    setIdRichiesta({ getState, patchState }: StateContext<EventiRichiestaStateModel>, action: SetIdRichiestaEventi) {
        const state = getState();

        patchState({
            ...state,
            idRichiesta: action.idRichiesta
        });
    }

    @Action(GetEventiRichiesta)
    getEventiRichiesta({ getState, patchState }: StateContext<EventiRichiestaStateModel>) {
        const state = getState();

        if (state.idRichiesta) {
            this._eventiRichiesta.getEventiRichiesta(state.idRichiesta).subscribe((e: EventoRichiesta[]) => {
                patchState({
                    ...state,
                    eventi: e
                });
            });
        }
    }
}
