import { Store, State, Selector, Action, StateContext } from '@ngxs/store';
import { RicercaTrasferimentoChiamataState } from '../ricerca-trasferimento-chiamata/ricerca-trasferimento-chiamata.state';
import { TrasferimentoChiamata } from 'src/app/shared/interface/trasferimento-chiamata.interface';
import { PatchPagination } from 'src/app/shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from 'src/app/shared/interface/response/response.interface';
import { PaginationState } from 'src/app/shared/store/states/pagination/pagination.state';
import {
    GetListaTrasferimentiChiamate,
    SetListaTrasferimentiChiamate,
    AddTrasferimentoChiamata,
    StartLoadingTrasferimentiChiamate,
    StopLoadingTrasferimentiChiamate
} from '../../actions/trasferimento-chiamata/trasferimento-chiamata.actions';
import { TrasferimentoChiamataService } from 'src/app/core/service/trasferimento-chiamata/trasferimento-chiamata.service';
import { Injectable } from '@angular/core';

export interface TrasferimentoChiamataStateModel {
    listaTrasferimentiChiamate: TrasferimentoChiamata[];
    loadingTrasferimentiChiamata: boolean;
}

export const TrasferimentoChiamataStateModelDefaults: TrasferimentoChiamataStateModel = {
    listaTrasferimentiChiamate: undefined,
    loadingTrasferimentiChiamata: false
};

@Injectable()
@State<TrasferimentoChiamataStateModel>({
    name: 'trasferimentoChiamata',
    defaults: TrasferimentoChiamataStateModelDefaults,
    children: [RicercaTrasferimentoChiamataState]
})

export class TrasferimentoChiamataState {

    constructor(private store: Store,
                private trasferimentoChiamataService: TrasferimentoChiamataService) {
    }

    @Selector()
    static listaTrasferimentiChiamate(state: TrasferimentoChiamataStateModel): TrasferimentoChiamata[] {
        return state.listaTrasferimentiChiamate;
    }

    @Selector()
    static loadingTrasferimentiChiamata(state: TrasferimentoChiamataStateModel): boolean {
        return state.loadingTrasferimentiChiamata;
    }

    @Action(GetListaTrasferimentiChiamate)
    getListaTrasferimentiChiamate({ dispatch }: StateContext<TrasferimentoChiamataStateModel>, action: GetListaTrasferimentiChiamate): void {
        dispatch(new StartLoadingTrasferimentiChiamate());
        const ricerca = this.store.selectSnapshot(RicercaTrasferimentoChiamataState.ricerca);
        const filters = {
            search: ricerca
        };
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: this.store.selectSnapshot(PaginationState.pageSize)
        };
        this.trasferimentoChiamataService.getTrasferimentiChiamate(filters, pagination).subscribe((response: ResponseInterface) => {
            dispatch([
                new PatchPagination(response.pagination),
                new SetListaTrasferimentiChiamate(response.dataArray),
                new StopLoadingTrasferimentiChiamate()
            ]);
        });
    }

    @Action(SetListaTrasferimentiChiamate)
    setListaTrasferimentiChiamate({ patchState }: StateContext<TrasferimentoChiamataStateModel>, action: SetListaTrasferimentiChiamate): void {
        patchState({
            listaTrasferimentiChiamate: action.vociTrasferimentoChiamata
        });
    }

    @Action(AddTrasferimentoChiamata)
    addTrasferimentoChiamata({ dispatch }: StateContext<TrasferimentoChiamataStateModel>): void {
        const pagina = this.store.selectSnapshot(PaginationState.page);
        dispatch(new GetListaTrasferimentiChiamate(pagina));
    }

    @Action(StartLoadingTrasferimentiChiamate)
    startLoadingTrasferimentiChiamate({ patchState }: StateContext<TrasferimentoChiamataStateModel>): void {
        patchState({
            loadingTrasferimentiChiamata: true
        });
    }

    @Action(StopLoadingTrasferimentiChiamate)
    stopLoadingTrasferimentiChiamate({ patchState }: StateContext<TrasferimentoChiamataStateModel>): void {
        patchState({
            loadingTrasferimentiChiamata: false
        });
    }
}
