import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';
import {
    AddSquadraComposizione,
    ClearListaSquadreComposizione,
    ClearSelectedSquadreComposizione,
    ClearSquadraComposizione, FilterListaSquadreComposizione,
    HoverInSquadraComposizione,
    HoverOutSquadraComposizione,
    RemoveSquadraComposizione,
    SelectSquadra,
    SelectSquadraComposizione,
    SetListaSquadreComposizione,
    UnselectSquadra,
    UnselectSquadraComposizione,
    UpdateSquadraComposizione
} from '../../actions/composizione-partenza/squadre-composizione.actions';
import { append, patch, removeItem } from '@ngxs/store/operators';
import { codDistaccamentoIsEqual } from '../../../composizione-partenza/shared/functions/composizione-functions';
import { makeCopy } from '../../../../../shared/helper/function';

export interface SquadreComposizioneStateStateModel {
    allSquadreComposione: SquadraComposizione[];
    squadreComposizione: SquadraComposizione[];
    idSquadreComposizioneSelezionate: Array<string>;
    idSquadreSelezionate: Array<string>;
    idSquadraHover: string;
}

export const SquadreComposizioneStateDefaults: SquadreComposizioneStateStateModel = {
    allSquadreComposione: null,
    squadreComposizione: null,
    idSquadreComposizioneSelezionate: [],
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
    static allSquadreComposione(state: SquadreComposizioneStateStateModel) {
        return state.allSquadreComposione;
    }

    @Selector()
    static idSquadreSelezionate(state: SquadreComposizioneStateStateModel) {
        return state.idSquadreComposizioneSelezionate;
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
            squadreComposizione: action.squadreComp,
            allSquadreComposione: action.squadreComp
        });
    }

    @Action(ClearListaSquadreComposizione)
    clearListaSquadreComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>) {
        patchState({
            squadreComposizione: null,
            allSquadreComposione: null
        });
    }

    @Action(AddSquadraComposizione)
    addSquadraComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: AddSquadraComposizione) {
        console.log(action.squadraComp);
    }

    @Action(RemoveSquadraComposizione)
    removeSquadraComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: RemoveSquadraComposizione) {
        console.log(action.idSquadra);
    }

    @Action(UpdateSquadraComposizione)
    updateSquadraComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: UpdateSquadraComposizione) {
        console.log(action.squadraComp);
    }

    @Action(SelectSquadraComposizione)
    selectSquadraComposizione({ setState, dispatch }: StateContext<SquadreComposizioneStateStateModel>, action: SelectSquadraComposizione) {
        setState(
            patch({
                idSquadreComposizioneSelezionate: append([action.squadraComp.id]),
                idSquadreSelezionate: append([action.squadraComp.squadra.id])
            })
        );
        // dispatch(new SelectSquadra(action.squadraComp.squadra.id));
        // console.log('Squadra Composizione selezionata', action.idSquadra);
    }

    @Action(UnselectSquadraComposizione)
    unselectSquadraComposizione({ setState, dispatch }: StateContext<SquadreComposizioneStateStateModel>, action: UnselectSquadraComposizione) {
        setState(
            patch({
                idSquadreComposizioneSelezionate: removeItem(id => id === action.squadraComp.id),
                idSquadreSelezionate: removeItem(id => id === action.squadraComp.squadra.id)
            })
        );
        // dispatch(new UnselectSquadra(action.squadraComp.squadra.id));
        // console.log('Squadra Composizione deselezionata', action.idSquadra);
    }

    @Action(SelectSquadra)
    selectSquadra({ setState }: StateContext<SquadreComposizioneStateStateModel>, action: SelectSquadra) {
        setState(
            patch({
                idSquadreSelezionate: append([action.idSquadra])
            })
        );
        // console.log('Squadra selezionata', action.idSquadra);
    }

    @Action(UnselectSquadra)
    unselectSquadra({ setState }: StateContext<SquadreComposizioneStateStateModel>, action: UnselectSquadra) {
        setState(
            patch({
                idSquadreSelezionate: removeItem(id => id === action.idSquadra)
            })
        );
        // console.log('Squadra deselezionata', action.idSquadra);
    }

    @Action(ClearSelectedSquadreComposizione)
    clearSelectedSquadreComposizione({ getState, patchState }: StateContext<SquadreComposizioneStateStateModel>) {
        const state = getState();
        patchState({
            ...state,
            idSquadreComposizioneSelezionate: []
        });
    }

    @Action(HoverInSquadraComposizione)
    hoverInSquadraComposizione({ getState, patchState }: StateContext<SquadreComposizioneStateStateModel>, action: HoverInSquadraComposizione) {
        const state = getState();
        patchState({
            ...state,
            idSquadraHover: action.idSquadraComp
        });
        // console.log('Hover in Squadra Composizione', action.idMezzo);
    }

    @Action(HoverOutSquadraComposizione)
    hoverOutSquadraComposizione({ getState, patchState }: StateContext<SquadreComposizioneStateStateModel>, action: HoverOutSquadraComposizione) {
        const state = getState();
        patchState({
            ...state,
            idSquadraHover: null
        });
        // console.log('Hover out Squadra Composizione', action.mezzoComp);
    }

    @Action(ClearSquadraComposizione)
    clearSquadraComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>) {
        patchState(SquadreComposizioneStateDefaults);
    }

    @Action(FilterListaSquadreComposizione)
    filterListaSquadreComposizione({ getState, setState, patchState, dispatch }: StateContext<SquadreComposizioneStateStateModel>, action: FilterListaSquadreComposizione) {
        const state = getState();
        let squadre = makeCopy(state.squadreComposizione);
        squadre = squadre.filter((s: SquadraComposizione) => s.squadra.distaccamento.codice === action.codDistaccamentoMezzo);
        console.log('squadre', squadre);
        patchState({
            squadreComposizione: squadre
        });
    }
}
