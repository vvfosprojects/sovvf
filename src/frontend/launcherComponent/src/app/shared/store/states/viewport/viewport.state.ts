import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetContentHeight, SetAvailHeight } from '../../actions/viewport/viewport.actions';

export interface ViewportStateModel {
    availHeight: number;
    contentHeight: number;
}

export const ViewportStateDefaults: ViewportStateModel = {
    availHeight: null,
    contentHeight: null
};

@Injectable()
@State<ViewportStateModel>({
    name: 'viewport',
    defaults: ViewportStateDefaults
})
export class ViewportState {

    @Selector()
    static footerFixed(state: ViewportStateModel) {
        return state.availHeight > state.contentHeight;
    }

    @Action(SetAvailHeight)
    setAvailHeight({ patchState }: StateContext<ViewportStateModel>, { availHeight }: SetAvailHeight) {
        patchState({ availHeight });
    }

    @Action(SetContentHeight)
    setContentHeight({ patchState }: StateContext<ViewportStateModel>, { contentHeight }: SetContentHeight) {
        patchState({ contentHeight });
    }
}
