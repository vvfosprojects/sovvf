import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationInterface } from '../../../interface/pagination.interface';
import { PatchPaginationMezziSquadre } from '../../actions/pagination-composizione-partenza/pagination-composizione-partenza.actions';
import { SetPageSize } from '../../actions/pagination/pagination.actions';

export interface PaginationComposizionePartenzaStateModel {
    pagination: PaginationInterface;
}

export const PaginationComposizionePartenzaStateModelDefaults: PaginationComposizionePartenzaStateModel = {
    pagination: {
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
    static pagination(state: PaginationComposizionePartenzaStateModel) {
        return state.pagination;
    }

    @Selector()
    static page(state: PaginationComposizionePartenzaStateModel) {
        return state.pagination.page;
    }

    @Selector()
    static pageSize(state: PaginationComposizionePartenzaStateModel) {
        return state.pagination.pageSize;
    }

    @Selector()
    static totalItems(state: PaginationComposizionePartenzaStateModel) {
        return state.pagination.totalItems;
    }

    @Selector()
    static totalFilteredItems(state: PaginationComposizionePartenzaStateModel) {
        return state.pagination.totalFilteredItems;
    }

    @Action(PatchPaginationMezziSquadre)
    patchPagination({ patchState }: StateContext<PatchPaginationMezziSquadre>, action: PatchPaginationMezziSquadre) {
        patchState({
            pagination: action.pagination
        });
    }

}
