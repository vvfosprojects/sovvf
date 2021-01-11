import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DetttagliTipologieService } from '../../../../core/service/dettagli-tipologie/dettagli-tipologie.service';
import { GetDettagliTipologie } from '../actions/dettagli-tipologie.actions';
import { StartLoading, StopLoading } from '../../../../shared/store/actions/loading/loading.actions';
import { RicercaRubricaState } from '../../../rubrica/store/states/ricerca-rubrica/ricerca-rubrica.state';
import { PaginationState } from '../../../../shared/store/states/pagination/pagination.state';
import { ResponseInterface } from '../../../../shared/interface/response.interface';
import { PatchPagination } from '../../../../shared/store/actions/pagination/pagination.actions';

export interface SchedaTelefonataStateModel {
    dettagliTipologie: any[];
}

export const SchedaTelefonataStateDefaults: SchedaTelefonataStateModel = {
    dettagliTipologie: null,
};

@Injectable()
@State<SchedaTelefonataStateModel>({
    name: 'detttagliTipologie',
    defaults: SchedaTelefonataStateDefaults
})

export class DettagliTipologieState {

    constructor(private store: Store,
                private detttagliTipologieService: DetttagliTipologieService) {
    }

    @Selector()
    static dettagliTipologie(state: SchedaTelefonataStateModel): any[] {
        return state.dettagliTipologie;
    }

    @Action(GetDettagliTipologie)
    getDettagliTipologie({ patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: GetDettagliTipologie): void {
        dispatch(new StartLoading());
        const ricerca = this.store.selectSnapshot(RicercaRubricaState.ricerca);
        const filters = {
            search: ricerca
        };
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: this.store.selectSnapshot(PaginationState.pageSize)
        };

        this.detttagliTipologieService.getDettagliTipologie(filters, pagination).subscribe((response: ResponseInterface) => {
            dispatch([
                new PatchPagination(response.pagination),
                // todo: completare (SetDettagliTipologia)
                // new SetDettagliTipologia(response.dataArray),
                new StopLoading()
            ]);
        });
    }

}
