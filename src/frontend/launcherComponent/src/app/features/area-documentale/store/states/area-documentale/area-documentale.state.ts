import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    GetDocumentiAreaDocumentale,
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
import { AuthState } from 'src/app/features/auth/store/auth.state';
import { DocumentoInterface } from 'src/app/shared/interface/documento.interface';

export interface AreaDocumentaleStateModel {
    documenti: DocumentoInterface[];
    loadingDocumentiAreaDocumentale: boolean;
}

export const AreaDocumentaleModelDefaults: AreaDocumentaleStateModel = {
    documenti: undefined,
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
    static loadingAreaDocumentale(state: AreaDocumentaleStateModel): boolean {
        return state.loadingDocumentiAreaDocumentale;
    }

    @Action(GetDocumentiAreaDocumentale)
    getDocumentiAreaDocumentale({ dispatch }: StateContext<AreaDocumentaleStateModel>, action: GetDocumentiAreaDocumentale): void {
        dispatch(new StartLoadingDocumentiAreaDocumentale());
        const codSede = this.store.selectSnapshot(AuthState.currentUser)?.sede.codice;
        const ricerca = this.store.selectSnapshot(RicercaAreaDocumentaleState.ricerca);
        const filters = {
            search: ricerca
        };
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: this.store.selectSnapshot(PaginationState.pageSize)
        };
        this.areaDocumentaleService.getDocumenti(codSede, filters, pagination).subscribe((response: ResponseInterface) => {
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
