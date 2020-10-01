import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationInterface } from '../../../interface/pagination.interface';
import { PatchPagination, SetPageSize } from '../../actions/pagination/pagination.actions';

export interface PaginationComposizionePartenzaStateModel {
    pagination: PaginationInterface;
    // pageSizes: number[];
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

    @Action(PatchPagination)
    patchPagination({ patchState }: StateContext<PatchPagination>, action: PatchPagination) {
        patchState({
            pagination: action.pagination
        });
    }

    @Action(SetPageSize)
    setPageSize({ getState, patchState }: StateContext<PatchPagination>, action: SetPageSize) {
        const state = getState();
        patchState({
            pagination: {
                ...state.pagination,
                pageSize: action.pageSize
            }
        });
    }
}
