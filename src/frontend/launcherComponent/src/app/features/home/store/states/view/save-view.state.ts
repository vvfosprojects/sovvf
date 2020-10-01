import { Action, State, StateContext } from '@ngxs/store';
import { SaveView } from '../../actions/view/view.actions';
import { ViewComponentStateModel } from '../../../../../shared/interface/view.interface';
import { Injectable } from '@angular/core';


@Injectable()
@State<ViewComponentStateModel>({
    name: 'backupViewComponent'
})

export class BackupViewComponentState {

    @Action(SaveView)
    saveView({ getState, patchState }: StateContext<ViewComponentStateModel>, action: SaveView) {
        const state = getState();
        patchState({
            ...state,
            view: action.state.view,
            column: action.state.column
        });
    }
}
