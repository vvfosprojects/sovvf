import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AddAnnullaStatoMezzi, RemoveAnnullaStatoMezzi, StartBigLoading, StartLoading, StopBigLoading, StopLoading } from '../../actions/loading/loading.actions';
import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { append, patch, removeItem } from '@ngxs/store/operators';

interface InfoMezzo {
    codMezzo: string;
    istante: Date;
}

interface DiffInfoMezzo {
    codMezzo: string;
    diff: number;
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
    static annullaStatoMezzi(state: LoadingStateModel): string[] {
        const listaMezzi = [];
        state.annullaStatoMezzi.forEach(x => listaMezzi.push(x.codMezzo));
        return listaMezzi;
    }

    @Selector()
    static diffDateInfoMezzo(state: LoadingStateModel): DiffInfoMezzo[] {
        // TODO: Implementazione progressbar
        const diffDate = [];
        // state.annullaStatoMezzi.forEach((annullaStatoMezzi: InfoMezzo) => {
        //     const now = new Date();
        //     const secondsDiff = Math.round((now.getTime() - annullaStatoMezzi.istante.getTime()) / 1000);
        //     diffDate.push({
        //         codMezzo: annullaStatoMezzi.codMezzo,
        //         secondsDiff: secondsDiff ? secondsDiff : 60
        //     });
        // });
        return diffDate;
    }

    constructor(private ngxLoader: NgxUiLoaderService) {
    }

    @Action(AddAnnullaStatoMezzi)
    addAnnullaStatoMezzi({ patchState, getState, setState }: StateContext<LoadingStateModel>, action: any): void {
        const data = new Date();
        const obj = {
            codMezzo: action.codMezzo,
            istante: data
        };
        setState(
            patch({
                annullaStatoMezzi: append([obj])
            })
        );
    }

    @Action(RemoveAnnullaStatoMezzi)
    removeAnnullaStatoMezzi({ patchState, getState, setState }: StateContext<LoadingStateModel>, action: any): void {
        setState(
            patch({
                annullaStatoMezzi: removeItem<any>(mezzo => mezzo.codMezzo === action.codMezzo)
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
    startBigLoading({ patchState }: StateContext<LoadingStateModel>): void {
        this.ngxLoader.start();
    }

    @Action(StopBigLoading)
    stopBigLoading({ patchState }: StateContext<LoadingStateModel>): void {
        this.ngxLoader.stop();
    }
}
