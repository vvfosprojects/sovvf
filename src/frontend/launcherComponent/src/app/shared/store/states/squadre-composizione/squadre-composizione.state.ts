import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SquadraComposizione } from '../../../interface/squadra-composizione-interface';
import {
    AddSquadraComposizione,
    ClearListaSquadreComposizione,
    ClearSelectedSquadreComposizione,
    ClearSquadraComposizione,
    HoverInSquadraComposizione,
    HoverOutSquadraComposizione,
    RemoveSquadraComposizione,
    SelectSquadra,
    SelectSquadraComposizione,
    SetListaSquadreComposizione,
    UnselectSquadra,
    UnselectSquadraComposizione,
    UpdateSquadraComposizione
} from '../../actions/squadre-composizione/squadre-composizione.actions';
import { append, patch, removeItem } from '@ngxs/store/operators';
import { AddSquadraBoxPartenza } from '../../../../features/home/store/actions/composizione-partenza/box-partenza.actions';
import { BoxPartenzaState } from '../../../../features/home/store/states/composizione-partenza/box-partenza.state';
import { Injectable } from '@angular/core';
import { GetListeComposizioneAvanzata } from '../../../../features/home/store/actions/composizione-partenza/composizione-avanzata.actions';
import { ComposizionePartenzaState } from '../../../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { GetListaMezziSquadre } from '../../actions/sostituzione-partenza/sostituzione-partenza.actions';

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

@Injectable()
@State<SquadreComposizioneStateStateModel>({
    name: 'squadreComposizione',
    defaults: SquadreComposizioneStateDefaults
})
export class SquadreComposizioneState {

    @Selector()
    static squadreComposizione(state: SquadreComposizioneStateStateModel): SquadraComposizione[] {
        return state.squadreComposizione;
    }

    @Selector()
    static allSquadreComposione(state: SquadreComposizioneStateStateModel): SquadraComposizione[] {
        return state.allSquadreComposione;
    }

    @Selector()
    static squadreSelezionate(state: SquadreComposizioneStateStateModel): SquadraComposizione[] {
        const squadreSelez = [];
        state.allSquadreComposione.forEach((s: SquadraComposizione) => {
            state.idSquadreSelezionate.forEach((idS: string) => {
                if (s.id === idS) {
                    squadreSelez.push(s);
                }
            });
        });
        return squadreSelez;
    }

    @Selector()
    static idSquadreSelezionate(state: SquadreComposizioneStateStateModel): string[] {
        return state.idSquadreComposizioneSelezionate;
    }

    @Selector()
    static idSquadraHover(state: SquadreComposizioneStateStateModel): string {
        return state.idSquadraHover;
    }

    constructor(private store: Store) {
    }

    @Action(SetListaSquadreComposizione)
    setListaSquadreComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: SetListaSquadreComposizione): void {
        const allSquadreComposione = action.squadreComp ? action.squadreComp : this.store.selectSnapshot(SquadreComposizioneState.allSquadreComposione);
        patchState({
            squadreComposizione: allSquadreComposione,
            allSquadreComposione
        });
    }

    @Action(ClearListaSquadreComposizione)
    clearListaSquadreComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>): void {
        patchState({
            squadreComposizione: null,
            allSquadreComposione: null
        });
    }

    @Action(AddSquadraComposizione)
    addSquadraComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: AddSquadraComposizione): void {
        console.log(action.squadraComp);
    }

    @Action(RemoveSquadraComposizione)
    removeSquadraComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: RemoveSquadraComposizione): void {
        console.log(action.idSquadra);
    }

    @Action(UpdateSquadraComposizione)
    updateSquadraComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>, action: UpdateSquadraComposizione): void {
        console.log(action.squadraComp);
    }

    @Action(SelectSquadraComposizione)
    selectSquadraComposizione({ getState, setState, dispatch }: StateContext<SquadreComposizioneStateStateModel>, action: SelectSquadraComposizione): void {
        const boxPartenzaList = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
        const idBoxPartenzaSelezionato = this.store.selectSnapshot(BoxPartenzaState.idBoxPartenzaSelezionato);
        const boxPartenzaSelezionato = boxPartenzaList.filter(x => x.id === idBoxPartenzaSelezionato)[0];
        const richiestaComposizione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
        if (richiestaComposizione && (!boxPartenzaSelezionato || (boxPartenzaSelezionato && !boxPartenzaSelezionato?.mezzoComposizione && boxPartenzaSelezionato?.squadreComposizione?.length <= 0))) {
            dispatch(new GetListeComposizioneAvanzata());
        } else if (!richiestaComposizione) {
            dispatch(new GetListaMezziSquadre());
        }
        // Aggiorno lo store
        setState(
            patch({
                idSquadreComposizioneSelezionate: append([action.squadraComp.id]),
                idSquadreSelezionate: append([action.squadraComp.squadra.id])
            })
        );
        if (!boxPartenzaSelezionato || !boxPartenzaSelezionato.squadreComposizione.includes(action.squadraComp)) {
            this.store.dispatch(new AddSquadraBoxPartenza(action.squadraComp));
        }
    }

    @Action(UnselectSquadraComposizione)
    unselectSquadraComposizione({ getState, setState, dispatch }: StateContext<SquadreComposizioneStateStateModel>, action: UnselectSquadraComposizione): void {
        const state = getState();
        const idSquadreSelezionate = state.idSquadreSelezionate;
        if (idSquadreSelezionate && idSquadreSelezionate.length <= 1) {
            const boxPartenzaList = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
            const idBoxPartenzaSelezionato = this.store.selectSnapshot(BoxPartenzaState.idBoxPartenzaSelezionato);
            const boxPartenzaSelezionato = boxPartenzaList.filter(b => b.id === idBoxPartenzaSelezionato)[0];
            const richiestaComposizione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
            if (richiestaComposizione && (!boxPartenzaSelezionato || (boxPartenzaSelezionato && !boxPartenzaSelezionato.mezzoComposizione))) {
                dispatch(new GetListeComposizioneAvanzata());
            } else if (!richiestaComposizione) {
                dispatch(new GetListaMezziSquadre());
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
    selectSquadra({ setState }: StateContext<SquadreComposizioneStateStateModel>, action: SelectSquadra): void {
        setState(
            patch({
                idSquadreSelezionate: append([action.idSquadra])
            })
        );
    }

    @Action(UnselectSquadra)
    unselectSquadra({ setState }: StateContext<SquadreComposizioneStateStateModel>, action: UnselectSquadra): void {
        setState(
            patch({
                idSquadreSelezionate: removeItem(id => id === action.idSquadra)
            })
        );
    }

    @Action(ClearSelectedSquadreComposizione)
    clearSelectedSquadreComposizione({ getState, patchState }: StateContext<SquadreComposizioneStateStateModel>): void {
        const state = getState();
        patchState({
            ...state,
            idSquadreComposizioneSelezionate: []
        });
    }

    @Action(HoverInSquadraComposizione)
    hoverInSquadraComposizione({ getState, patchState }: StateContext<SquadreComposizioneStateStateModel>, action: HoverInSquadraComposizione): void {
        const state = getState();
        patchState({
            ...state,
            idSquadraHover: action.idSquadraComp
        });
    }

    @Action(HoverOutSquadraComposizione)
    hoverOutSquadraComposizione({ getState, patchState }: StateContext<SquadreComposizioneStateStateModel>, action: HoverOutSquadraComposizione): void {
        const state = getState();
        patchState({
            ...state,
            idSquadraHover: null
        });
    }

    @Action(ClearSquadraComposizione)
    clearSquadraComposizione({ patchState }: StateContext<SquadreComposizioneStateStateModel>): void {
        patchState(SquadreComposizioneStateDefaults);
    }
}
