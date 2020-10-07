import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationInterface } from '../../../interface/pagination.interface';
import { Injectable } from '@angular/core';
import { PatchCodDistaccamentoMezzo, PatchCodDistaccamentoSquadre, PatchPaginationMezziSquadre } from '../../actions/pagination-composizione-partenza/pagination-composizione-partenza.actions';

export interface PaginationComposizionePartenzaStateModel {
    paginationMezzi: PaginationInterface;
    paginationSquadre: PaginationInterface;
    codDistaccamentoMezzo: string,
    codDistaccamentoSquadre: string,
}

export const PaginationComposizionePartenzaStateModelDefaults: PaginationComposizionePartenzaStateModel = {
    paginationMezzi: {
        page: 1,
        pageSize: 10
    },
    paginationSquadre: {
        page: 1,
        pageSize: 10
    },
    codDistaccamentoMezzo: null,
    codDistaccamentoSquadre: null,
};

@Injectable()
@State<PaginationComposizionePartenzaStateModel>({
    name: 'paginationComposizionePartenza',
    defaults: PaginationComposizionePartenzaStateModelDefaults
})
export class PaginationComposizionePartenzaState {

    @Selector()
    static paginationMezzi(state: PaginationComposizionePartenzaStateModel) {
        return state.paginationMezzi;
    }

    @Selector()
    static pageMezzi(state: PaginationComposizionePartenzaStateModel) {
        return state.paginationMezzi.page;
    }

    @Selector()
    static pageSizeMezzi(state: PaginationComposizionePartenzaStateModel) {
        return state.paginationMezzi.pageSize;
    }

    @Selector()
    static totalItemsMezzi(state: PaginationComposizionePartenzaStateModel) {
        return state.paginationMezzi.totalItems;
    }

    @Selector()
    static paginationSquadre(state: PaginationComposizionePartenzaStateModel) {
        return state.paginationSquadre;
    }

    @Selector()
    static pageSquadre(state: PaginationComposizionePartenzaStateModel) {
        return state.paginationSquadre.page;
    }

    @Selector()
    static pageSizeSquadre(state: PaginationComposizionePartenzaStateModel) {
        return state.paginationSquadre.pageSize;
    }

    @Selector()
    static totalItemsSquadre(state: PaginationComposizionePartenzaStateModel) {
        return state.paginationSquadre.totalItems;
    }

    @Selector()
    static codDistaccamentoMezzo(state: PaginationComposizionePartenzaStateModel) {
        return state.codDistaccamentoMezzo;
    }

    @Selector()
    static codDistaccamentoSquadre(state: PaginationComposizionePartenzaStateModel) {
        return state.codDistaccamentoSquadre;
    }

    @Action(PatchCodDistaccamentoMezzo)
    patchCodDistaccamentoMezzo({ patchState }: StateContext<PaginationComposizionePartenzaStateModel>, action: PatchCodDistaccamentoMezzo) {
        patchState({
            codDistaccamentoMezzo: action.codDistaccamento
        });
    }

    @Action(PatchCodDistaccamentoSquadre)
    patchCodDistaccamentoSquadre({ patchState }: StateContext<PaginationComposizionePartenzaStateModel>, action: PatchCodDistaccamentoSquadre) {
        patchState({
            codDistaccamentoSquadre: action.codDistaccamento
        });
    }

    @Action(PatchPaginationMezziSquadre)
    patchPagination({ patchState }: StateContext<PaginationComposizionePartenzaStateModel>, action: PatchPaginationMezziSquadre) {
        switch (action.type) {
            case 'mezzi' :
                patchState({
                    paginationMezzi: action.pagination
                });
                break;
            case 'squadre' :
                patchState({
                    paginationSquadre: action.pagination
                });
                break;
        }
    }
}
