import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { patch, removeItem, updateItem } from '@ngxs/store/operators';
import { EnteInterface } from '../../../../../shared/interface/ente.interface';
import {
    GetRubrica,
    SetRubrica,
    AddVoceRubrica,
    UpdateVoceRubrica,
    DeleteVoceRubrica,
    StartLoadingRubrica,
    StopLoadingRubrica
} from '../../actions/rubrica/rubrica.actions';
import { RubricaService } from '../../../../../core/service/rubrica-service/rubrica.service';
import { RicercaRubricaState } from '../ricerca-rubrica/ricerca-rubrica.state';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { Injectable } from '@angular/core';

export interface RubricaStateModel {
    vociRubrica: EnteInterface[];
    loadingRubrica: boolean;
}

export const RubricaStateModelDefaults: RubricaStateModel = {
    vociRubrica: undefined,
    loadingRubrica: false,
};

@Injectable()
@State<RubricaStateModel>({
    name: 'rubrica',
    defaults: RubricaStateModelDefaults,
    children: [RicercaRubricaState]
})
export class RubricaState {

    constructor(private store: Store,
                private rubricaService: RubricaService) {
    }

    @Selector()
    static vociRubrica(state: RubricaStateModel): EnteInterface[] {
        return state.vociRubrica;
    }

    @Selector()
    static loadingRubrica(state: RubricaStateModel): boolean {
        return state.loadingRubrica;
    }

    @Action(GetRubrica)
    getRubrica({ dispatch }: StateContext<RubricaStateModel>, action: GetRubrica): void {
        dispatch(new StartLoadingRubrica());
        const ricerca = this.store.selectSnapshot(RicercaRubricaState.ricerca);
        const filters = {
            search: ricerca
        };
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: this.store.selectSnapshot(PaginationState.pageSize)
        };
        this.rubricaService.getRubrica(filters, pagination).subscribe((response: ResponseInterface) => {
            dispatch([
                new PatchPagination(response.pagination),
                new SetRubrica(response.dataArray),
                new StopLoadingRubrica()
            ]);
        });
    }

    @Action(SetRubrica)
    setRubrica({ patchState }: StateContext<RubricaStateModel>, action: SetRubrica): void {
        patchState({
            vociRubrica: action.vociRubrica
        });
    }

    @Action(AddVoceRubrica)
    addVoceRubrica({ dispatch }: StateContext<RubricaStateModel>): void {
        const pagina = this.store.selectSnapshot(PaginationState.page);
        dispatch(new GetRubrica(pagina));
    }


    @Action(UpdateVoceRubrica)
    updateVoceRubrica({ setState }: StateContext<RubricaStateModel>, action: UpdateVoceRubrica): void {
        setState(
            patch({
                vociRubrica: updateItem<EnteInterface>(voce => voce.codice === action.voceRubrica.codice, action.voceRubrica)
            })
        );
    }

    @Action(DeleteVoceRubrica)
    deleteVoceRubrica({ setState, getState, dispatch }: StateContext<RubricaStateModel>, action: DeleteVoceRubrica): void {
        const state = getState();
        if (state.vociRubrica && state.vociRubrica.length === 1) {
            const page = this.store.selectSnapshot(PaginationState.page);
            dispatch(new GetRubrica(page - 1));
        }
        setState(
            patch({
                vociRubrica: removeItem<EnteInterface>(voceRubrica => voceRubrica.id === action.idVoceRubrica)
            })
        );
    }

    @Action(StartLoadingRubrica)
    startLoadingRubrica({ patchState }: StateContext<RubricaStateModel>): void {
        patchState({
            loadingRubrica: true
        });
    }

    @Action(StopLoadingRubrica)
    stopLoadingRubrica({ patchState }: StateContext<RubricaStateModel>): void {
        patchState({
            loadingRubrica: false
        });
    }
}
