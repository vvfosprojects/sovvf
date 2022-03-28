import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { GetPos, SetPos, StartLoadingPos, StopLoadingPos } from '../../actions/pos/pos.actions';
import { Injectable } from '@angular/core';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { PosService } from '../../../../../core/service/pos-service/pos.service';
import { RicercaPosState } from '../ricerca-pos/ricerca-pos.state';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';

export interface PosStateModel {
    pos: any[];
    loadingPos: boolean;
}

export const posStateModelDefaults: PosStateModel = {
    pos: undefined,
    loadingPos: false
};

@Injectable()
@State<PosStateModel>({
    name: 'pos',
    defaults: posStateModelDefaults,
    children: [RicercaPosState]
})
export class PosState {

    constructor(private store: Store,
                private posService: PosService) {
    }

    @Selector()
    static pos(state: PosStateModel): any[] {
        return state.pos;
    }

    @Selector()
    static loadingPos(state: PosStateModel): boolean {
        return state.loadingPos;
    }

    @Action(GetPos)
    getPos({ dispatch }: StateContext<PosStateModel>, action: GetPos): void {
        dispatch(new StartLoadingPos());
        const ricerca = this.store.selectSnapshot(RicercaPosState.ricerca);
        const filters = {
            search: ricerca
        };
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: this.store.selectSnapshot(PaginationState.pageSize)
        };
        this.posService.getPos(filters, pagination).subscribe((response: ResponseInterface) => {
            dispatch([
                new PatchPagination(response.pagination),
                new SetPos(response.dataArray),
                new StopLoadingPos()
            ]);
        });
    }

    @Action(SetPos)
    setPos({ patchState }: StateContext<PosStateModel>, action: SetPos): void {
        patchState({
            pos: action.pos
        });
    }

    @Action(StartLoadingPos)
    startLoadingPos({ patchState }: StateContext<PosStateModel>): void {
        patchState({
            loadingPos: true
        });
    }

    @Action(StopLoadingPos)
    stopLoadingPos({ patchState }: StateContext<PosStateModel>): void {
        patchState({
            loadingPos: false
        });
    }
}
