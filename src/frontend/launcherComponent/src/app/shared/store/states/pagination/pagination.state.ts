import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationInterface } from '../../../interface/pagination.interface';
import { PatchPagination, SetPageSize } from '../../actions/pagination/pagination.actions';

export interface PaginationStateModel {
    pagination: PaginationInterface;
    pageSizes: number[];
}

export const PaginationStateModelDefaults: PaginationStateModel = {
    pagination: {
        page: 1
    },
    pageSizes: [ 10, 20, 30 ]
};

@State<PaginationStateModel>({
    name: 'pagination',
    defaults: PaginationStateModelDefaults
})
export class PaginationState {

    @Selector()
    static pagination(state: PaginationStateModel) {
        return state.pagination;
    }

    @Selector()
    static page(state: PaginationStateModel) {
        return state.pagination.page;
    }

    @Selector()
    static pageSize(state: PaginationStateModel) {
        return state.pagination.pageSize;
    }

    @Selector()
    static totalItems(state: PaginationStateModel) {
        return state.pagination.totalItems;
    }

    @Selector()
    static totalFilteredItems(state: PaginationStateModel) {
        return state.pagination.totalFilteredItems;
    }

    @Selector()
    static pageSizes(state: PaginationStateModel) {
        return state.pageSizes;
    }

    constructor() {
    }

    @Action(PatchPagination)
    patchPagination({patchState}: StateContext<PatchPagination>, action: PatchPagination) {
        patchState({
            pagination: action.pagination
        });
    }

    @Action(SetPageSize)
    setPageSize({getState, patchState}: StateContext<PatchPagination>, action: SetPageSize) {
        const state = getState();
        patchState({
            pagination: {
                ...state.pagination,
                pageSize: action.pageSize
            }
        });
    }
}
