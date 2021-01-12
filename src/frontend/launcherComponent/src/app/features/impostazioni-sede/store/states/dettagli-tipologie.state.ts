import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DetttagliTipologieService } from '../../../../core/service/dettagli-tipologie/dettagli-tipologie.service';
import { ClearRicercaDettagliTipologia, GetDettagliTipologie, SetDettagliTipologie, SetRicercaDettagliTipologie } from '../actions/dettagli-tipologie.actions';
import { StartLoading, StopLoading } from '../../../../shared/store/actions/loading/loading.actions';
import { PaginationState } from '../../../../shared/store/states/pagination/pagination.state';
import { ResponseInterface } from '../../../../shared/interface/response.interface';
import { PatchPagination } from '../../../../shared/store/actions/pagination/pagination.actions';
import { DettaglioTipologia } from '../../../../shared/interface/dettaglio-tipologia.interface';

export interface DettagliTipologiaStateModel {
    dettagliTipologie: DettaglioTipologia[];
    ricerca: string;
}

export const DettagliTipologiaStateDefaults: DettagliTipologiaStateModel = {
    dettagliTipologie: null,
    ricerca: undefined
};

@Injectable()
@State<DettagliTipologiaStateModel>({
    name: 'detttagliTipologie',
    defaults: DettagliTipologiaStateDefaults
})

export class DettagliTipologieState {

    constructor(private store: Store,
                private detttagliTipologieService: DetttagliTipologieService) {
    }

    @Selector()
    static dettagliTipologie(state: DettagliTipologiaStateModel): any[] {
        return state.dettagliTipologie;
    }

    @Selector()
    static ricerca(state: DettagliTipologiaStateModel): string {
        return state.ricerca;
    }

    @Action(GetDettagliTipologie)
    getDettagliTipologie({ getState, dispatch }: StateContext<DettagliTipologiaStateModel>, action: GetDettagliTipologie): void {
        dispatch(new StartLoading());
        const ricerca = getState().ricerca;
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
                new SetDettagliTipologie(response.dataArray),
                new StopLoading()
            ]);
        });
    }

    @Action(SetDettagliTipologie)
    setDettagliTipologie({ patchState }: StateContext<DettagliTipologiaStateModel>, action: SetDettagliTipologie): void {
        patchState({
            dettagliTipologie: action.dettagliTipologie
        });
    }

    @Action(SetRicercaDettagliTipologie)
    setRicercaDettagliTipologia({ patchState }: StateContext<DettagliTipologiaStateModel>, action: SetRicercaDettagliTipologie): void {
        patchState({
            ricerca: action.ricerca
        });
    }

    @Action(ClearRicercaDettagliTipologia)
    clearRicercaDettagliTipologia({ patchState }: StateContext<DettagliTipologiaStateModel>, action: ClearRicercaDettagliTipologia): void {
        patchState({
            ricerca: DettagliTipologiaStateDefaults.ricerca
        });
    }

}
