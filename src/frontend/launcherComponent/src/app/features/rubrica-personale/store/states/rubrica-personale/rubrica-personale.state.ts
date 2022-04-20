import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { GetRubricaPersonale, SetRubricaPersonale, StartLoadingRubricaPersonale, StopLoadingRubricaPersonale } from '../../actions/rubrica-personale/rubrica-personale.actions';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { Injectable } from '@angular/core';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { RubricaPersonaleService } from '../../../../../core/service/rubrica-personale-service/rubrica-personale-service';
import { RicercaRubricaPersonaleState } from '../ricerca-rubrica-personale/ricerca-rubrica-personale.state';
import { RubricaPersonale } from '../../../../../shared/interface/rubrica-personale.interface';

export interface RubricaPersonaleStateModel {
    vociRubricaPersonale: RubricaPersonale[];
    loadingRubricaPersonale: boolean;
}

export const RubricaPersonaleStateModelDefaults: RubricaPersonaleStateModel = {
    vociRubricaPersonale: undefined,
    loadingRubricaPersonale: false,
};

@Injectable()
@State<RubricaPersonaleStateModel>({
    name: 'rubricaPersonale',
    defaults: RubricaPersonaleStateModelDefaults,
    children: [RicercaRubricaPersonaleState]
})
export class RubricaPersonaleState {

    constructor(private store: Store,
                private rubricaPersonaleService: RubricaPersonaleService) {
    }

    @Selector()
    static vociRubricaPersonale(state: RubricaPersonaleStateModel): RubricaPersonale[] {
        return state.vociRubricaPersonale;
    }

    @Selector()
    static loadingRubricaPersonale(state: RubricaPersonaleStateModel): boolean {
        return state.loadingRubricaPersonale;
    }

    @Action(GetRubricaPersonale)
    getRubricaPersonale({ dispatch }: StateContext<RubricaPersonaleStateModel>, action: GetRubricaPersonale): void {
        dispatch(new StartLoadingRubricaPersonale());
        const ricerca = this.store.selectSnapshot(RicercaRubricaPersonaleState.ricerca);
        const stato = this.store.selectSnapshot(RicercaRubricaPersonaleState.stato);
        const tipo = this.store.selectSnapshot(RicercaRubricaPersonaleState.tipo);
        const filters = {
            search: ricerca && ricerca.length > 0 ? ricerca : null,
            stato: stato ? stato : null,
            tipo: tipo ? tipo : null,
        };
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: this.store.selectSnapshot(PaginationState.pageSize)
        };
        this.rubricaPersonaleService.getRubricaPersonale(filters, pagination).subscribe((response: ResponseInterface) => {
            dispatch([
                new PatchPagination(response.pagination),
                new SetRubricaPersonale(response.dataArray),
                new StopLoadingRubricaPersonale()
            ]);
        }, () => dispatch(new StopLoadingRubricaPersonale()));
    }

    @Action(SetRubricaPersonale)
    setRubricaPersonale({ patchState }: StateContext<RubricaPersonaleStateModel>, action: SetRubricaPersonale): void {
        patchState({
            vociRubricaPersonale: action.vociRubricaPersonale
        });
    }


    @Action(StartLoadingRubricaPersonale)
    startLoadingRubricaPersonale({ patchState }: StateContext<RubricaPersonaleStateModel>): void {
        patchState({
            loadingRubricaPersonale: true
        });
    }

    @Action(StopLoadingRubricaPersonale)
    stopLoadingRubricaPersonale({ patchState }: StateContext<RubricaPersonaleStateModel>): void {
        patchState({
            loadingRubricaPersonale: false
        });
    }
}
