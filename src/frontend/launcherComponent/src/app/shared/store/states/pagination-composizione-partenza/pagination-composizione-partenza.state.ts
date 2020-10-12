import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationInterface } from '../../../interface/pagination.interface';
import { Injectable } from '@angular/core';
import { PatchPaginationMezziSquadre } from '../../actions/pagination-composizione-partenza/pagination-composizione-partenza.actions';

export interface PaginationComposizionePartenzaStateModel {
    paginationMezzi: PaginationInterface;
    paginationSquadre: PaginationInterface;
    paginationPreaccoppiati: PaginationInterface;
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
    paginationPreaccoppiati: {
        page: 1,
        pageSize: 10
    }
};

@Injectable()
@State<PaginationComposizionePartenzaStateModel>({
    name: 'paginationComposizionePartenza',
    defaults: PaginationComposizionePartenzaStateModelDefaults
})
export class PaginationComposizionePartenzaState {

    @Selector()
    static paginationMezzi(state: PaginationComposizionePartenzaStateModel): PaginationInterface {
        return state.paginationMezzi;
    }

    @Selector()
    static pageMezzi(state: PaginationComposizionePartenzaStateModel): number {
        return state.paginationMezzi.page;
    }

    @Selector()
    static pageSizeMezzi(state: PaginationComposizionePartenzaStateModel): number {
        return state.paginationMezzi.pageSize;
    }

    @Selector()
    static totalItemsMezzi(state: PaginationComposizionePartenzaStateModel): number {
        return state.paginationMezzi.totalItems;
    }

    @Selector()
    static paginationSquadre(state: PaginationComposizionePartenzaStateModel): PaginationInterface {
        return state.paginationSquadre;
    }

    @Selector()
    static pageSquadre(state: PaginationComposizionePartenzaStateModel): number {
        return state.paginationSquadre.page;
    }

    @Selector()
    static pageSizeSquadre(state: PaginationComposizionePartenzaStateModel): number {
        return state.paginationSquadre.pageSize;
    }

    @Selector()
    static totalItemsSquadre(state: PaginationComposizionePartenzaStateModel): number {
        return state.paginationSquadre.totalItems;
    }

    @Selector()
    static paginationPreaccoppiati(state: PaginationComposizionePartenzaStateModel): PaginationInterface {
        return state.paginationPreaccoppiati;
    }

    @Selector()
    static pagePreaccoppiati(state: PaginationComposizionePartenzaStateModel): number {
        return state.paginationPreaccoppiati.page;
    }

    @Selector()
    static pageSizePreaccoppiati(state: PaginationComposizionePartenzaStateModel): number {
        return state.paginationPreaccoppiati.pageSize;
    }

    @Selector()
    static totalItemsPreaccoppiati(state: PaginationComposizionePartenzaStateModel): number {
        return state.paginationPreaccoppiati.totalItems;
    }

    @Action(PatchPaginationMezziSquadre)
    patchPagination({ patchState }: StateContext<PaginationComposizionePartenzaStateModel>, action: PatchPaginationMezziSquadre): void {
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
            case 'preaccoppiati' :
                patchState({
                    paginationPreaccoppiati: action.pagination
                });
                break;
        }
    }
}
