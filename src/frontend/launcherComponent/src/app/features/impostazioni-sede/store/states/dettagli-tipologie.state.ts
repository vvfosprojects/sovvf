import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DetttagliTipologieService } from '../../../../core/service/dettagli-tipologie/dettagli-tipologie.service';
import {
    AddDettaglioTipologia,
    ClearRicercaDettagliTipologia, DeleteDettaglioTipologia,
    GetDettagliTipologie,
    SetDettagliTipologie,
    SetRicercaDettagliTipologie,
    UpdateDettaglioTipologia
} from '../actions/dettagli-tipologie.actions';
import { StartLoading, StopLoading } from '../../../../shared/store/actions/loading/loading.actions';
import { PaginationState } from '../../../../shared/store/states/pagination/pagination.state';
import { ResponseInterface } from '../../../../shared/interface/response.interface';
import { PatchPagination } from '../../../../shared/store/actions/pagination/pagination.actions';
import { DettaglioTipologia } from '../../../../shared/interface/dettaglio-tipologia.interface';
import { patch, removeItem, updateItem } from '@ngxs/store/operators';
import { Ente } from '../../../../shared/interface/ente.interface';

export interface DettagliTipologieStateModel {
    dettagliTipologie: DettaglioTipologia[];
    ricerca: string;
}

export const DettagliTipologieStateDefaults: DettagliTipologieStateModel = {
    dettagliTipologie: null,
    ricerca: undefined
};

@Injectable()
@State<DettagliTipologieStateModel>({
    name: 'detttagliTipologie',
    defaults: DettagliTipologieStateDefaults
})

export class DettagliTipologieState {

    constructor(private store: Store,
                private detttagliTipologieService: DetttagliTipologieService) {
    }

    @Selector()
    static dettagliTipologie(state: DettagliTipologieStateModel): any[] {
        return state.dettagliTipologie;
    }

    @Selector()
    static ricerca(state: DettagliTipologieStateModel): string {
        return state.ricerca;
    }

    @Action(GetDettagliTipologie)
    getDettagliTipologie({ getState, dispatch }: StateContext<DettagliTipologieStateModel>, action: GetDettagliTipologie): void {
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
    setDettagliTipologie({ patchState }: StateContext<DettagliTipologieStateModel>, action: SetDettagliTipologie): void {
        patchState({
            dettagliTipologie: action.dettagliTipologie
        });
    }

    @Action(SetRicercaDettagliTipologie)
    setRicercaDettagliTipologia({ patchState }: StateContext<DettagliTipologieStateModel>, action: SetRicercaDettagliTipologie): void {
        patchState({
            ricerca: action.ricerca
        });
    }

    @Action(ClearRicercaDettagliTipologia)
    clearRicercaDettagliTipologia({ patchState }: StateContext<DettagliTipologieStateModel>): void {
        patchState({
            ricerca: DettagliTipologieStateDefaults.ricerca
        });
    }

    @Action(AddDettaglioTipologia)
    addDettaglioTipologia({ dispatch }: StateContext<DettagliTipologieStateModel>): void {
        const pagina = this.store.selectSnapshot(PaginationState.page);
        dispatch(new GetDettagliTipologie(pagina));
    }

    @Action(UpdateDettaglioTipologia)
    updateDettaglioTipologia({ setState }: StateContext<DettagliTipologieStateModel>, action: UpdateDettaglioTipologia): void {
        setState(
            patch({
                dettagliTipologie: updateItem<DettaglioTipologia>(voce => voce.codiceDettaglioTipologia === action.dettaglioTipologia.codiceDettaglioTipologia, action.dettaglioTipologia)
            })
        );
    }

    @Action(DeleteDettaglioTipologia)
    deleteDettaglioTipologia({ setState, getState, dispatch }: StateContext<DettagliTipologieStateModel>, action: DeleteDettaglioTipologia): void {
        const state = getState();
        if (state.dettagliTipologie && state.dettagliTipologie.length === 1) {
            const page = this.store.selectSnapshot(PaginationState.page);
            dispatch(new GetDettagliTipologie(page - 1));
        }
        setState(
            patch({
                dettagliTipologie: removeItem<DettaglioTipologia>(dettaglioTipologia => dettaglioTipologia.codiceDettaglioTipologia === action.codiceDettaglioTipologia)
            })
        );
    }
}
