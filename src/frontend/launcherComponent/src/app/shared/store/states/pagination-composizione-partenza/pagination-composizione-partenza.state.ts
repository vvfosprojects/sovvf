import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationInterface } from '../../../interface/pagination.interface';
import { PatchPaginationMezziSquadre } from '../../actions/pagination-composizione-partenza/pagination-composizione-partenza.actions';

export interface PaginationComposizionePartenzaStateModel {
    paginationMezzi: PaginationInterface;
    paginationSquadre: PaginationInterface;
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
};

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
    static page(state: PaginationComposizionePartenzaStateModel) {
        return state.paginationMezzi.page, state.paginationSquadre.page;
    }

    @Selector()
    static pageSize(state: PaginationComposizionePartenzaStateModel) {
        return state.paginationMezzi.pageSize , state.paginationSquadre.pageSize;
    }

    /*
    @Action(PatchPaginationMezziSquadre)
    patchPagination({ patchState }: StateContext<PatchPaginationMezziSquadre>, action: PatchPaginationMezziSquadre) {
        switch (action.type) {
            case 'mezzi' : {
                patchState({
                    paginationMezzi: action.pagination
                });
            }
            case 'squadre' : {
                patchState({
                    paginationSquadre: action.pagination
                });
            }
        }
    }
    */
}
