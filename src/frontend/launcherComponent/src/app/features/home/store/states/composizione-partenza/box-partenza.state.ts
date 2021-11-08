import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';
import {
    AddBoxesPartenzaInRientro,
    AddBoxesPartenzaPreAccoppiato,
    AddBoxPartenza,
    AddMezzoBoxPartenzaSelezionato,
    AddSquadreBoxPartenza,
    ClearBoxPartenze,
    DeselectBoxPartenza,
    RemoveBoxPartenza,
    RemoveBoxPartenzaByMezzoId,
    RemoveMezzoBoxPartenzaSelezionato,
    RemoveSquadraBoxPartenza,
    RequestAddBoxPartenza,
    RequestSelectBoxPartenza,
    SelectBoxPartenza,
    UpdateMezzoBoxPartenza
} from '../../actions/composizione-partenza/box-partenza.actions';
import { ClearSelectedMezziComposizione, SelectMezzoComposizione, UnselectMezzoComposizione } from '../../../../../shared/store/actions/mezzi-composizione/mezzi-composizione.actions';
import {
    ClearIdSquadreSelezionate,
    ClearSelectedSquadreComposizione,
    SelectSquadraComposizione,
    UnselectSquadraComposizione
} from '../../../../../shared/store/actions/squadre-composizione/squadre-composizione.actions';
import { append, patch, removeItem } from '@ngxs/store/operators';
import { makeID } from '../../../../../shared/helper/function-generiche';
import produce from 'immer';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { ClearDirection } from '../../../../maps/store/actions/maps-direction.actions';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';
import { Injectable } from '@angular/core';
import { GetListeComposizioneAvanzata } from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { SquadraComposizione } from '../../../../../shared/interface/squadra-composizione-interface';

export interface BoxPartenzaStateModel {
    boxPartenzaList: BoxPartenza[];
    idBoxPartenzaSelezionato: string;
}

export const BoxPartenzaStateDefaults: BoxPartenzaStateModel = {
    boxPartenzaList: [],
    idBoxPartenzaSelezionato: null
};

@Injectable()
@State<BoxPartenzaStateModel>({
    name: 'boxPartenza',
    defaults: BoxPartenzaStateDefaults
})
export class BoxPartenzaState {

    @Selector()
    static boxPartenzaList(state: BoxPartenzaStateModel): BoxPartenza[] {
        return state.boxPartenzaList;
    }

    @Selector()
    static idBoxPartenzaSelezionato(state: BoxPartenzaStateModel): string {
        return state.idBoxPartenzaSelezionato;
    }

    @Selector()
    static boxPartenzaSelezionato(state: BoxPartenzaStateModel): BoxPartenza {
        return state.boxPartenzaList.filter((boxPartenza: BoxPartenza) => boxPartenza.id === state.idBoxPartenzaSelezionato)[0];
    }

    @Selector()
    static disableConfirmPartenza(state: BoxPartenzaStateModel): boolean {
        return disableConfirmPartenza(state.boxPartenzaList);
    }

    @Selector()
    static disableNuovaPartenza(state: BoxPartenzaStateModel): boolean {
        return disableConfirmPartenza(state.boxPartenzaList, true);
    }

    constructor() {
    }

    @Action(RequestAddBoxPartenza)
    requestAddBoxPartenza({ getState, dispatch }: StateContext<BoxPartenzaStateModel>): void {
        const state = getState();
        if (validateBoxesPartenza(state.boxPartenzaList)) {
            dispatch(new AddBoxPartenza());
        } else {
            // se il box partenza attualmente selezionato non è valido mostro un messaggio di errore
            dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Impossibile continuare con la selezione richiesta.', 5));
        }
    }

    @Action(AddBoxPartenza)
    addBoxPartenza({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>): void {
        const state = getState();
        // credo un ID logico random da asseganre al box-partenza
        const id = makeID();
        // controllo se tutti i box-partenza sono validi
        if (validateBoxesPartenza(state.boxPartenzaList)) {
            // controllo se ho raggiunto il numero massimo di box-partenza (3 MAX)
            if (state.boxPartenzaList.length <= 2) {
                // creo il nuovo box partenza
                setState(
                    patch({
                        boxPartenzaList: append([
                            {
                                id,
                                mezzoComposizione: null,
                                squadreComposizione: []
                            }
                        ])
                    })
                );
                dispatch(new ClearIdSquadreSelezionate());
                // seleziono il nuovo box partenza
                dispatch(new SelectBoxPartenza(id));
            } else {
                dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Limite massimo raggiunto.', 5));
            }
        } else {
            // se il box partenza attualmente selezionato non è valido mostro un messaggio di errore
            dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Impossibile continuare con la selezione richiesta.', 5));
        }
    }

    @Action(RemoveBoxPartenza)
    removeBoxPartenza({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>, action: RemoveBoxPartenza): void {
        const state = getState();
        // controllo se il boxPartenza che sto eliminando è quello selezionato
        if (action.boxPartenza.id === state.idBoxPartenzaSelezionato) {
            // Deseleziono il mezzo selezionato se presenti nel box-partenza da eliminare
            if (action.boxPartenza.mezzoComposizione) {
                dispatch(new UnselectMezzoComposizione(true));
            }
            // Deseleziono le squadre selezionate se presenti nel box-partenza da eliminare
            if (action.boxPartenza.squadreComposizione && action.boxPartenza.squadreComposizione.length > 0) {
                action.boxPartenza.squadreComposizione.forEach((squadra: SquadraComposizione) => {
                    dispatch(new UnselectSquadraComposizione(squadra, false, true));
                });
            }
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

    @Action(DeselectBoxPartenza)
    deselectBoxPartenza({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>, action: RemoveBoxPartenza): void {
        const state = getState();
        // controllo se il boxPartenza che sto eliminando è quello selezionato
        if (action.boxPartenza.id === state.idBoxPartenzaSelezionato) {
            // Deseleziono il mezzo selezionato se presenti nel box-partenza da eliminare
            if (action.boxPartenza.mezzoComposizione) {
                dispatch(new UnselectMezzoComposizione());
            }
            // Deseleziono le squadre selezionate se presenti nel box-partenza da eliminare
            if (action.boxPartenza.squadreComposizione && action.boxPartenza.squadreComposizione.length > 0) {
                action.boxPartenza.squadreComposizione.forEach((squadra: SquadraComposizione) => {
                    dispatch(new UnselectSquadraComposizione(squadra));
                });
            }
        }
    }

    @Action(RemoveBoxPartenzaByMezzoId)
    removeBoxPartenzaByMezzoId({ getState, dispatch }: StateContext<BoxPartenzaStateModel>, action: RemoveBoxPartenzaByMezzoId): void {
        const state = getState();
        let boxPartenza: BoxPartenza;
        state.boxPartenzaList.forEach((box: BoxPartenza) => {
            if (box.mezzoComposizione && box.mezzoComposizione.mezzo.codice === action.idMezzo) {
                boxPartenza = box;
                dispatch(new RemoveBoxPartenza(boxPartenza));

                // controllo se il boxPartenza che sto eliminando è quello selezionato
                if (boxPartenza.id === state.idBoxPartenzaSelezionato) {
                    // Deseleziono il mezzo selezionato se presenti nel box-partenza da eliminare
                    if (boxPartenza.mezzoComposizione) {
                        dispatch(new UnselectMezzoComposizione());
                    }
                    // Deseleziono le squadre selezionate se presenti nel box-partenza da eliminare
                    if (boxPartenza.squadreComposizione && boxPartenza.squadreComposizione.length > 0) {
                        boxPartenza.squadreComposizione.forEach((squadra: SquadraComposizione) => {
                            dispatch(new UnselectSquadraComposizione(squadra));
                        });
                    }
                }
            }
        });
    }

    @Action(RequestSelectBoxPartenza)
    requestSelectBoxPartenza({ getState, dispatch }: StateContext<BoxPartenzaStateModel>, action: RequestSelectBoxPartenza): void {
        const state = getState();
        if (validateBoxesPartenza(state.boxPartenzaList)) {
            // prendo il box partenza selezionato tramite l'id
            const boxPartenzaSelezionato = state.boxPartenzaList.filter(x => x.id === state.idBoxPartenzaSelezionato)[0];
            if (boxPartenzaSelezionato) {
                dispatch(new SelectBoxPartenza(action.idBoxPartenza));
            }
        } else {
            // se il box partenza attualmente selezionato non è valido lo elimino prima di selezionare il box voluto
            dispatch(new RemoveBoxPartenza(state.boxPartenzaList[state.boxPartenzaList.length - 1]));
        }
    }

    @Action(SelectBoxPartenza)
    selectBoxPartenza({ getState, patchState, dispatch, setState }: StateContext<BoxPartenzaStateModel>, action: SelectBoxPartenza): void {
        const state = getState();
        dispatch(new ClearSelectedMezziComposizione());
        dispatch(new ClearSelectedSquadreComposizione());
        patchState({
            idBoxPartenzaSelezionato: action.idBoxPartenza
        });
        state.boxPartenzaList.forEach((box: BoxPartenza) => {
            if (box.id === action.idBoxPartenza) {
                console.log('boxPartenza', box);
                if (box.mezzoComposizione) {
                    dispatch(new SelectMezzoComposizione(box.mezzoComposizione, true));
                }
                if (box.squadreComposizione.length > 0) {
                    box.squadreComposizione.forEach((squadra: SquadraComposizione) => {
                        dispatch(new SelectSquadraComposizione(squadra));
                    });
                }
            }
        });
    }

    @Action(AddSquadreBoxPartenza)
    addSquadraBoxPartenza({ getState, setState }: StateContext<BoxPartenzaStateModel>, action: AddSquadreBoxPartenza): void {
        const state = getState();
        if (action.preAccoppiato) {
            setState(
                produce(state, draft => {
                    draft.boxPartenzaList.forEach((box: BoxPartenza) => {
                        if (box.id === state.idBoxPartenzaSelezionato) {
                            box.squadreComposizione = [];
                            action.squadre.forEach((squadra: SquadraComposizione) => {
                                box.squadreComposizione.push(squadra);
                            });
                        }
                    });
                })
            );
        } else {
            setState(
                produce(state, draft => {
                    draft.boxPartenzaList.forEach((box: BoxPartenza) => {
                        if (box.id === state.idBoxPartenzaSelezionato) {
                            action.squadre.forEach((squadra: SquadraComposizione) => {
                                box.squadreComposizione.push(squadra);
                            });
                        }
                    });
                })
            );
        }
    }

    @Action(RemoveSquadraBoxPartenza)
    removeSquadraBoxPartenza({ getState, setState }: StateContext<BoxPartenzaStateModel>, action: RemoveSquadraBoxPartenza): void {
        const state = getState();
        setState(
            produce(state, draft => {
                draft.boxPartenzaList.forEach((box: BoxPartenza) => {
                    if (box.id === state.idBoxPartenzaSelezionato) {
                        let index = null;
                        box.squadreComposizione.forEach((squadra: SquadraComposizione, i) => {
                            if (action.idSquadra === squadra.codice) {
                                index = i;
                            }
                        });
                        box.squadreComposizione.splice(index, 1);
                    }
                });
            })
        );
    }

    @Action(AddMezzoBoxPartenzaSelezionato)
    addMezzoBoxPartenzaSelezionato({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>, action: AddMezzoBoxPartenzaSelezionato): void {
        const state = getState();
        if (state.boxPartenzaList.length > 0) {
            state.boxPartenzaList.forEach((box: BoxPartenza) => {
                if (box.id === state.idBoxPartenzaSelezionato && box.mezzoComposizione) {
                    if (box.squadreComposizione && box.squadreComposizione.length > 0) {
                        box.squadreComposizione.forEach((squadra: SquadraComposizione) => {
                            dispatch(new RemoveSquadraBoxPartenza(squadra.codice));
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
    updateMezzoBoxPartenza({ getState, setState }: StateContext<BoxPartenzaStateModel>, action: UpdateMezzoBoxPartenza): void {
        const state = getState();
        setState(
            produce(state, draft => {
                draft.boxPartenzaList.forEach((box: BoxPartenza) => {
                    if (box && box.mezzoComposizione) {
                        // console.log('mezzoComposizione', box.mezzoComposizione);
                        if (box.mezzoComposizione && action.mezzoComp && box.mezzoComposizione.mezzo.codice === action.mezzoComp.mezzo.codice) {
                            // console.log('codiceMezzo', box.mezzoComposizione.mezzo.codice);
                            box.mezzoComposizione = action.mezzoComp;
                        }
                    }
                });
            })
        );
    }

    @Action(RemoveMezzoBoxPartenzaSelezionato)
    removeMezzoBoxPartenzaSelezionato({ getState, setState }: StateContext<BoxPartenzaStateModel>): void {
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
    clearBoxPartenze({ patchState, dispatch }: StateContext<BoxPartenzaStateModel>): void {
        dispatch(new ClearDirection());
        patchState({
            boxPartenzaList: BoxPartenzaStateDefaults.boxPartenzaList
        });
    }

    @Action(AddBoxesPartenzaInRientro)
    addBoxesPartenzaInRientro({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>, action: AddBoxesPartenzaInRientro): void {
        const state = getState();
        const idBoxPartenzaSelezionato = state.idBoxPartenzaSelezionato;
        const boxPartenzaSelezionato = state.boxPartenzaList.filter((box: BoxPartenza) => box.id === state.idBoxPartenzaSelezionato)[0];
        const squadraComp = action.squadraComp;
        if (!validateBoxPartenza(boxPartenzaSelezionato)) {
            setState(
                patch({
                    boxPartenzaList: removeItem((box: BoxPartenza) => box.id === idBoxPartenzaSelezionato)
                })
            );
        }

        const newBoxes = [];
        // creo boxes
        for (const mezzoComp of squadraComp.listaMezzi) {
            const id = makeID();
            newBoxes.push({
                id,
                mezzoComposizione: mezzoComp,
                squadreComposizione: [squadraComp]
            });
        }
        console.log('newBoxes', newBoxes);

        // creo i nuovi box partenza
        setState(
            patch({
                boxPartenzaList: append(newBoxes)
            })
        );

        dispatch([
            // new SelectBoxPartenza(newBoxes[newBoxes.length - 1].id, true),
            new SelectBoxPartenza(newBoxes[newBoxes.length - 1].id, true),
            new SelectSquadraComposizione(squadraComp),
            new SelectMezzoComposizione(newBoxes[newBoxes.length - 1].mezzoComposizione),
            new GetListeComposizioneAvanzata()
        ]);
    }

    @Action(AddBoxesPartenzaPreAccoppiato)
    addBoxesPartenzaPreAccoppiato({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>, action: AddBoxesPartenzaPreAccoppiato): void {
        const state = getState();
        const idBoxPartenzaSelezionato = state.idBoxPartenzaSelezionato;
        const boxPartenzaSelezionato = state.boxPartenzaList.filter((box: BoxPartenza) => box.id === state.idBoxPartenzaSelezionato)[0];
        const squadraComp = action.squadraComp;

        let skip = false;
        // controllo se il mezzo pre accoppiato è gia presente in un box lista partenza
        state.boxPartenzaList.forEach(x => x.mezzoComposizione?.id === squadraComp.mezziPreaccoppiati[0].mezzo.codice ? skip = true : null);
        if (!skip) {
            if (!validateBoxPartenza(boxPartenzaSelezionato)) {
                setState(
                    patch({
                        boxPartenzaList: removeItem((box: BoxPartenza) => box.id === idBoxPartenzaSelezionato)
                    })
                );
            }

            const newBoxes = [];
            // creo boxes
            for (const mezzoComp of [squadraComp.mezziPreaccoppiati[0]]) {
                const id = makeID();
                newBoxes.push({
                    id,
                    mezzoComposizione: mezzoComp,
                    squadreComposizione: [squadraComp]
                });
            }
            console.log('newBoxes', newBoxes);

            // creo i nuovi box partenza
            setState(
                patch({
                    boxPartenzaList: append(newBoxes)
                })
            );

            dispatch([
                new SelectBoxPartenza(newBoxes[newBoxes.length - 1].id, false, true),
                new GetListeComposizioneAvanzata(null, false, false, true)
            ]);
        }
    }
}

export function validateBoxPartenza(boxPartenza: BoxPartenza): boolean {
    let valid = false;
    if (boxPartenza) {
        if (boxPartenza.mezzoComposizione && boxPartenza.squadreComposizione?.length > 0) {
            valid = true;
        }
    }
    return valid;
}

export function validateBoxesPartenza(boxPartenzaList: BoxPartenza[]): boolean {
    let valid = false;
    let boxValidiCount = 0;
    if (boxPartenzaList.length > 0) {
        boxPartenzaList.forEach((box: BoxPartenza) => {
            if (box.squadreComposizione && box.squadreComposizione.length > 0) {
                boxValidiCount++;
            }
        });

        valid = boxValidiCount === boxPartenzaList.length;
    } else if (boxPartenzaList.length <= 0) {
        valid = true;
    }
    return valid;
}

export function disableConfirmPartenza(boxPartenzaList: BoxPartenza[], nuovaPartenza?: boolean): boolean {
    if (nuovaPartenza) {
        if (boxPartenzaList && boxPartenzaList.length === 0) {
            return false;
        }
    }
    if (boxPartenzaList && boxPartenzaList.length > 0) {
        let boxValidiCount = 0;
        for (const boxPartenza of boxPartenzaList) {
            if (boxPartenza.mezzoComposizione && (boxPartenza.mezzoComposizione.mezzo.stato === StatoMezzo.InRientro || boxPartenza.mezzoComposizione.mezzo.stato === StatoMezzo.InSede) && boxPartenza.squadreComposizione && boxPartenza.squadreComposizione.length > 0) {
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
