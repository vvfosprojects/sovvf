import { Action, Selector, State, StateContext } from '@ngxs/store';
// Interface
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';

import {
    AddBoxPartenza,
    AddMezzoBoxPartenzaSelezionato,
    AddSquadraBoxPartenza, ClearBoxPartenze,
    RemoveBoxPartenza, RemoveBoxPartenzaByMezzoId, RemoveMezzoBoxPartenzaSelezionato,
    RemoveSquadraBoxPartenza, RequestAddBoxPartenza, RequestSelectBoxPartenza,
    SelectBoxPartenza, UpdateMezzoBoxPartenza
} from '../../actions/composizione-partenza/box-partenza.actions';
import { append, patch, removeItem } from '@ngxs/store/operators';
import { makeID } from '../../../../../shared/helper/function';
import produce from 'immer';
import {
    ClearSelectedMezziComposizione,
    RequestBookMezzoComposizione, RequestRemoveBookMezzoComposizione, SelectMezzoComposizione, UnselectMezzoComposizione
} from '../../actions/composizione-partenza/mezzi-composizione.actions';
import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';
import { ClearSelectedSquadreComposizione, SelectSquadraComposizione, UnselectSquadraComposizione } from '../../actions/composizione-partenza/squadre-composizione.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { GetListeComposizioneAvanzata } from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { ClearDirection } from '../../actions/maps/maps-direction.actions';


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

    @Selector()
    static disableConfirmPartenza(state: BoxPartenzaStateModel) {
        return _disableConfirmPartenza(state.boxPartenzaList);
    }

    @Selector()
    static disableNuovaPartenza(state: BoxPartenzaStateModel) {
        return _disableConfirmPartenza(state.boxPartenzaList, true);
    }

    constructor() {
    }

    @Action(RequestAddBoxPartenza)
    requestAddBoxPartenza({ getState, dispatch }: StateContext<BoxPartenzaStateModel>) {
        const state = getState();
        if (validateBoxPartenza(state.boxPartenzaList)) {
            if (state.boxPartenzaList.length <= 0) {
                dispatch(new AddBoxPartenza());
            } else {
                // prendo il box partenza selezionato tramite l'id
                const boxPartenzaSelezionato = state.boxPartenzaList.filter(x => x.id === state.idBoxPartenzaSelezionato)[0];
                // se il box partenza attualmente selezionato ha un mezzo lo prenoto
                if (boxPartenzaSelezionato && boxPartenzaSelezionato.mezzoComposizione && !boxPartenzaSelezionato.mezzoComposizione.istanteScadenzaSelezione) {
                    const mezzoComp = boxPartenzaSelezionato.mezzoComposizione;
                    dispatch(new RequestBookMezzoComposizione(mezzoComp, true, null));
                } else if (boxPartenzaSelezionato) {
                    dispatch(new AddBoxPartenza());
                }
                dispatch(new GetListeComposizioneAvanzata());
            }
        } else {
            // se il box partenza attualmente selezionato non è valido mostro un messaggio di errore
            dispatch(new ShowToastr(ToastrType.Error, 'Errore Aggiungi Partenza', 'La partenza attuale non è valida, impossibile creare una nuova partenza.', 5));
        }
    }

    @Action(AddBoxPartenza)
    addBoxPartenza({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>) {
        const state = getState();
        // credo un ID logico random da asseganre al box-partenza
        const _id = makeID();
        // controllo se tutti i box-partenza sono validi
        if (validateBoxPartenza(state.boxPartenzaList)) {
            // controllo se ho raggiunto il numero massimo di box-partenza (3 MAX)
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
        // Deseleziono il mezzo selezionato
        if (action.boxPartenza.mezzoComposizione) {
            dispatch(new UnselectMezzoComposizione());
        }
        // Deseleziono le squadre selezionate
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
        dispatch(new ClearDirection());
        // rimuovo il box dalla lista
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
                dispatch(new UnselectMezzoComposizione());
                boxPartenza.squadraComposizione.forEach((squadraComp: SquadraComposizione) => {
                    dispatch(new UnselectSquadraComposizione(squadraComp));
                });
            }
        });
    }

    @Action(RequestSelectBoxPartenza)
    requestSelectBoxPartenza({ getState, dispatch }: StateContext<BoxPartenzaStateModel>, action: RequestSelectBoxPartenza) {
        const state = getState();
        if (validateBoxPartenza(state.boxPartenzaList)) {
            // prendo il box partenza selezionato tramite l'id
            const boxPartenzaSelezionato = state.boxPartenzaList.filter(x => x.id === state.idBoxPartenzaSelezionato)[0];
            // se il box partenza attualmente selezionato ha un mezzo lo prenoto
            if (boxPartenzaSelezionato && boxPartenzaSelezionato.mezzoComposizione && !boxPartenzaSelezionato.mezzoComposizione.istanteScadenzaSelezione) {
                const mezzoComp = boxPartenzaSelezionato.mezzoComposizione;
                dispatch(new RequestBookMezzoComposizione(mezzoComp, false, action.idBoxPartenza));
            } else if (boxPartenzaSelezionato) {
                dispatch(new SelectBoxPartenza(action.idBoxPartenza));
            }
        } else {
            // se il box partenza attualmente selezionato non è valido lo elimino prima di selezionare il box voluto
            dispatch(new RemoveBoxPartenza(state.boxPartenzaList[state.boxPartenzaList.length - 1]));
            // se il box partenza attualmente selezionato non è valido mostro un messaggio di errore
            // dispatch(new ShowToastr(ToastrType.Error, 'Errore Selezione Partenza', 'La partenza attuale non è valida, impossibile selezionare una nuova partenza.', 5));
        }
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
        dispatch(new GetListeComposizioneAvanzata());
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
    }

    @Action(AddMezzoBoxPartenzaSelezionato)
    addMezzoBoxPartenzaSelezionato({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>, action: AddMezzoBoxPartenzaSelezionato) {
        const state = getState();
        if (state.boxPartenzaList.length > 0) {
            state.boxPartenzaList.forEach((box: BoxPartenza) => {
                if (box.id === state.idBoxPartenzaSelezionato && box.mezzoComposizione && box.mezzoComposizione.istanteScadenzaSelezione) {
                    dispatch(new RequestRemoveBookMezzoComposizione(box.mezzoComposizione));
                    if (box.squadraComposizione && box.squadraComposizione.length > 0) {
                        box.squadraComposizione.forEach((squadra: SquadraComposizione) => {
                            dispatch(new RemoveSquadraBoxPartenza(squadra.id));
                            dispatch(new UnselectSquadraComposizione(squadra));
                        });
                    }
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
    }

    @Action(UpdateMezzoBoxPartenza)
    updateMezzoBoxPartenza({ getState, setState }: StateContext<BoxPartenzaStateModel>, action: UpdateMezzoBoxPartenza) {
        const state = getState();
        setState(
            produce(state, draft => {
                draft.boxPartenzaList.forEach((box: BoxPartenza) => {
                    if (box.mezzoComposizione && box.mezzoComposizione.mezzo.codice === action.mezzoComp.mezzo.codice) {
                        box.mezzoComposizione = action.mezzoComp;
                    }
                });
            })
        );
    }

    @Action(RemoveMezzoBoxPartenzaSelezionato)
    removeMezzoBoxPartenzaSelezionato({ getState, setState }: StateContext<BoxPartenzaStateModel>) {
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
    }

    @Action(ClearBoxPartenze)
    clearBoxPartenze({ patchState, dispatch }: StateContext<BoxPartenzaStateModel>) {
        dispatch(new ClearDirection());
        patchState({
            boxPartenzaList: BoxPartenzaStateDefaults.boxPartenzaList
        });
    }
}

export function validateBoxPartenza(boxPartenzaList: BoxPartenza[]) {
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

export function _disableConfirmPartenza(boxPartenzaList: BoxPartenza[], nuovaPartenza?: boolean) {
    if (nuovaPartenza) {
        if (boxPartenzaList && boxPartenzaList.length === 0) {
            return false;
        }
    }
    if (boxPartenzaList && boxPartenzaList.length > 0) {
        let boxValidiCount = 0;
        for (const boxPartenza of boxPartenzaList) {
            if (boxPartenza.squadraComposizione && boxPartenza.squadraComposizione.length > 0) {
                boxValidiCount++;
            }
        }
        // console.log(`Box partenza: ${boxPartenzaList.length} di cui validi ${boxValidiCount}`);
        if (boxPartenzaList.length === boxValidiCount) {
            return false;
        }
    }
    return true;
}
