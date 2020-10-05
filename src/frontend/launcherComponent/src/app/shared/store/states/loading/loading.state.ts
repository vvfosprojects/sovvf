import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StartBigLoading, StartLoading, StopBigLoading, StopLoading } from '../../actions/loading/loading.actions';
import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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

    constructor(private ngxLoader: NgxUiLoaderService) {
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

    @Action(StartBigLoading)
    startBigLoading({ patchState }: StateContext<LoadingStateModel>) {
        this.ngxLoader.start();
    }

    @Action(StopBigLoading)
    stopBigLoading({ patchState }: StateContext<LoadingStateModel>) {
        this.ngxLoader.stop();
    }
}
