import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';
import {
    AddSquadraComposizione,
    ClearListaSquadreComposizione,
    ClearSelectedSquadreComposizione,
    ClearSquadraComposizione, FilterListaSquadreComposizione, FilterListaSquadreComposizioneByFilters,
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
import { makeCopy } from '../../../../../shared/helper/function';
import { AddSquadraBoxPartenza } from '../../actions/composizione-partenza/box-partenza.actions';
import { BoxPartenzaState } from './box-partenza.state';
import { FilterListaMezziComposizione, FilterListaMezziComposizioneByFilters } from '../../actions/composizione-partenza/mezzi-composizione.actions';
import produce from 'immer';
import { codDistaccamentoIsEqual } from '../../../composizione-partenza/shared/functions/composizione-functions';
import { MezziComposizioneStateStateModel } from './mezzi-composizione.state';
import { SetListaFiltriAffini } from '../../actions/composizione-partenza/composizione-partenza.actions';

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

    constructor(private store: Store) {
    }

    @Action(SetListaSquadreComposizione)
    setListaSquadreComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: SetListaSquadreComposizione) {
        const allSquadreComposione = action.squadreComp ? action.squadreComp : this.store.selectSnapshot(SquadreComposizioneState.allSquadreComposione);
        patchState({
            squadreComposizione: allSquadreComposione,
            allSquadreComposione: allSquadreComposione
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
    selectSquadraComposizione({ getState, setState, dispatch }: StateContext<SquadreComposizioneStateStateModel>, action: SelectSquadraComposizione) {
        const boxPartenzaList = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
        // se non c'è già un mezzo selezionato (nell'attuale "box partenza"), filtro la lista dei mezzi
        const idBoxPartenzaSelezionato = this.store.selectSnapshot(BoxPartenzaState.idBoxPartenzaSelezionato);
        const boxPartenzaSelezionato = boxPartenzaList.filter(x => x.id === idBoxPartenzaSelezionato)[0];
        if (boxPartenzaSelezionato && !boxPartenzaSelezionato.mezzoComposizione) {
            dispatch(new FilterListaMezziComposizione(action.squadraComp.squadra.distaccamento.codice));
            const idRichiesteSelezionate = getState().idSquadreSelezionate;
            if (idRichiesteSelezionate && idRichiesteSelezionate.length <= 1) {
                dispatch(new FilterListaSquadreComposizione(action.squadraComp.squadra.distaccamento.codice));
            }
        }
        // Aggiorno lo store
        setState(
            patch({
                idSquadreComposizioneSelezionate: append([action.squadraComp.id]),
                idSquadreSelezionate: append([action.squadraComp.squadra.id])
            })
        );
        this.store.dispatch(new AddSquadraBoxPartenza(action.squadraComp));
    }

    @Action(UnselectSquadraComposizione)
    unselectSquadraComposizione({ getState, setState, dispatch }: StateContext<SquadreComposizioneStateStateModel>, action: UnselectSquadraComposizione) {
        const state = getState();
        const idSquadreSelezionate = state.idSquadreSelezionate;
        if (idSquadreSelezionate && idSquadreSelezionate.length <= 1) {
            const boxPartenzaList = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
            const idBoxPartenzaSelezionato = this.store.selectSnapshot(BoxPartenzaState.idBoxPartenzaSelezionato);
            const boxPartenzaSelezionato = boxPartenzaList.filter(b => b.id === idBoxPartenzaSelezionato)[0];
            if (!boxPartenzaSelezionato.mezzoComposizione) {
                const filtriSelezionati = this.store.selectSnapshot(s => s.composizionePartenza.filtriSelezionati);
                dispatch([
                    new FilterListaSquadreComposizioneByFilters(filtriSelezionati),
                    new FilterListaMezziComposizioneByFilters(filtriSelezionati),
                    new SetListaFiltriAffini()
                ]);
            }
        }
        setState(
            patch({
                idSquadreComposizioneSelezionate: removeItem(id => id === action.squadraComp.id),
                idSquadreSelezionate: removeItem(id => id === action.squadraComp.squadra.id)
            })
        );
    }

    @Action(SelectSquadra)
    selectSquadra({ setState }: StateContext<SquadreComposizioneStateStateModel>, action: SelectSquadra) {
        setState(
            patch({
                idSquadreSelezionate: append([action.idSquadra])
            })
        );
    }

    @Action(UnselectSquadra)
    unselectSquadra({ setState }: StateContext<SquadreComposizioneStateStateModel>, action: UnselectSquadra) {
        setState(
            patch({
                idSquadreSelezionate: removeItem(id => id === action.idSquadra)
            })
        );
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
    }

    @Action(HoverOutSquadraComposizione)
    hoverOutSquadraComposizione({ getState, patchState }: StateContext<SquadreComposizioneStateStateModel>, action: HoverOutSquadraComposizione) {
        const state = getState();
        patchState({
            ...state,
            idSquadraHover: null
        });
    }

    @Action(ClearSquadraComposizione)
    clearSquadraComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>) {
        patchState(SquadreComposizioneStateDefaults);
    }

    @Action(FilterListaSquadreComposizione)
    filterListaSquadreComposizione({ getState, setState, patchState, dispatch }: StateContext<SquadreComposizioneStateStateModel>, action: FilterListaSquadreComposizione) {
        const state = getState();
        const idSquadreSelezionate = state.idSquadreSelezionate;
        if (idSquadreSelezionate && idSquadreSelezionate.length <= 1) {
            let squadre = makeCopy(state.allSquadreComposione);
            if (action.codDistaccamento) {
                squadre = squadre.filter((sC: SquadraComposizione) => sC.squadra.distaccamento.codice === action.codDistaccamento);
            }
            patchState({
                squadreComposizione: squadre
            });
        }
    }

    @Action(FilterListaSquadreComposizioneByFilters)
    filterListaSquadreComposizioneByFilters({ getState, setState, patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: FilterListaSquadreComposizioneByFilters) {
        const state = getState();
        if (action.filtri) {
            setState(
                produce(state, (draft: SquadreComposizioneStateStateModel) => {
                    draft.squadreComposizione = draft.allSquadreComposione;
                    // CODICE DISTACCAMENTO
                    if (action.filtri.CodiceDistaccamento && action.filtri.CodiceDistaccamento.length > 0) {
                        draft.squadreComposizione = draft.squadreComposizione.filter((s: SquadraComposizione) => codDistaccamentoIsEqual(s.squadra.distaccamento.codice, action.filtri.CodiceDistaccamento[0]));
                    }
                })
            );
        }
    }
}
