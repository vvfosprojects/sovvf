import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetListaMezziComposizione } from '../../actions/composizione-partenza/mezzi-composizione.actions';
import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';
import { SetListaSquadreComposizione } from '../../actions/composizione-partenza/squadre-composizione.actions';

export interface SquadreComposizioneStateStateModel {
    squadreComposizione: SquadraComposizione[];
}

export const SquadreComposizioneStateDefaults: SquadreComposizioneStateStateModel = {
    squadreComposizione: []
};

@State<SquadreComposizioneStateStateModel>({
    name: 'squadreComposizione',
    defaults: SquadreComposizioneStateDefaults
})
export class SquadreComposizioneState {

    @Selector()
    static squadreComposizione(state: SquadreComposizioneStateStateModel) {
        return state.squadreComposizione;
    }

    constructor() {
    }

    // SET
    @Action(SetListaSquadreComposizione)
    setListaSquadreComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: SetListaSquadreComposizione) {
        patchState({
            squadreComposizione: action.squadreComposizione
        });
    }
}
