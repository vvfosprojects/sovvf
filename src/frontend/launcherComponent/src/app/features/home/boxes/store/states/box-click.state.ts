import { Action, Selector, State, StateContext } from '@ngxs/store';
import { makeCopy } from '../../../../../shared/helper/function';

// Interface
import { BoxClickInterface } from '../../box-interface/box-click-interface';

// Action
import {
    InitBoxFiltri, UpdateBoxRichieste, AllFalseBoxRichieste, UpdateBoxMezzi,
    AllFalseBoxMezzi, ReducerBoxClick, ResetAllBoxes, AllTrueBoxRichieste, AllTrueBoxMezzi
} from '../actions/box-click.actions';


export interface BoxClickStateModel {
    boxClick: BoxClickInterface;
}

export const boxClickStateDefaults: BoxClickStateModel = {
    boxClick: {
        richieste: {
            chiamate: false,
            assegnati: false,
            sospesi: false,
            presidiati: false,
            chiusi: false
        },
        mezzi: {
            inSede: false,
            inRientro: false,
            inViaggio: false,
            sulPosto: false,
            istituto: false
        }
    }
};

@State<BoxClickStateModel>({
    name: 'boxClick',
    defaults: boxClickStateDefaults
})
export class BoxClickState {

    constructor() {
    }

    // SELECTORS
    @Selector()
    static boxClick(state: BoxClickStateModel) {
        return state.boxClick;
    }

    // REDUCER
    @Action(ReducerBoxClick)
    reducer({ dispatch }: StateContext<BoxClickStateModel>, action: ReducerBoxClick) {
        switch (action.cat) {
            case 'richieste':
                if (action.tipo === 'tutti') {
                    dispatch(new AllFalseBoxRichieste);
                } else {
                    dispatch(new UpdateBoxRichieste(action.tipo));
                }
                break;
            case 'mezzi':
                if (action.tipo === 'tutti') {
                    dispatch(new AllFalseBoxMezzi);
                } else {
                    dispatch(new UpdateBoxMezzi(action.tipo));
                }
                break;
        }
    }

    // INIZIALIZZAZIONE
    @Action(InitBoxFiltri)
    initBoxClick({ getState, patchState }: StateContext<BoxClickStateModel>) {
        const state = getState();

        patchState({
            ...state,
            boxClick: {
                richieste: {
                    chiamate: false,
                    assegnati: false,
                    sospesi: false,
                    presidiati: false,
                    chiusi: false
                },
                mezzi: {
                    inSede: false,
                    inRientro: false,
                    inViaggio: false,
                    sulPosto: false,
                    istituto: false
                }
            }
        });
    }

    // RICHIESTE
    @Action(UpdateBoxRichieste)
    updateBoxRichieste({ getState, patchState }: StateContext<BoxClickStateModel>, action: UpdateBoxRichieste) {
        const state = getState();

        patchState({
            ...state,
            boxClick: update(makeCopy(state.boxClick), 'richieste', action.tipo)
        });
    }

    @Action(AllTrueBoxRichieste)
    allTrueBoxRichieste({ getState, patchState }: StateContext<BoxClickStateModel>) {
        const state = getState();

        patchState({
            ...state,
            boxClick: allTrue(makeCopy(state.boxClick), 'richieste')
        });
    }

    @Action(AllFalseBoxRichieste)
    resetBoxRichieste({ getState, patchState }: StateContext<BoxClickStateModel>) {
        const state = getState();

        patchState({
            ...state,
            boxClick: allFalse(makeCopy(state.boxClick), 'richieste')
        });
    }

    // MEZZI
    @Action(UpdateBoxMezzi)
    updateBoxMezzi({ getState, patchState }: StateContext<BoxClickStateModel>, action: UpdateBoxMezzi) {
        const state = getState();

        patchState({
            ...state,
            boxClick: update(makeCopy(state.boxClick), 'mezzi', action.tipo)
        });
    }

    @Action(AllTrueBoxMezzi)
    allTrueBoxMezzi({ getState, patchState }: StateContext<BoxClickStateModel>) {
        const state = getState();

        patchState({
            ...state,
            boxClick: allTrue(makeCopy(state.boxClick), 'mezzi')
        });
    }

    @Action(AllFalseBoxMezzi)
    resetBoxMezzi({ getState, patchState }: StateContext<BoxClickStateModel>) {
        const state = getState();

        patchState({
            ...state,
            boxClick: allFalse(makeCopy(state.boxClick), 'mezzi')
        });
    }

    // TUTTI
    @Action(ResetAllBoxes)
    resetAllBoxes({ dispatch }: StateContext<BoxClickStateModel>) {
        dispatch(new AllFalseBoxRichieste);
        dispatch(new AllFalseBoxMezzi);
    }
}

export function update(obj: BoxClickInterface, cat: string, tipo: string) {
    obj[cat][tipo] = !obj[cat][tipo];
    return obj;
}

export function allTrue(obj: BoxClickInterface, cat: string) {
    Object.keys(obj[cat]).map(r => {
        obj[cat][r] = true;
    });
    return obj;
}

export function allFalse(obj: BoxClickInterface, cat: string) {
    Object.keys(obj[cat]).map(r => {
        obj[cat][r] = false;
    });
    return obj;
}
