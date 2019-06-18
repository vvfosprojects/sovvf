import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
// Interface
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';

import {
    AddBoxPartenza,
    AddMezzoBoxPartenzaSelezionato,
    AddSquadraBoxPartenza, ClearBoxPartenze,
    RemoveBoxPartenza, RemoveBoxPartenzaByMezzoId, RemoveMezzoBoxPartenzaSelezionato,
    RemoveSquadraBoxPartenza,
    SelectBoxPartenza, UnselectBoxPartenza
} from '../../actions/composizione-partenza/box-partenza.actions';
import { append, patch, removeItem } from '@ngxs/store/operators';
import { makeID } from '../../../../../shared/helper/function';
import produce from 'immer';
import {
    ClearSelectedMezziComposizione,
    RemoveBookMezzoComposizione, RequestBookMezzoComposizione, RequestRemoveBookMezzoComposizione,
    SelectMezzoComposizione, UnselectMezzoComposizione
} from '../../actions/composizione-partenza/mezzi-composizione.actions';
import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';
import { ClearSelectedSquadreComposizione, SelectSquadraComposizione, UnselectSquadraComposizione } from '../../actions/composizione-partenza/squadre-composizione.actions';
import { CompPartenzaService } from '../../../../../core/service/comp-partenza-service/comp-partenza.service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';


export interface BoxPartenzaStateModel {
    boxPartenzaList: BoxPartenza[];
    idBoxPartenzaSelezionato: string;
}

export const BoxPartenzaStateDefaults: BoxPartenzaStateModel = {
    boxPartenzaList: [],
    idBoxPartenzaSelezionato: null
};

@State<BoxPartenzaStateModel>({
    name: 'boxPartenza',
    defaults: BoxPartenzaStateDefaults
})
export class BoxPartenzaState {

    @Selector()
    static boxPartenzaList(state: BoxPartenzaStateModel) {
        return state.boxPartenzaList;
    }

    @Selector()
    static idBoxPartenzaSelezionato(state: BoxPartenzaStateModel) {
        return state.idBoxPartenzaSelezionato;
    }

    constructor(private _compPartenzaService: CompPartenzaService,
                private store: Store) {
    }

    @Action(AddBoxPartenza)
    addBoxPartenza({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>) {
        const state = getState();
        const _id = makeID();
        if (validateBoxPartenza(state.idBoxPartenzaSelezionato, state.boxPartenzaList)) {
            // prendo il box partenza selezionato tramite l'id
            const boxPartenzaSelezionato = state.boxPartenzaList.filter(x => x.id === state.idBoxPartenzaSelezionato)[0];
            // se il box partenza attualmente selezionato ha un mezzo lo prenoto
            if (boxPartenzaSelezionato && boxPartenzaSelezionato.mezzoComposizione) {
                const mezzoComp = boxPartenzaSelezionato.mezzoComposizione;
                dispatch(new RequestBookMezzoComposizione(mezzoComp));
            }
            if (state.boxPartenzaList.length <= 2) {
                // creo il nuovo box partenza
                setState(
                    patch({
                        boxPartenzaList: append([
                            {
                                id: _id,
                                mezzoComposizione: null,
                                squadraComposizione: []
                            }
                        ])
                    })
                );
                // seleziono il nuovo box partenza
                dispatch(new SelectBoxPartenza(_id));
            } else {
                dispatch(new ShowToastr(ToastrType.Error, 'Errore Aggiungi Partenza', 'Raggiunto il numero massimo di partenze.', 5));
            }
        } else {
            // se il box partenza attualmente selezionato non è valido mostro un messaggio di errore
            dispatch(new ShowToastr(ToastrType.Error, 'Errore Aggiungi Partenza', 'La partenza attuale non è valida, impossibile creare una nuova partenza.', 5));
        }
    }

    @Action(RemoveBoxPartenza)
    removeBoxPartenza({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>, action: RemoveBoxPartenza) {
        const state = getState();
        if (action.boxPartenza.mezzoComposizione) {
            const mezzoComp = action.boxPartenza.mezzoComposizione;
            this.store.dispatch(new RequestRemoveBookMezzoComposizione(mezzoComp));
            if (state.idBoxPartenzaSelezionato === action.boxPartenza.id) {
                dispatch(new UnselectMezzoComposizione(mezzoComp));
            }
        }

        if (action.boxPartenza.squadraComposizione) {
            action.boxPartenza.squadraComposizione.forEach((squadra: SquadraComposizione) => {
                dispatch(new UnselectSquadraComposizione(squadra));
            });
        }

        // Seleziono il box precedente
        if (state.boxPartenzaList.length > 1 && state.idBoxPartenzaSelezionato === action.boxPartenza.id) {
            let prevIndex = null;
            let prevIdBox = null;
            state.boxPartenzaList.forEach((box: BoxPartenza, index) => {
                if (box.id === action.boxPartenza.id) {
                    prevIndex = index - 1;
                    if (state.boxPartenzaList[prevIndex] && prevIndex > -1) {
                        prevIdBox = state.boxPartenzaList[prevIndex].id;
                        dispatch(new SelectBoxPartenza(prevIdBox));
                    } else {
                        prevIdBox = state.boxPartenzaList[state.boxPartenzaList.length - 1].id;
                        dispatch(new SelectBoxPartenza(prevIdBox));
                    }
                }
            });
        }
        setState(
            patch({
                boxPartenzaList: removeItem((item: BoxPartenza) => item.id === action.boxPartenza.id)
            })
        );
    }

    @Action(RemoveBoxPartenzaByMezzoId)
    removeBoxPartenzaByMezzoId({ getState, dispatch }: StateContext<BoxPartenzaStateModel>, action: RemoveBoxPartenzaByMezzoId) {
        const state = getState();
        let boxPartenza: BoxPartenza;
        state.boxPartenzaList.forEach((box: BoxPartenza) => {
            if (box.mezzoComposizione && box.mezzoComposizione.mezzo.codice === action.idMezzo) {
                boxPartenza = box;
                dispatch(new RemoveBoxPartenza(boxPartenza));
            }
        });
        // console.log(action.idMezzo);
    }

    @Action(SelectBoxPartenza)
    selectBoxPartenza({ getState, patchState, dispatch, setState }: StateContext<BoxPartenzaStateModel>, action: SelectBoxPartenza) {
        const state = getState();
        dispatch(new ClearSelectedMezziComposizione());
        dispatch(new ClearSelectedSquadreComposizione());
        patchState({
            idBoxPartenzaSelezionato: action.idBoxPartenza
        });
        state.boxPartenzaList.forEach((box: BoxPartenza) => {
            if (box.id === action.idBoxPartenza) {
                if (box.mezzoComposizione) {
                    dispatch(new SelectMezzoComposizione(box.mezzoComposizione));
                }
                if (box.squadraComposizione.length > 0) {
                    box.squadraComposizione.forEach((squadra: SquadraComposizione) => {
                        dispatch(new SelectSquadraComposizione(squadra));
                    });
                }
            }
        });
        // console.log(action.idBoxPartenza);
    }

    @Action(UnselectBoxPartenza)
    unselectBoxPartenza({ setState }: StateContext<BoxPartenzaStateModel>, action: SelectBoxPartenza) {
        console.log(action.idBoxPartenza);
    }

    @Action(AddSquadraBoxPartenza)
    addSquadraBoxPartenza({ getState, setState }: StateContext<BoxPartenzaStateModel>, action: AddSquadraBoxPartenza) {
        const state = getState();
        setState(
            produce(state, draft => {
                draft.boxPartenzaList.forEach((box: BoxPartenza) => {
                    if (box.id === state.idBoxPartenzaSelezionato) {
                        box.squadraComposizione.push(action.squadra);
                    }
                });
            })
        );
        // console.log(action.squadra);
    }

    @Action(RemoveSquadraBoxPartenza)
    removeSquadraBoxPartenza({ getState, setState }: StateContext<BoxPartenzaStateModel>, action: RemoveSquadraBoxPartenza) {
        const state = getState();
        setState(
            produce(state, draft => {
                draft.boxPartenzaList.forEach((box: BoxPartenza) => {
                    if (box.id === state.idBoxPartenzaSelezionato) {
                        let index = null;
                        box.squadraComposizione.forEach((squadra: SquadraComposizione, i) => {
                            if (action.idSquadra === squadra.id) {
                                index = i;
                            }
                        });
                        box.squadraComposizione.splice(index, 1);
                    }
                });
            })
        );
        // console.log(action.idSquadra);
    }

    @Action(AddMezzoBoxPartenzaSelezionato)
    addMezzoBoxPartenzaSelezionato({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>, action: AddMezzoBoxPartenzaSelezionato) {
        const state = getState();
        if (state.boxPartenzaList.length > 0) {
            state.boxPartenzaList.forEach((box: BoxPartenza) => {
                if (box.id === state.idBoxPartenzaSelezionato && box.mezzoComposizione) {
                    dispatch(new RemoveBookMezzoComposizione(box.mezzoComposizione));
                }
            });
        }
        setState(
            produce(state, draft => {
                draft.boxPartenzaList.forEach((box: BoxPartenza) => {
                    if (box.id === state.idBoxPartenzaSelezionato) {
                        box.mezzoComposizione = action.mezzo;
                    }
                });
            })
        );
        // console.log(action.mezzo);
    }

    @Action(RemoveMezzoBoxPartenzaSelezionato)
    removeMezzoBoxPartenzaSelezionato({ getState, setState }: StateContext<BoxPartenzaStateModel>, action: RemoveMezzoBoxPartenzaSelezionato) {
        const state = getState();
        setState(
            produce(state, draft => {
                draft.boxPartenzaList.forEach((box: BoxPartenza) => {
                    if (box.id === state.idBoxPartenzaSelezionato) {
                        box.mezzoComposizione = null;
                    }
                });
            })
        );
        // console.log(action.idMezzo);
    }

    @Action(ClearBoxPartenze)
    clearBoxPartenze({ patchState }: StateContext<BoxPartenzaStateModel>) {
        patchState({
            boxPartenzaList: BoxPartenzaStateDefaults.boxPartenzaList
        });
        // console.log(action.idMezzo);
    }
}

export function validateBoxPartenza(idBoxPartenzaSelezionato: string, boxPartenzaList: BoxPartenza[]) {
    let _return = false;
    let boxValidiCount = 0;
    if (boxPartenzaList.length > 0) {
        boxPartenzaList.forEach((box: BoxPartenza) => {
            if (box.squadraComposizione && box.squadraComposizione.length > 0) {
                boxValidiCount++;
            }
        });

        _return = boxValidiCount === boxPartenzaList.length;
    } else if (boxPartenzaList.length <= 0) {
        _return = true;
    }
    return _return;
}
