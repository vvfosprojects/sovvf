import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';
import {
    AddSquadraComposizione, ClearSelectedSquadreComposizione, HoverInSquadraComposizione, HoverOutSquadraComposizione,
    RemoveSquadraComposizione,
    SelectSquadraComposizione,
    SetListaSquadreComposizione, UnselectSquadraComposizione,
    UpdateSquadraComposizione
} from '../../actions/composizione-partenza/squadre-composizione.actions';
import { append, patch, removeItem } from '@ngxs/store/operators';

export interface SquadreComposizioneStateStateModel {
    squadreComposizione: SquadraComposizione[];
    idSquadreSelezionate: Array<string>;
    idSquadraHover: string;
}

export const SquadreComposizioneStateDefaults: SquadreComposizioneStateStateModel = {
    squadreComposizione: [],
    idSquadreSelezionate: [],
    idSquadraHover: null
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

    @Selector()
    static idSquadreSelezionate(state: SquadreComposizioneStateStateModel) {
        return state.idSquadreSelezionate;
    }

    @Selector()
    static idSquadraHover(state: SquadreComposizioneStateStateModel) {
        return state.idSquadraHover;
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
    selectSquadraComposizione({ setState }: StateContext<SquadreComposizioneStateStateModel>, action: SelectSquadraComposizione) {
        setState(
            patch({
                idSquadreSelezionate: append([action.idSquadra])
            })
        );
        // console.log(action.idSquadra);
    }

    @Action(UnselectSquadraComposizione)
    unselectSquadraComposizione({ setState }: StateContext<SquadreComposizioneStateStateModel>, action: UnselectSquadraComposizione) {
        setState(
            patch({
                idSquadreSelezionate: removeItem(id => id === action.idSquadra)
            })
        );
        // console.log(action.idSquadra);
    }

    @Action(ClearSelectedSquadreComposizione)
    clearSelectedSquadreComposizione({ getState, patchState }: StateContext<SquadreComposizioneStateStateModel>) {
        const state = getState();
        patchState({
            ...state,
            idSquadreSelezionate: []
        });
    }

    @Action(HoverInSquadraComposizione)
    hoverInMezzoComposizione({ getState, patchState }: StateContext<SquadreComposizioneStateStateModel>, action: HoverInSquadraComposizione) {
        const state = getState();
        patchState({
            ...state,
            idSquadraHover: action.idSquadra
        });
        // console.log(action.idMezzo);
    }

    @Action(HoverOutSquadraComposizione)
    hoverOutMezzoComposizione({ getState, patchState }: StateContext<SquadreComposizioneStateStateModel>, action: HoverOutSquadraComposizione) {
        const state = getState();
        patchState({
            ...state,
            idSquadraHover: null
        });
        // console.log(action.mezzoComp);
    }
}
