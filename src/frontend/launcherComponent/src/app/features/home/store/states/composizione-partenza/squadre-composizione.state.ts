import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';
import {
    AddSquadraComposizione,
    ClearListaSquadreComposizione,
    ClearSelectedSquadreComposizione,
    ClearSquadraComposizione,
    FilterListaSquadreComposizione,
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
import { AddSquadraBoxPartenza } from '../../actions/composizione-partenza/box-partenza.actions';
import { BoxPartenzaState } from './box-partenza.state';
import { FilterListaMezziComposizione } from '../../actions/composizione-partenza/mezzi-composizione.actions';
import produce from 'immer';
import { codDistaccamentoIsEqual } from '../../../composizione-partenza/shared/functions/composizione-functions';
import { SetListaFiltriAffini } from '../../actions/composizione-partenza/composizione-partenza.actions';
import { ComposizionePartenzaState } from './composizione-partenza.state';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';

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
            const filtriSelezionati = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati);
            dispatch(new FilterListaMezziComposizione(action.squadraComp.squadra.distaccamento.codice, filtriSelezionati));
            const idRichiesteSelezionate = getState().idSquadreSelezionate;
            if (idRichiesteSelezionate && idRichiesteSelezionate.length <= 1) {
                dispatch(new FilterListaSquadreComposizione(action.squadraComp.squadra.distaccamento.codice, filtriSelezionati));
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
            if (!boxPartenzaSelezionato || !boxPartenzaSelezionato.mezzoComposizione) {
                const filtriSelezionati = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati);
                dispatch([
                    new FilterListaSquadreComposizione(null, filtriSelezionati),
                    new FilterListaMezziComposizione(null, filtriSelezionati),
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
            setState(
                produce(state, (draft: SquadreComposizioneStateStateModel) => {
                    draft.squadreComposizione = draft.allSquadreComposione;
                    if (action.codDistaccamento) {
                        draft.squadreComposizione = draft.squadreComposizione.filter((sC: SquadraComposizione) => sC.squadra.distaccamento.codice === action.codDistaccamento);
                    }

                    if (action.filtri) {
                        // CODICE DISTACCAMENTO
                        if (action.filtri.CodiceDistaccamento && action.filtri.CodiceDistaccamento.length > 0) {
                            draft.squadreComposizione = draft.squadreComposizione.filter((s: SquadraComposizione) => codDistaccamentoIsEqual(s.squadra.distaccamento.codice, action.filtri.CodiceDistaccamento[0]));
                        }
                        // CODICE SQUADRE SELEZIONATE O MEZZO SELEZIONATO
                        if (action.filtri.CodiceMezzo || (action.filtri.CodiceSquadre && action.filtri.CodiceSquadre.length > 0)) {
                            let codDistaccamentoSelezionato = null;
                            if (action.filtri.CodiceSquadre && action.filtri.CodiceSquadre.length > 0) {
                                codDistaccamentoSelezionato = state.squadreComposizione.filter((sC: SquadraComposizione) => sC.squadra.id === action.filtri.CodiceSquadre[0])[0].squadra.distaccamento.codice;
                            } else if (action.filtri.CodiceMezzo) {
                                codDistaccamentoSelezionato = action.mezziComposizione.filter((mC: MezzoComposizione) => mC.mezzo.codice === action.filtri.CodiceMezzo)[0].mezzo.distaccamento.codice;
                            }
                            draft.squadreComposizione = draft.squadreComposizione.filter((sC: SquadraComposizione) => sC.squadra.distaccamento.codice === codDistaccamentoSelezionato);
                        }
                    }
                })
            );
        }
    }
}
