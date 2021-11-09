import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ModuliColonnaMobileService } from '../../../../../core/service/moduli-colonna-mobile-service/moduli-colonna-mobile.service';
import {
    GetModuliColonnaMobile,
    ResetModulii,
    ResetModuliSelezionati,
    SetModuliColonnaMobile,
    SetModuloDeselezionato,
    SetModuloSelezionato,
    StartLoadingModuliColonnaMobile,
    StopLoadingModuliColonnaMobile
} from '../../actions/moduli-colonna-mobile/moduli-colonna-mobile.actions';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { makeCopy } from '../../../../../shared/helper/function-generiche';
import { ModuloColonnaMobile } from '../../../interface/modulo-colonna-mobile.interface';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';

export interface ModuliColonnaMobileStateModel {
    moduliColonnaMobile: any;
    loadingModuliColonnaMobile: boolean;
    moduliSelezionati: ModuloColonnaMobile[];
}

export const ModuliColonnaMobileStateDefaults: ModuliColonnaMobileStateModel = {
    moduliColonnaMobile: null,
    loadingModuliColonnaMobile: false,
    moduliSelezionati: []
};

@Injectable()
@State<ModuliColonnaMobileStateModel>({
    name: 'moduliColonnaMobile',
    defaults: ModuliColonnaMobileStateDefaults
})
export class ModuliColonnaMobileState {

    constructor(private store: Store,
                private moduliColonnaMobileService: ModuliColonnaMobileService) {
    }

    @Selector()
    static moduliColonnaMobile(state: ModuliColonnaMobileStateModel): any {
        return state.moduliColonnaMobile;
    }

    @Selector()
    static moduliSelezionati(state: ModuliColonnaMobileStateModel): ModuloColonnaMobile[] {
        return state.moduliSelezionati;
    }

    @Selector()
    static loadingModuliColonnaMobile(state: ModuliColonnaMobileStateModel): boolean {
        return state.loadingModuliColonnaMobile;
    }

    @Action(GetModuliColonnaMobile)
    getModuliColonnaMobile({ dispatch }: StateContext<ModuliColonnaMobileStateModel>, action: GetModuliColonnaMobile): void {
        dispatch(new StartLoadingModuliColonnaMobile());
        const nomeModulo = action.nomeModulo;
        this.moduliColonnaMobileService.getListaModuli(nomeModulo).subscribe((response: ResponseInterface) => {
            dispatch([
                new SetModuliColonnaMobile(nomeModulo, response.dataArray),
                new StopLoadingModuliColonnaMobile()
            ]);
        }, error => {
            dispatch(new StopLoadingModuliColonnaMobile());
        });
    }

    @Action(SetModuliColonnaMobile)
    setModuliColonnaMobile({ getState, patchState }: StateContext<ModuliColonnaMobileStateModel>, action: SetModuliColonnaMobile): void {
        const state = getState();
        let moduliColonnaMobileState = state.moduliColonnaMobile;
        if (!moduliColonnaMobileState) {
            moduliColonnaMobileState = {};
        }
        const moduliColonnaMobileCopy = makeCopy(moduliColonnaMobileState);
        const nomeModulo = action.nomeModulo;
        const moduliColonnaMobile = action.moduliColonnaMobile;
        moduliColonnaMobileCopy[nomeModulo] = moduliColonnaMobile;

        patchState({
            moduliColonnaMobile: moduliColonnaMobileCopy
        });
    }

    @Action(SetModuloSelezionato)
    setModuloSelezionato({ setState }: StateContext<ModuliColonnaMobileStateModel>, action: SetModuloSelezionato): void {
        const modulo = action.modulo;
        setState(
            patch({
                moduliSelezionati: insertItem<ModuloColonnaMobile>(modulo)
            })
        );
    }

    @Action(SetModuloDeselezionato)
    setModuloDeselezionato({ setState }: StateContext<ModuliColonnaMobileStateModel>, action: SetModuloDeselezionato): void {
        const idModulo = action.idModulo;
        setState(
            patch({
                moduliSelezionati: removeItem<ModuloColonnaMobile>((m: ModuloColonnaMobile) => m.id === idModulo)
            })
        );
    }

    @Action(ResetModulii)
    resetModulii({ patchState }: StateContext<ModuliColonnaMobileStateModel>): void {
        patchState({
            moduliColonnaMobile: ModuliColonnaMobileStateDefaults.moduliColonnaMobile
        });
    }

    @Action(ResetModuliSelezionati)
    resetModuliSelezionati({ patchState }: StateContext<ModuliColonnaMobileStateModel>): void {
        patchState({
            moduliSelezionati: ModuliColonnaMobileStateDefaults.moduliSelezionati
        });
    }

    @Action(StartLoadingModuliColonnaMobile)
    startLoadingModuliColonnaMobile({ patchState }: StateContext<ModuliColonnaMobileStateModel>): void {
        patchState({
            loadingModuliColonnaMobile: true
        });
    }

    @Action(StopLoadingModuliColonnaMobile)
    stopLoadingModuliColonnaMobile({ patchState }: StateContext<ModuliColonnaMobileStateModel>): void {
        patchState({
            loadingModuliColonnaMobile: false
        });
    }
}
