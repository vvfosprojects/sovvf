import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';
import {
    AddSquadraComposizione,
    RemoveSquadraComposizione,
    SelectSquadraComposizione,
    SetListaSquadreComposizione, UnselectSquadraComposizione,
    UpdateSquadraComposizione
} from '../../actions/composizione-partenza/squadre-composizione.actions';

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

    @Action(SetListaSquadreComposizione)
    setListaSquadreComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: SetListaSquadreComposizione) {
        patchState({
            squadreComposizione: action.squadre
        });
    }

    @Action(AddSquadraComposizione)
    addSquadraComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: AddSquadraComposizione) {
        console.log(action.squadra);
    }

    @Action(RemoveSquadraComposizione)
    removeSquadraComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: RemoveSquadraComposizione) {
        console.log(action.idSquadra);
    }

    @Action(UpdateSquadraComposizione)
    updateSquadraComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: UpdateSquadraComposizione) {
        console.log(action.squadra);
    }

    @Action(SelectSquadraComposizione)
    selectSquadraComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: SelectSquadraComposizione) {
        console.log(action.idSquadra);
    }

    @Action(UnselectSquadraComposizione)
    unselectSquadraComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: UnselectSquadraComposizione) {
        console.log(action.idSquadra);
    }
}
