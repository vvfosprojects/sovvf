import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    ClearFiltriAreaDocumentale,
    GetDocumentiAreaDocumentale,
    SetDocumentiAreaDocumentale,
    SetFiltroAreaDocumentale,
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
import { VoceFiltro } from 'src/app/features/home/filterbar/filtri-richieste/voce-filtro.model';
import { makeCopy } from 'src/app/shared/helper/function-generiche';
import { 
    setFiltroSelezionato as _setFiltroSelezionato,
    resetFiltriSelezionati as _resetFiltriSelezionati
} from 'src/app/shared/helper/function-filtro';

export interface AreaDocumentaleStateModel {
    documenti: DocumentoInterface[];
    filtriAreaDocumentale: VoceFiltro[];
    loadingDocumentiAreaDocumentale: boolean;
}

export const AreaDocumentaleModelDefaults: AreaDocumentaleStateModel = {
    documenti: undefined,
    filtriAreaDocumentale: [
        new VoceFiltro('1', 'Tipo Documento', 'Tipo 1', false),
        new VoceFiltro('2', 'Tipo Documento', 'Tipo 2', false),
        new VoceFiltro('3', 'Tipo Documento', 'Tipo 3', false)
    ],
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
    static filtriAreaDocumentale(state: AreaDocumentaleStateModel): VoceFiltro[] {
        return state.filtriAreaDocumentale;
    }

    @Selector()
    static filtriSelezionatiAreaDocumentale(state: AreaDocumentaleStateModel): VoceFiltro[] {
        return state.filtriAreaDocumentale.filter(f => f.selezionato === true);
    }

    @Selector()
    static loadingAreaDocumentale(state: AreaDocumentaleStateModel): boolean {
        return state.loadingDocumentiAreaDocumentale;
    }

    @Action(GetDocumentiAreaDocumentale)
    getDocumentiAreaDocumentale({ getState, dispatch }: StateContext<AreaDocumentaleStateModel>, action: GetDocumentiAreaDocumentale): void {
        dispatch(new StartLoadingDocumentiAreaDocumentale());
        const state = getState();
        const codSede = this.store.selectSnapshot(AuthState.currentUser)?.sede.codice;
        const ricerca = this.store.selectSnapshot(RicercaAreaDocumentaleState.ricerca);
        const descCategorie = state.filtriAreaDocumentale.filter((f: VoceFiltro) => f.selezionato === true).map((f: VoceFiltro) => f.descrizione);
        const filters = {
            search: ricerca,
            descCategorie
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
    

    @Action(SetFiltroAreaDocumentale)
    setFiltroMezziInServizio({ getState, patchState, dispatch }: StateContext<AreaDocumentaleStateModel>, action: SetFiltroAreaDocumentale): void {
        const state = getState();
        const filtriAreaDocumentale = makeCopy(state.filtriAreaDocumentale);
        const filtro = makeCopy(action.filtro);
        patchState({
            filtriAreaDocumentale: _setFiltroSelezionato(filtriAreaDocumentale, filtro)
        });
        dispatch(new GetDocumentiAreaDocumentale());
    }

    @Action(ClearFiltriAreaDocumentale)
    clearFiltriMezziInServizio({ getState, patchState, dispatch }: StateContext<AreaDocumentaleStateModel>, action: ClearFiltriAreaDocumentale): void {
        const state = getState();
        const filtriAreaDocumentale = makeCopy(state.filtriAreaDocumentale);
        patchState({
            filtriAreaDocumentale: _resetFiltriSelezionati(filtriAreaDocumentale)
        });
        if (!action.preventReloadLista) {
            dispatch(new GetDocumentiAreaDocumentale());
        }
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
