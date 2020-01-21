import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationInterface } from '../../../interface/pagination.interface';
import { PatchPagination } from '../../actions/pagination/pagination.actions';

export interface PaginationStateModel {
    pagination: PaginationInterface;
}

export const PaginationStateModelDefaults: PaginationStateModel = {
    pagination: {
        page: 1
    }
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
    static limit(state: PaginationStateModel) {
        return state.pagination.limit;
    }

    @Selector()
    static totalItems(state: PaginationStateModel) {
        return state.pagination.totalItems;
    }

    @Selector()
    static totalFilteredItems(state: PaginationStateModel) {
        return state.pagination.totalFilteredItems;
    }

    constructor() {
    }

    @Action(PatchPagination)
    patchPagination({ patchState }: StateContext<PatchPagination>, action: PatchPagination) {
        patchState({
            pagination: action.pagination
        });
    }
}
