import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
// Interface
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';

import {
    AddBoxPartenza,
    AddMezzoBoxPartenza,
    AddSquadraBoxPartenza, ClearBoxPartenze,
    RemoveBoxPartenza,
    RemoveMezzoBoxPartenza,
    RemoveSquadraBoxPartenza,
    SelectBoxPartenza,
    SelectPreviousBoxPartenza,
    UnselectBoxPartenza
} from '../../actions/composizione-partenza/box-partenza.actions';
import { append, patch, removeItem } from '@ngxs/store/operators';
import { makeID } from '../../../../../shared/helper/function';
import produce from 'immer';
import {
    ClearSelectedMezziComposizione,
    RemoveBookMezzoComposizione,
    SelectMezzoComposizione,
    UnselectMezzoComposizione
} from '../../actions/composizione-partenza/mezzi-composizione.actions';
import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';
import { ClearSelectedSquadreComposizione, SelectSquadraComposizione, UnselectSquadraComposizione } from '../../actions/composizione-partenza/squadre-composizione.actions';
import { CompPartenzaService } from '../../../../../core/service/comp-partenza-service/comp-partenza.service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { UtenteState } from '../../../../navbar/store/states/operatore/utente.state';


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
        const _id = makeID();
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
        dispatch(new SelectBoxPartenza(_id));
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

    @Action(SelectPreviousBoxPartenza)
    selectPreviousBoxPartenza({ getState, dispatch }: StateContext<BoxPartenzaStateModel>, action: SelectPreviousBoxPartenza) {
        const state = getState();

        let boxIndex = null;
        let previousIndex = null;
        if (state.boxPartenzaList.length > 0) {
            state.boxPartenzaList.forEach((box: BoxPartenza, index) => {
                if (box.id === action.idBoxPartenza) {
                    boxIndex = index;
                    previousIndex = index - 1;
                    dispatch(new SelectBoxPartenza(state.boxPartenzaList[previousIndex].id));
                }
            });
        }
        // console.log(action.idBoxPartenza);
    }

    @Action(UnselectBoxPartenza)
    unselectBoxPartenza({ setState }: StateContext<BoxPartenzaStateModel>, action: SelectBoxPartenza) {
        console.log(action.idBoxPartenza);
    }

    @Action(RemoveBoxPartenza)
    removeBoxPartenza({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>, action: RemoveBoxPartenza) {
        const state = getState();
        if (state.boxPartenzaList.length > 0) {
            state.boxPartenzaList.forEach((box: BoxPartenza) => {
                if (box.id === action.idBoxPartenza && box.mezzoComposizione) {
                    dispatch(new RemoveBookMezzoComposizione(box.mezzoComposizione.id));
                    if (state.idBoxPartenzaSelezionato === action.idBoxPartenza) {
                        dispatch(new UnselectMezzoComposizione(box.mezzoComposizione));
                    }
                }
                if (state.idBoxPartenzaSelezionato === action.idBoxPartenza && box.squadraComposizione.length > 0) {
                    box.squadraComposizione.forEach((squadra: SquadraComposizione) => {
                        dispatch(new UnselectSquadraComposizione(squadra));
                    });
                }
            });
        }
        setState(
            patch({
                boxPartenzaList: removeItem((item: BoxPartenza) => item.id === action.idBoxPartenza)
            })
        );
        // dispatch(new SelectPreviousBoxPartenza(action.idBoxPartenza));
        // console.log(action.idBoxPartenza);
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

    @Action(AddMezzoBoxPartenza)
    addMezzoBoxPartenza({ getState, setState, dispatch }: StateContext<BoxPartenzaStateModel>, action: AddMezzoBoxPartenza) {
        const state = getState();
        if (state.boxPartenzaList.length > 0) {
            state.boxPartenzaList.forEach((box: BoxPartenza) => {
                if (box.id === state.idBoxPartenzaSelezionato && box.mezzoComposizione) {
                    dispatch(new RemoveBookMezzoComposizione(box.mezzoComposizione.id));
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

    @Action(RemoveMezzoBoxPartenza)
    removeMezzoBoxPartenza({ getState, setState }: StateContext<BoxPartenzaStateModel>, action: RemoveMezzoBoxPartenza) {
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
