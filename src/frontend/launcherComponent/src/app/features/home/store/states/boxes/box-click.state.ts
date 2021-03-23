import { Action, NgxsOnChanges, NgxsSimpleChange, Selector, State, StateContext, Store } from '@ngxs/store';
import { BoxClickInterface } from '../../../boxes/box-interface/box-click-interface';
import {
    UpdateBoxRichieste,
    AllFalseBoxRichieste,
    UpdateBoxMezzi,
    AllFalseBoxMezzi,
    ReducerBoxClick,
    ResetAllBoxes,
    AllTrueBoxRichieste,
    AllTrueBoxMezzi,
    UndoAllBoxes,
    AllTrueBoxMezziPresenti
} from '../../actions/boxes/box-click.actions';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';
import { CheckBoxClick } from '../../actions/maps/maps-filtro.actions';
import { Injectable } from '@angular/core';
import { SetFiltroBoxRichieste } from '../../actions/filterbar/filtri-richieste.actions';

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

@Injectable()
@State<BoxClickStateModel>({
    name: 'boxClick',
    defaults: boxClickStateDefaults
})
export class BoxClickState implements NgxsOnChanges {

    constructor(private store: Store) {
    }

    @Selector()
    static boxClick(state: BoxClickStateModel): BoxClickInterface {
        return state.boxClick;
    }

    ngxsOnChanges(change: NgxsSimpleChange): void {
        const currentValue = change.currentValue && change.currentValue.boxClick;
        const previousValue = change.previousValue && change.previousValue.boxClick;
        if (previousValue) {
            this.store.dispatch(new CheckBoxClick(currentValue));
        }
    }

    @Action(ReducerBoxClick)
    reducer({ dispatch }: StateContext<BoxClickStateModel>, action: ReducerBoxClick): void {
        switch (action.cat) {
            case 'richieste':
                if (action.tipo === 'tutti') {
                    dispatch(new AllFalseBoxRichieste());
                } else {
                    dispatch(new UpdateBoxRichieste(action.tipo));
                    dispatch(new SetFiltroBoxRichieste(action.tipo));
                }
                break;
            case 'mezzi':
                if (action.tipo === 'tutti') {
                    dispatch(new AllFalseBoxMezzi());
                } else {
                    dispatch(new UpdateBoxMezzi(action.tipo));
                }
                break;
        }
    }

    @Action(UpdateBoxRichieste)
    updateBoxRichieste({ getState, patchState }: StateContext<BoxClickStateModel>, action: UpdateBoxRichieste): void {
        const state = getState();

        patchState({
            ...state,
            boxClick: {
                richieste: {
                    chiamate: action.tipo === 'chiamate' ? !state.boxClick.richieste.chiamate : state.boxClick.richieste.chiamate,
                    assegnati: action.tipo === 'assegnati' ? !state.boxClick.richieste.assegnati : state.boxClick.richieste.assegnati,
                    sospesi: action.tipo === 'sospesi' ? !state.boxClick.richieste.sospesi : state.boxClick.richieste.sospesi,
                    presidiati: action.tipo === 'presidiati' ? !state.boxClick.richieste.presidiati : state.boxClick.richieste.presidiati,
                    chiusi: action.tipo === 'chiusi' ? !state.boxClick.richieste.chiusi : state.boxClick.richieste.chiusi,
                },
                mezzi: state.boxClick.mezzi
            }
        });
    }

    @Action(AllTrueBoxRichieste)
    allTrueBoxRichieste({ getState, patchState }: StateContext<BoxClickStateModel>): void {
        const state = getState();

        patchState({
            ...state,
            boxClick: {
                mezzi: state.boxClick.mezzi,
                richieste: {
                    chiamate: true,
                    assegnati: true,
                    sospesi: true,
                    presidiati: true,
                    chiusi: true
                }
            }
        });
    }

    @Action(AllFalseBoxRichieste)
    resetBoxRichieste({ getState, patchState }: StateContext<BoxClickStateModel>): void {
        const state = getState();
        patchState({
            ...state,
            boxClick: {
                richieste: boxClickStateDefaults.boxClick.richieste,
                mezzi: state.boxClick.mezzi
            }
        });
    }

    @Action(UpdateBoxMezzi)
    updateBoxMezzi({ getState, patchState }: StateContext<BoxClickStateModel>, action: UpdateBoxMezzi): void {
        const state = getState();

        patchState({
            ...state,
            boxClick: {
                richieste: state.boxClick.richieste,
                mezzi: {
                    inSede: action.tipo === 'inSede' ? !state.boxClick.mezzi.inSede : state.boxClick.mezzi.inSede,
                    inRientro: action.tipo === 'inRientro' ? !state.boxClick.mezzi.inRientro : state.boxClick.mezzi.inRientro,
                    inViaggio: action.tipo === 'inViaggio' ? !state.boxClick.mezzi.inViaggio : state.boxClick.mezzi.inViaggio,
                    sulPosto: action.tipo === 'sulPosto' ? !state.boxClick.mezzi.sulPosto : state.boxClick.mezzi.sulPosto,
                    istituto: action.tipo === 'istituto' ? !state.boxClick.mezzi.istituto : state.boxClick.mezzi.istituto
                }
            }
        });
    }

    @Action(AllTrueBoxMezzi)
    allTrueBoxMezzi({ getState, patchState }: StateContext<BoxClickStateModel>): void {
        const state = getState();

        patchState({
            ...state,
            boxClick: {
                richieste: state.boxClick.richieste,
                mezzi: {
                    inSede: true,
                    inRientro: true,
                    inViaggio: true,
                    sulPosto: true,
                    istituto: true
                }
            }
        });
    }

    @Action(AllTrueBoxMezziPresenti)
    allTrueBoxMezziPresenti({ getState, patchState }: StateContext<BoxClickStateModel>, action: AllTrueBoxMezziPresenti): void {
        const state = getState();
        patchState({
            ...state,
            boxClick: {
                richieste: state.boxClick.richieste,
                mezzi: {
                    inSede: action.statiMezzi.includes(StatoMezzo.InSede),
                    inRientro: action.statiMezzi.includes(StatoMezzo.InRientro),
                    inViaggio: action.statiMezzi.includes(StatoMezzo.InViaggio),
                    sulPosto: action.statiMezzi.includes(StatoMezzo.SulPosto),
                    istituto: action.statiMezzi.includes(StatoMezzo.Istituto)
                }
            }
        });
    }

    @Action(AllFalseBoxMezzi)
    resetBoxMezzi({ getState, patchState }: StateContext<BoxClickStateModel>): void {
        const state = getState();

        patchState({
            ...state,
            boxClick: {
                richieste: state.boxClick.richieste,
                mezzi: boxClickStateDefaults.boxClick.mezzi
            }
        });
    }

    // TUTTI
    @Action(UndoAllBoxes)
    undoAllBoxes({ getState, patchState }: StateContext<BoxClickStateModel>, action: UndoAllBoxes): void {
        const state = getState();

        patchState({
            ...state,
            boxClick: action.prevState.boxClick
        });
    }

    @Action(ResetAllBoxes)
    resetAllBoxes({ dispatch }: StateContext<BoxClickStateModel>): void {
        dispatch(new AllFalseBoxRichieste());
        dispatch(new AllFalseBoxMezzi());
    }
}
