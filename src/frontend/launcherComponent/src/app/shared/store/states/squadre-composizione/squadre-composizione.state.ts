import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    AddSquadraComposizione,
    ClearIdSquadreSelezionate,
    ClearListaSquadreComposizione,
    ClearSelectedSquadreComposizione,
    ClearSquadraComposizione,
    HoverInSquadraComposizione,
    HoverOutSquadraComposizione,
    RemoveSquadraComposizione,
    SelectSquadraComposizione,
    SelectSquadraComposizioneInRientro,
    SelectSquadraComposizionePreAccoppiati,
    SelectSquadreComposizione,
    SetListaSquadreComposizione,
    UnselectSquadraComposizione,
    UnselectSquadraComposizioneInRientro,
    UnselectSquadraComposizionePreAccoppiati,
    UpdateSquadraComposizione
} from '../../actions/squadre-composizione/squadre-composizione.actions';
import { append, patch, removeItem } from '@ngxs/store/operators';
import {
    AddBoxesPartenzaInRientro,
    AddBoxesPartenzaPreAccoppiato,
    AddSquadreBoxPartenza
} from '../../../../features/home/store/actions/composizione-partenza/box-partenza.actions';
import { BoxPartenzaState } from '../../../../features/home/store/states/composizione-partenza/box-partenza.state';
import { Injectable } from '@angular/core';
import { GetListeComposizioneAvanzata } from '../../../../features/home/store/actions/composizione-partenza/composizione-avanzata.actions';
import { ComposizionePartenzaState } from '../../../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { GetListaMezziSquadre } from '../../actions/sostituzione-partenza/sostituzione-partenza.actions';
import { SquadraComposizione } from '../../../interface/squadra-composizione-interface';
import { TipoConcorrenzaEnum } from '../../../enum/tipo-concorrenza.enum';
import { AddConcorrenzaDtoInterface } from '../../../interface/dto/concorrenza/add-concorrenza-dto.interface';
import { AddConcorrenza } from '../../actions/concorrenza/concorrenza.actions';

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
                if (s.codice === idS) {
                    let duplicate = false;
                    squadreSelez.forEach(x => x.id === s.codice ? duplicate = true : null);
                    if (!duplicate) {
                        squadreSelez.push(s);
                    }
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

    @Action(ClearIdSquadreSelezionate)
    clearIdSquadreSelezionate({ patchState }: StateContext<SquadreComposizioneStateStateModel>): void {
        patchState({
            idSquadreSelezionate: []
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
        const state = getState();
        const richiestaComposizione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
        const boxPartenzaSelezionato = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaSelezionato);
        const squadraComp = action.squadraComp;
        const squadra = action.squadraComp;

        if (action.dividiSquadra) {
            // Ripulisco lo store se sto dividendo squadra tramite shortcut
            setState(
                patch({
                    idSquadreComposizioneSelezionate: SquadreComposizioneStateDefaults.idSquadreComposizioneSelezionate,
                    idSquadreSelezionate: SquadreComposizioneStateDefaults.idSquadreSelezionate,
                })
            );
        }

        if (richiestaComposizione && !action.preaccoppiato) {
            dispatch(new GetListeComposizioneAvanzata());
        } else if (!richiestaComposizione) {
            dispatch(new GetListaMezziSquadre());
        }

        setState(
            patch({
                idSquadreComposizioneSelezionate: append([squadraComp.codice]),
                idSquadreSelezionate: !state.idSquadreSelezionate.includes(squadra.codice) ? append([squadra.codice]) : state.idSquadreSelezionate,
            })
        );
        if (!boxPartenzaSelezionato || !boxPartenzaSelezionato.squadreComposizione.includes(squadraComp)) {
            this.store.dispatch(new AddSquadreBoxPartenza([squadraComp]));
        }
    }

    @Action(SelectSquadraComposizioneInRientro)
    selectSquadraComposizioneInRientro({ getState, setState, dispatch }: StateContext<SquadreComposizioneStateStateModel>, action: SelectSquadraComposizioneInRientro): void {
        const state = getState();
        const squadraComp = action.squadraComp;
        const squadra = action.squadraComp;
        const noAddBox = action.noAddBox;
        setState(
            patch({
                idSquadreComposizioneSelezionate: [squadraComp.codice],
                idSquadreSelezionate: !state.idSquadreSelezionate.includes(squadra.codice) ? append([squadra.codice]) : state.idSquadreSelezionate,
            })
        );
        if (!noAddBox) {
            dispatch(new AddBoxesPartenzaInRientro(squadraComp));
        }
    }

    @Action(SelectSquadraComposizionePreAccoppiati)
    selectSquadraComposizionePreAccoppiati({ getState, setState, dispatch }: StateContext<SquadreComposizioneStateStateModel>, action: SelectSquadraComposizionePreAccoppiati): void {
        const state = getState();
        const squadraComp = action.squadraComp;
        const squadra = action.squadraComp;
        const noAddBox = action.noAddBox;

        setState(
            patch({
                idSquadreComposizioneSelezionate: append([squadraComp.codice]),
                idSquadreSelezionate: !state.idSquadreSelezionate.includes(squadra.codice) ? append([squadra.codice]) : state.idSquadreSelezionate,
            })
        );

        if (!noAddBox) {
            dispatch(new AddBoxesPartenzaPreAccoppiato(squadraComp));
            const data = {
                type: TipoConcorrenzaEnum.Squadra,
                value: squadraComp.codice
            } as AddConcorrenzaDtoInterface;
            dispatch(new AddConcorrenza([data]));
        }
    }

    @Action(SelectSquadreComposizione)
    selectSquadreComposizione({ getState, setState, dispatch }: StateContext<SquadreComposizioneStateStateModel>, action: SelectSquadreComposizione): void {
        const state = getState();
        if (action.squadreComp) {
            const richiestaComposizione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
            const boxPartenzaList = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
            const idBoxPartenzaSelezionato = this.store.selectSnapshot(BoxPartenzaState.idBoxPartenzaSelezionato);
            const boxPartenzaSelezionato = boxPartenzaList.filter(x => x.id === idBoxPartenzaSelezionato)[0];

            if (richiestaComposizione && (!boxPartenzaSelezionato || (boxPartenzaSelezionato && !boxPartenzaSelezionato?.mezzoComposizione && boxPartenzaSelezionato?.squadreComposizione?.length <= 0))) {
                dispatch(new GetListeComposizioneAvanzata());
            } else if (!richiestaComposizione) {
                dispatch(new GetListaMezziSquadre());
            }
            if (action.preAccoppiato) {
                setState(
                    patch({
                        idSquadreComposizioneSelezionate: action.squadreComp.map((squadraComp: SquadraComposizione) => squadraComp.codice),
                        idSquadreSelezionate: action.squadreComp.map((squadraComp: SquadraComposizione) => squadraComp.codice),
                    })
                );
                if (!action.noSelect && (!boxPartenzaSelezionato || !boxPartenzaSelezionato.squadreComposizione.filter((squadraComp: SquadraComposizione) => action.squadreComp.includes(squadraComp)).length)) {
                    this.store.dispatch(new AddSquadreBoxPartenza(action.squadreComp, true));
                }
                this.store.dispatch(new GetListeComposizioneAvanzata(null, null, null, true));
            } else {
                setState(
                    patch({
                        idSquadreComposizioneSelezionate: append(action.squadreComp.map((squadraComp: SquadraComposizione) => squadraComp.codice)),
                        idSquadreSelezionate: !action.noSelect ? append(action.squadreComp.map((squadraComp: SquadraComposizione) => squadraComp.codice)) : state.idSquadreSelezionate,
                    })
                );
                if (!action.noSelect && (!boxPartenzaSelezionato || !boxPartenzaSelezionato.squadreComposizione.filter((squadraComp: SquadraComposizione) => action.squadreComp.includes(squadraComp)).length)) {
                    this.store.dispatch(new AddSquadreBoxPartenza(action.squadreComp));
                }
            }
        }
    }

    @Action(UnselectSquadraComposizione)
    unselectSquadraComposizione({ getState, setState, dispatch }: StateContext<SquadreComposizioneStateStateModel>, action: UnselectSquadraComposizione): void {
        const state = getState();
        const idSquadreSelezionate = state.idSquadreSelezionate;
        if (idSquadreSelezionate) {
            const boxPartenzaList = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
            const idBoxPartenzaSelezionato = this.store.selectSnapshot(BoxPartenzaState.idBoxPartenzaSelezionato);
            const boxPartenzaSelezionato = boxPartenzaList.filter(b => b.id === idBoxPartenzaSelezionato)[0];
            const richiestaComposizione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
            if (richiestaComposizione && !(boxPartenzaSelezionato && boxPartenzaSelezionato.mezzoComposizione && boxPartenzaSelezionato.squadreComposizione && boxPartenzaSelezionato.squadreComposizione.length === 1) && !action.preventGet) {
                dispatch(new GetListeComposizioneAvanzata());
            } else if (!richiestaComposizione) {
                dispatch(new GetListaMezziSquadre());
            }
        }
        setState(
            patch({
                idSquadreComposizioneSelezionate: removeItem(id => id === action.squadraComp.codice),
                idSquadreSelezionate: removeItem(id => id === action.squadraComp.codice)
            })
        );
    }

    @Action(UnselectSquadraComposizioneInRientro)
    unselectSquadraComposizioneInRientro({ getState, setState, dispatch }: StateContext<SquadreComposizioneStateStateModel>, action: UnselectSquadraComposizioneInRientro): void {
        const state = getState();
        const idSquadreSelezionate = state.idSquadreSelezionate;
        if (idSquadreSelezionate && idSquadreSelezionate.length <= 1) {
            const boxPartenzaList = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
            const idBoxPartenzaSelezionato = this.store.selectSnapshot(BoxPartenzaState.idBoxPartenzaSelezionato);
            const boxPartenzaSelezionato = boxPartenzaList.filter(b => b.id === idBoxPartenzaSelezionato)[0];
            const richiestaComposizione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
            if (richiestaComposizione && ((boxPartenzaSelezionato && !boxPartenzaSelezionato.mezzoComposizione))) {
                dispatch(new GetListeComposizioneAvanzata());
            } else if (!richiestaComposizione) {
                dispatch(new GetListaMezziSquadre());
            }
        }
        setState(
            patch({
                idSquadreComposizioneSelezionate: removeItem(id => id === action.squadraComp.codice),
                idSquadreSelezionate: removeItem(id => id === action.squadraComp.codice)
            })
        );
    }

    @Action(UnselectSquadraComposizionePreAccoppiati)
    unselectSquadraComposizionePreAccoppiati({ getState, setState, dispatch }: StateContext<SquadreComposizioneStateStateModel>, action: UnselectSquadraComposizioneInRientro): void {
        // TODO: Deselezione mezzo pre accoppiato alla squadra
        const state = getState();
        const idSquadreSelezionate = state.idSquadreSelezionate;
        if (idSquadreSelezionate && idSquadreSelezionate.length <= 1) {
            const boxPartenzaList = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
            const idBoxPartenzaSelezionato = this.store.selectSnapshot(BoxPartenzaState.idBoxPartenzaSelezionato);
            const boxPartenzaSelezionato = boxPartenzaList.filter(b => b.id === idBoxPartenzaSelezionato)[0];
            const richiestaComposizione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
            if (richiestaComposizione && ((boxPartenzaSelezionato && !boxPartenzaSelezionato.mezzoComposizione))) {
                dispatch(new GetListeComposizioneAvanzata());
            } else if (!richiestaComposizione) {
                dispatch(new GetListaMezziSquadre());
            }
        }
        setState(
            patch({
                idSquadreComposizioneSelezionate: removeItem(id => id === action.squadraComp.codice),
                idSquadreSelezionate: removeItem(id => id === action.squadraComp.codice)
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
    hoverOutSquadraComposizione({ getState, patchState }: StateContext<SquadreComposizioneStateStateModel>): void {
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
