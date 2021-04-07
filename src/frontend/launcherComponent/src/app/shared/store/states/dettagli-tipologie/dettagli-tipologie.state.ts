import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DetttagliTipologieService } from '../../../../core/service/dettagli-tipologie/dettagli-tipologie.service';
import {
    AddDettaglioTipologia,
    ClearRicercaDettagliTipologia,
    DeleteDettaglioTipologia,
    GetDettagliTipologie,
    ReducerSelezioneFiltroTipologia,
    ResetFiltroTipologiaSelezionato,
    SetDettagliTipologie,
    SetFiltroTipologiaDeselezionato,
    SetFiltroTipologiaSelezionato,
    SetRicercaDettagliTipologie,
    UpdateDettaglioTipologia
} from '../../actions/dettagli-tipologie/dettagli-tipologie.actions';
import { StartLoading, StopLoading } from '../../actions/loading/loading.actions';
import { PaginationState } from '../pagination/pagination.state';
import { ResponseInterface } from '../../../interface/response/response.interface';
import { PatchPagination } from '../../actions/pagination/pagination.actions';
import { DettaglioTipologia } from '../../../interface/dettaglio-tipologia.interface';
import { patch, removeItem, updateItem } from '@ngxs/store/operators';
import { FiltersInterface } from '../../../interface/filters/filters.interface';

export interface DettagliTipologieStateModel {
    dettagliTipologie: DettaglioTipologia[];
    ricerca: string;
    filtroTipologia: number;
}

export const DettagliTipologieStateDefaults: DettagliTipologieStateModel = {
    dettagliTipologie: null,
    ricerca: undefined,
    filtroTipologia: null
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
        const state = getState();
        const ricerca = state.ricerca;
        const filtroTipologia = state.filtroTipologia;
        const filters = {
            search: ricerca,
            codTipologia: filtroTipologia
        } as FiltersInterface;
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
                dettagliTipologie: updateItem<DettaglioTipologia>(dettaglioTipologia => dettaglioTipologia.codiceDettaglioTipologia === action.dettaglioTipologia.codiceDettaglioTipologia, action.dettaglioTipologia)
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

    /**
     * Filtri Tipologie
     */
    @Action(ReducerSelezioneFiltroTipologia)
    reducerSelezioneFiltroTipologia({ getState, dispatch }: StateContext<DettagliTipologieStateModel>, action: ReducerSelezioneFiltroTipologia): void {
        const filtroTipologiaSelezionato = getState().filtroTipologia;
        if (!filtroTipologiaSelezionato) {
            dispatch(new SetFiltroTipologiaSelezionato(action.codTipologia));
        } else {
            dispatch(new SetFiltroTipologiaDeselezionato());
        }
    }

    @Action(SetFiltroTipologiaSelezionato)
    setFiltroTipologiaSelezionato({ patchState, dispatch }: StateContext<DettagliTipologieStateModel>, action: SetFiltroTipologiaSelezionato): void {
        patchState({
            filtroTipologia: action.codTipologia
        });
        dispatch(new GetDettagliTipologie());
    }

    @Action(SetFiltroTipologiaDeselezionato)
    setFiltroTipologiaDeselezionato({ setState, dispatch }: StateContext<DettagliTipologieStateModel>): void {
        setState(
            patch({
                filtroTipologia: undefined
            })
        );
        dispatch(new GetDettagliTipologie());
    }

    @Action(ResetFiltroTipologiaSelezionato)
    resetFiltroTipologiaSelezionato({ patchState, dispatch }: StateContext<DettagliTipologieStateModel>): void {
        patchState({
            filtroTipologia: DettagliTipologieStateDefaults.filtroTipologia
        });
        dispatch(new GetDettagliTipologie());
    }
}
