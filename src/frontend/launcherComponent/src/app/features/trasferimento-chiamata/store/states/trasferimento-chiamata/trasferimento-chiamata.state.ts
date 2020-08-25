import { Store, State, Selector, Action, StateContext } from '@ngxs/store';
import { RicercaTrasferimentoChiamataState } from '../ricerca-trasferimento-chiamata/ricerca-trasferimento-chiamata.state';
import { TrasferimentoChiamata } from 'src/app/shared/interface/trasferimento-chiamata.interface';
import { PatchPagination } from 'src/app/shared/store/actions/pagination/pagination.actions';
import { StopLoading, StartLoading } from 'src/app/shared/store/actions/loading/loading.actions';
import { ResponseInterface } from 'src/app/shared/interface/response.interface';
import { PaginationState } from 'src/app/shared/store/states/pagination/pagination.state';
import {
    GetListaTrasferimentiChiamate,
    SetListaTrasferimentiChiamate,
    AddTrasferimentoChiamata
} from '../../actions/trasferimento-chiamata/trasferimento-chiamata.actions';
import { TrasferimentoChiamataService } from 'src/app/core/service/trasferimento-chiamata/trasferimento-chiamata.service';

export interface TrasferimentoChiamataStateModel {
    listaTrasferimentiChiamate: TrasferimentoChiamata[];
}

export const TrasferimentoChiamataStateModelDefaults: TrasferimentoChiamataStateModel = {
    listaTrasferimentiChiamate: undefined
};

@State<TrasferimentoChiamataStateModel>({
    name: 'trasferimentoChiamata',
    defaults: TrasferimentoChiamataStateModelDefaults,
    children: [RicercaTrasferimentoChiamataState]
})

export class TrasferimentoChiamataState {

    constructor(private store: Store,
                private trasferimentoChiamataService: TrasferimentoChiamataService) {
    }

    @Selector()
    static listaTrasferimentiChiamate(state: TrasferimentoChiamataStateModel) {
        return state.listaTrasferimentiChiamate;
    }

    @Action(GetListaTrasferimentiChiamate)
    getListaTrasferimentiChiamate({ dispatch }: StateContext<TrasferimentoChiamataStateModel>, action: GetListaTrasferimentiChiamate) {
        dispatch(new StartLoading());
        const ricerca = this.store.selectSnapshot(RicercaTrasferimentoChiamataState.ricerca);
        const filters = {
            search: ricerca
        };
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: this.store.selectSnapshot(PaginationState.pageSize)
        };
        this.trasferimentoChiamataService.getTrasferimentiChiamate(filters, pagination).subscribe((response: ResponseInterface) => {
            dispatch([
                new PatchPagination(response.pagination),
                new SetListaTrasferimentiChiamate(response.dataArray),
                new StopLoading()
            ]);
        });
    }

    @Action(SetListaTrasferimentiChiamate)
    setListaTrasferimentiChiamate({ patchState }: StateContext<TrasferimentoChiamataStateModel>, action: SetListaTrasferimentiChiamate) {
        patchState({
            listaTrasferimentiChiamate: action.vociTrasferimentoChiamata
        });
    }

    @Action(AddTrasferimentoChiamata)
    addTrasferimentoChiamata({ dispatch }: StateContext<TrasferimentoChiamataStateModel>) {
        const pagina = this.store.selectSnapshot(PaginationState.page);
        dispatch(new GetListaTrasferimentiChiamate(pagina));
    }
}
