import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { ViewComponentStateModel } from '../../../../../shared/interface/view.interface';
import { Injectable } from '@angular/core';

@Injectable()
@State<ViewComponentStateModel>({
    name: 'modalNuovaChiamata'
})
export class ModalNuovaChiamataState {

    // constructor(private mezziInServizioService: MezziInServizioService,
    //             private store: Store) {
    // }
    //
    // @Selector()
    // static idMezzoInServizioHover(state: MezziInServizioStateModel): string {
    //     return state.idMezzoInServizioHover;
    // }

    // @Action(SaveView)
    // saveView({ getState, patchState }: StateContext<ViewComponentStateModel>, action: SaveView): void {
    //     const state = getState();
    //     patchState({
    //         ...state,
    //         view: action.state.view,
    //         column: action.state.column
    //     });
    // }
}
