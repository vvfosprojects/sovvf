import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AddAnnullaStatoMezzi, RemoveAnnullaStatoMezzi, StartBigLoading, StartLoading, StopBigLoading, StopLoading } from '../../actions/loading/loading.actions';
import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { append, patch, removeItem } from '@ngxs/store/operators';
import { StatoMezzo } from '../../../enum/stato-mezzo.enum';

export interface InfoMezzo {
    codMezzo: string;
    istante: Date;
    stato: StatoMezzo;
}

export interface LoadingStateModel {
    loading: boolean;
    annullaStatoMezzi: InfoMezzo[];
}

export const LoadingStateDefaults: LoadingStateModel = {
    loading: false,
    annullaStatoMezzi: undefined,
};

@Injectable()
@State<LoadingStateModel>({
    name: 'loading',
    defaults: LoadingStateDefaults
})
export class LoadingState {

    @Selector()
    static loading(state: LoadingStateModel): boolean {
        return state.loading;
    }

    @Selector()
    static annullaStatoMezzi(state: LoadingStateModel): InfoMezzo[] {
        return state.annullaStatoMezzi;
    }

    constructor(private ngxLoader: NgxUiLoaderService) {
    }

    @Action(AddAnnullaStatoMezzi)
    addAnnullaStatoMezzi({ patchState, getState, setState }: StateContext<LoadingStateModel>, action: AddAnnullaStatoMezzi): void {
        const data = new Date();
        const obj = {
            codMezzo: action.codMezzo,
            istante: data,
            stato: action.stato
        };
        setState(
            patch({
                annullaStatoMezzi: append([obj])
            })
        );
    }

    @Action(RemoveAnnullaStatoMezzi)
    removeAnnullaStatoMezzi({ patchState, getState, setState }: StateContext<LoadingStateModel>, action: RemoveAnnullaStatoMezzi): void {
        setState(
            patch({
                annullaStatoMezzi: removeItem<any>(mezzo => mezzo.codMezzo === action.codMezzo && mezzo.stato === action.stato)
            })
        );
    }

    @Action(StartLoading)
    startLoading({ patchState }: StateContext<LoadingStateModel>): void {
        patchState({
            loading: true
        });
    }

    @Action(StopLoading)
    stopLoading({ patchState }: StateContext<LoadingStateModel>): void {
        patchState({
            loading: false
        });
    }

    @Action(StartBigLoading)
    startBigLoading(): void {
        this.ngxLoader.start();
    }

    @Action(StopBigLoading)
    stopBigLoading(): void {
        this.ngxLoader.stop();
    }
}
