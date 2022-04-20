import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    ClearCodCategoriaAreaDocumentale,
    ClearDescCategoriaAreaDocumentale,
    GetDocumentiAreaDocumentale,
    SetCodCategoriaAreaDocumentale,
    SetDescCategoriaAreaDocumentale,
    SetDocumentiAreaDocumentale,
    StartLoadingDocumentiAreaDocumentale,
    StopLoadingDocumentiAreaDocumentale
} from '../../actions/area-documentale/area-documentale.actions';
import { Injectable } from '@angular/core';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { RicercaAreaDocumentaleState } from '../ricerca-area-documentale/ricerca-area-documentale.state';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { AreaDocumentaleService } from 'src/app/core/service/area-documentale-service/area-documentale.service';
import { DocumentoInterface } from 'src/app/shared/interface/documento.interface';
import { FiltriAreaDocumentaleState } from '../../../../../shared/store/states/filtri-area-documentale/filtri-area-documentale.state';
import { VoceFiltro } from '../../../../home/filterbar/filtri-richieste/voce-filtro.model';
import { LSNAME } from '../../../../../core/settings/config';

export interface AreaDocumentaleStateModel {
    documenti: DocumentoInterface[];
    codCategoria: string;
    descCategoria: string;
    loadingDocumentiAreaDocumentale: boolean;
}

export const AreaDocumentaleModelDefaults: AreaDocumentaleStateModel = {
    documenti: undefined,
    codCategoria: undefined,
    descCategoria: undefined,
    loadingDocumentiAreaDocumentale: false
};

@Injectable()
@State<AreaDocumentaleStateModel>({
    name: 'areaDocumentale',
    defaults: AreaDocumentaleModelDefaults,
    children: [RicercaAreaDocumentaleState]
})
export class AreaDocumentaleState {

    constructor(private store: Store,
                private areaDocumentaleService: AreaDocumentaleService) {
    }

    @Selector()
    static documenti(state: AreaDocumentaleStateModel): DocumentoInterface[] {
        return state.documenti;
    }

    @Selector()
    static codCategoria(state: AreaDocumentaleStateModel): string {
        return state.codCategoria;
    }

    @Selector()
    static descCategoria(state: AreaDocumentaleStateModel): string {
        return state.descCategoria;
    }

    @Selector()
    static loadingAreaDocumentale(state: AreaDocumentaleStateModel): boolean {
        return state.loadingDocumentiAreaDocumentale;
    }

    @Action(GetDocumentiAreaDocumentale)
    getDocumentiAreaDocumentale({ getState, dispatch }: StateContext<AreaDocumentaleStateModel>, action: GetDocumentiAreaDocumentale): void {
        dispatch(new StartLoadingDocumentiAreaDocumentale());
        const state = getState();
        const ricerca = this.store.selectSnapshot(RicercaAreaDocumentaleState.ricerca);
        const descCategoria = state.descCategoria;
        const filters = {
            search: ricerca,
            descCategoria
        };
        console.log('filters', filters);
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: this.store.selectSnapshot(PaginationState.pageSize)
        };
        this.areaDocumentaleService.getDocumenti(filters, pagination).subscribe((response: ResponseInterface) => {
            dispatch([
                new PatchPagination(response.pagination),
                new SetDocumentiAreaDocumentale(response.dataArray),
                new StopLoadingDocumentiAreaDocumentale()
            ]);
        });
    }

    @Action(SetDocumentiAreaDocumentale)
    setDocumentiAreaDocumentale({ patchState }: StateContext<AreaDocumentaleStateModel>, action: SetDocumentiAreaDocumentale): void {
        patchState({
            documenti: action.documentiAreaDocumentale
        });
    }

    @Action(SetCodCategoriaAreaDocumentale)
    setCodCategoriaAreaDocumentale({ patchState, dispatch }: StateContext<AreaDocumentaleStateModel>, action: SetCodCategoriaAreaDocumentale): void {
        console.log('SetCodCategoriaAreaDocumentale codCategoria', action.codCategoria);
        patchState({
            codCategoria: action.codCategoria
        });
        dispatch(new SetDescCategoriaAreaDocumentale(action.codCategoria));
    }

    @Action(ClearCodCategoriaAreaDocumentale)
    clearCodCategoriaAreaDocumentale({ patchState, dispatch }: StateContext<AreaDocumentaleStateModel>): void {
        patchState({
            codCategoria: AreaDocumentaleModelDefaults.codCategoria
        });
        localStorage.removeItem(LSNAME.areaDocumentale);
        dispatch(new ClearDescCategoriaAreaDocumentale());
    }

    @Action(SetDescCategoriaAreaDocumentale)
    setDescCategoriaAreaDocumentale({ patchState }: StateContext<AreaDocumentaleStateModel>, action: SetDescCategoriaAreaDocumentale): void {
        const filtriAreaDocumentale = this.store.selectSnapshot(FiltriAreaDocumentaleState.filtriAreaDocumentale);
        const descCategoria = filtriAreaDocumentale.filter((f: VoceFiltro) => f.codice === action.codCategoria)[0]?.descrizione;
        patchState({
            descCategoria
        });
    }

    @Action(ClearDescCategoriaAreaDocumentale)
    clearDescCategoriaAreaDocumentale({ patchState }: StateContext<AreaDocumentaleStateModel>): void {
        patchState({
            descCategoria: AreaDocumentaleModelDefaults.descCategoria
        });
    }

    @Action(StartLoadingDocumentiAreaDocumentale)
    startLoadingDocumentiAreaDocumentale({ patchState }: StateContext<AreaDocumentaleStateModel>): void {
        patchState({
            loadingDocumentiAreaDocumentale: true
        });
    }

    @Action(StopLoadingDocumentiAreaDocumentale)
    stopLoadingDocumentiAreaDocumentale({ patchState }: StateContext<AreaDocumentaleStateModel>): void {
        patchState({
            loadingDocumentiAreaDocumentale: false
        });
    }
}
