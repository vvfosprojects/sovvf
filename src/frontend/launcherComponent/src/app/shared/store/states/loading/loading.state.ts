import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StartLoading, StopLoading } from '../../actions/loading/loading.actions';
import { Injectable } from '@angular/core';

export interface LoadingStateModel {
    loading: boolean;
}

export const LoadingStateDefaults: LoadingStateModel = {
    loading: false
};

@Injectable()
@State<LoadingStateModel>({
    name: 'loading',
    defaults: LoadingStateDefaults
})
export class LoadingState {

    @Selector()
    static loading(state: LoadingStateModel) {
        return state.loading;
    }

    constructor() {
    }

    @Action(StartLoading)
    startLoading({ patchState }: StateContext<LoadingStateModel>) {
        patchState({
            loading: true
        });
    }

    @Action(StopLoading)
    stopLoading({ patchState }: StateContext<LoadingStateModel>) {
        patchState({
            loading: false
        });
    }
}
