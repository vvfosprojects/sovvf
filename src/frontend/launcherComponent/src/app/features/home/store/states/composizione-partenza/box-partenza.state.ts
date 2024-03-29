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
import { ClearIdSquadreSelezionate, ClearSelectedSquadreComposizione, SelectSquadraComposizione, UnselectSquadraComposizione } from '../../../../../shared/store/actions/squadre-composizione/squadre-composizione.actions';
import { append, patch, removeItem } from '@ngxs/store/operators';
import { makeID } from '../../../../../shared/helper/function-generiche';
import produce from 'immer';
import { ClearDirection } from '../../../../maps/store/actions/maps-direction.actions';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';
import { Injectable } from '@angular/core';
import { GetListeComposizioneAvanzata } from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { SquadraComposizione } from '../../../../../shared/interface/squadra-composizione-interface';
import { AddConcorrenza, DeleteConcorrenza } from '../../../../../shared/store/actions/concorrenza/concorrenza.actions';
import { AddConcorrenzaDtoInterface } from '../../../../../shared/interface/dto/concorrenza/add-concorrenza-dto.interface';
import { TipoConcorrenzaEnum } from '../../../../../shared/enum/tipo-concorrenza.enum';

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

    @Action(RequestAddBoxPartenza)
    requestAddBoxPartenza({ getState, dispatch }: StateContext<BoxPartenzaStateModel>): void {
        const state = getState();
        if (validateBoxesPartenza(state.boxPartenzaList)) {
            dispatch(new AddBoxPartenza());
        }
    }

    @Action(AddBoxPartenza)
    addBoxPartenza({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>): void {
        const state = getState();
        // credo un ID logico random da asseganre al box-partenza
        const id = makeID();
        // controllo se tutti i box-partenza sono validi
        if (validateBoxesPartenza(state.boxPartenzaList)) {
            // controllo se ho raggiunto il numero massimo di box-partenza (2 MAX)
            if (state.boxPartenzaList.length < 2) {
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
            }
        }
    }

    @Action(RemoveBoxPartenza)
    removeBoxPartenza({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>, action: RemoveBoxPartenza): void {
        const state = getState();
        const boxPartenza = action.boxPartenza;
        if (boxPartenza.mezzoComposizione) {
            dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Mezzo, [boxPartenza.mezzoComposizione.mezzo.codice]));
        }
        if (boxPartenza.squadreComposizione?.length > 0) {
            const idSquadre = [] as string[];
            boxPartenza.squadreComposizione.forEach((squadra: SquadraComposizione) => {
                const squadraCountInBoxes = state.boxPartenzaList.filter((b: BoxPartenza) => b.squadreComposizione.map((sC: SquadraComposizione) => sC.idSquadra).includes(squadra.idSquadra))?.length;
                if (squadraCountInBoxes <= 1) {
                    idSquadre.push(squadra.idSquadra);
                }
            });
            dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Squadra, idSquadre));
        }
        // controllo se il boxPartenza che sto eliminando è quello selezionato
        if (boxPartenza.id === state.idBoxPartenzaSelezionato) {
            // Deseleziono il mezzo selezionato se presenti nel box-partenza da eliminare
            if (boxPartenza.mezzoComposizione) {
                dispatch(new UnselectMezzoComposizione(true));
            }
            // Deseleziono le squadre selezionate se presenti nel box-partenza da eliminare
            if (boxPartenza.squadreComposizione && boxPartenza.squadreComposizione.length > 0) {
                boxPartenza.squadreComposizione.forEach((squadra: SquadraComposizione) => {
                    dispatch(new UnselectSquadraComposizione(squadra, false, true));
                });
            }
        }
        // Seleziono il box precedente
        if (state.boxPartenzaList.length > 1 && state.idBoxPartenzaSelezionato === boxPartenza.id) {
            let prevIndex = null;
            let prevIdBox = null;
            state.boxPartenzaList.forEach((box: BoxPartenza, index) => {
                if (box.id === boxPartenza.id) {
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
                boxPartenzaList: removeItem((item: BoxPartenza) => item.id === boxPartenza.id)
            })
        );
    }

    @Action(DeselectBoxPartenza)
    deselectBoxPartenza({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>, action: RemoveBoxPartenza): void {
        const state = getState();
        const boxPartenza = action.boxPartenza;
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
                        dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Mezzo, [boxPartenza.mezzoComposizione.mezzo.codice]));
                        dispatch(new UnselectMezzoComposizione());
                    }
                    // Deseleziono le squadre selezionate se presenti nel box-partenza da eliminare
                    if (boxPartenza.squadreComposizione && boxPartenza.squadreComposizione.length > 0) {
                        boxPartenza.squadreComposizione.forEach((squadra: SquadraComposizione) => {
                            dispatch(new UnselectSquadraComposizione(squadra));
                        });
                        const idSquadre = boxPartenza.squadreComposizione.map((sC: SquadraComposizione) => sC.idSquadra);
                        dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Squadra, idSquadre));
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
                if (box.mezzoComposizione) {
                    dispatch(new SelectMezzoComposizione(box.mezzoComposizione, true));
                }
                if (box.squadreComposizione.length > 0) {
                    box.squadreComposizione.forEach((squadra: SquadraComposizione) => {
                        dispatch(new SelectSquadraComposizione(squadra, false, true));
                    });
                }
            }
        });
    }

    @Action(AddSquadreBoxPartenza)
    addSquadraBoxPartenza({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>, action: AddSquadreBoxPartenza): void {
        const state = getState();
        const boxPartenzaList = state.boxPartenzaList;
        const idSquadreBoxPartenzaList = boxPartenzaList?.map((b: BoxPartenza) => b.squadreComposizione.map((sC: SquadraComposizione) => sC.idSquadra)[0]);
        if (action.preAccoppiato) {
            setState(
                produce(state, draft => {
                    draft.boxPartenzaList.forEach((box: BoxPartenza) => {
                        if (box.id === state.idBoxPartenzaSelezionato) {
                            box.squadreComposizione = [];
                            const dataList = [] as AddConcorrenzaDtoInterface[];
                            action.squadre.forEach((squadra: SquadraComposizione) => {
                                if (!idSquadreBoxPartenzaList.includes(squadra.idSquadra)) {
                                    const data = {
                                        type: TipoConcorrenzaEnum.Squadra,
                                        value: squadra.idSquadra
                                    } as AddConcorrenzaDtoInterface;
                                    dataList.push(data);
                                }
                                box.squadreComposizione.push(squadra);
                            });
                            dispatch(new AddConcorrenza(dataList));
                        }
                    });
                })
            );
        } else {
            setState(
                produce(state, draft => {
                    draft.boxPartenzaList.forEach((box: BoxPartenza) => {
                        if (box.id === state.idBoxPartenzaSelezionato) {
                            const dataList = [] as AddConcorrenzaDtoInterface[];
                            action.squadre.forEach((squadra: SquadraComposizione) => {
                                if (!idSquadreBoxPartenzaList.includes(squadra.idSquadra)) {
                                    const data = {
                                        type: TipoConcorrenzaEnum.Squadra,
                                        value: squadra.idSquadra
                                    } as AddConcorrenzaDtoInterface;
                                    dataList.push(data);
                                }
                                box.squadreComposizione.push(squadra);
                            });
                            dispatch(new AddConcorrenza(dataList));
                        }
                    });
                })
            );
        }
    }

    @Action(RemoveSquadraBoxPartenza)
    removeSquadraBoxPartenza({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>, action: RemoveSquadraBoxPartenza): void {
        const state = getState();
        setState(
            produce(state, draft => {
                draft.boxPartenzaList.forEach((box: BoxPartenza) => {
                    if (box.id === state.idBoxPartenzaSelezionato) {
                        let index = null;
                        const idSquadre = [] as string[];
                        box.squadreComposizione.forEach((squadra: SquadraComposizione, i) => {
                            if (action.idSquadra === squadra.idSquadra) {
                                idSquadre.push(squadra.idSquadra);
                                index = i;
                            }
                        });
                        dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Squadra, idSquadre));
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
                            dispatch(new RemoveSquadraBoxPartenza(squadra.idSquadra));
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
                        const data = {
                            type: TipoConcorrenzaEnum.Mezzo,
                            value: action.mezzo.mezzo.codice
                        } as AddConcorrenzaDtoInterface;
                        dispatch(new AddConcorrenza([data]));
                        if (box.mezzoComposizione) {
                            dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Mezzo, [box.mezzoComposizione.mezzo.codice]));
                        }
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
                        if (box.mezzoComposizione && action.mezzoComp && box.mezzoComposizione.mezzo.codice === action.mezzoComp.mezzo.codice) {
                            box.mezzoComposizione = action.mezzoComp;
                        }
                    }
                });
            })
        );
    }

    @Action(RemoveMezzoBoxPartenzaSelezionato)
    removeMezzoBoxPartenzaSelezionato({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>): void {
        const state = getState();
        setState(
            produce(state, draft => {
                draft.boxPartenzaList.forEach((box: BoxPartenza) => {
                    if (box.id === state.idBoxPartenzaSelezionato) {
                        if (box.mezzoComposizione) {
                            dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Mezzo, [box.mezzoComposizione.mezzo.codice]));
                        }
                        box.mezzoComposizione = null;
                    }
                });
            })
        );
    }

    @Action(ClearBoxPartenze)
    clearBoxPartenze({ getState, patchState, dispatch }: StateContext<BoxPartenzaStateModel>): void {
        const state = getState();
        const boxPartenzaList = state.boxPartenzaList;
        boxPartenzaList.forEach((b: BoxPartenza) => {
            if (b.mezzoComposizione) {
                dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Mezzo, [b.mezzoComposizione.mezzo.codice]));
            }
            if (b.squadreComposizione) {
                const idSquadre = b.squadreComposizione.map((sC: SquadraComposizione) => sC.idSquadra);
                dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Squadra, idSquadre));
            }
        });
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
        // controllo se ho raggiunto il numero massimo di box-partenza (2 MAX)
        if (state.boxPartenzaList.length < 2) {
            const newBoxes = [];
            // creo boxes
            for (const mezzoComp of squadraComp.mezziInRientro) {
                const id = makeID();
                newBoxes.push({
                    id,
                    mezzoComposizione: mezzoComp,
                    squadreComposizione: [squadraComp]
                });
            }
            const data = {
                type: TipoConcorrenzaEnum.Mezzo,
                value: squadraComp.mezziInRientro[0].mezzo.codice
            } as AddConcorrenzaDtoInterface;
            dispatch(new AddConcorrenza([data]));

            // creo i nuovi box partenza
            setState(
                patch({
                    boxPartenzaList: append(newBoxes)
                })
            );

            dispatch([
                new SelectBoxPartenza(newBoxes[newBoxes.length - 1].id, true),
                new SelectSquadraComposizione(squadraComp),
                new SelectMezzoComposizione(newBoxes[newBoxes.length - 1].mezzoComposizione),
                new GetListeComposizioneAvanzata()
            ]);
        }
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
            const data = {
                type: TipoConcorrenzaEnum.Mezzo,
                value: squadraComp.mezziPreaccoppiati[0].mezzo.codice
            } as AddConcorrenzaDtoInterface;
            dispatch(new AddConcorrenza([data]));

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
            if ((boxPartenza.mezzoComposizione?.mezzo?.stato === StatoMezzo.InRientro || boxPartenza.mezzoComposizione?.mezzo?.stato === StatoMezzo.InSede) && boxPartenza.squadreComposizione?.length) {
                boxValidiCount++;
            }
        }
        if (boxPartenzaList.length === boxValidiCount) {
            return false;
        }
    }
    return true;
}
