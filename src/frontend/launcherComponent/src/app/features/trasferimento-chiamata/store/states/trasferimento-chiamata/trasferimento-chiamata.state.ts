import { Store, State, Selector, Action, StateContext } from '@ngxs/store';
import { patch, removeItem, updateItem } from '@ngxs/store/operators';
import { RicercaTrasferimentoChiamataState } from './../ricerca-trasferimento-chiamata/ricerca-trasferimento-chiamata.state';
import { TrasferimentoChiamata } from 'src/app/shared/interface/trasferimento-chiamata.interface';
import { PatchPagination } from 'src/app/shared/store/actions/pagination/pagination.actions';
import { StopLoading, StartLoading } from 'src/app/shared/store/actions/loading/loading.actions';
import { ResponseInterface } from 'src/app/shared/interface/response.interface';
import { PaginationState } from 'src/app/shared/store/states/pagination/pagination.state';
import { GetTrasferimentoChiamata, SetTrasferimentoChiamata, AddVoceTrasferimentoChiamata, UpdateVoceTrasferimentoChiamata, DeleteVoceTrasferimentoChiamata } from '../../actions/trasferimento-chiamata/trasferimento-chiamata.actions';
import { TrasferimentoChiamataService } from 'src/app/core/service/trasferimento-chiamata/trasferimento-chiamata.service';

export interface TrasferimentoChiamataStateModel {
    vociTrasferimentoChiamata: TrasferimentoChiamata[];
}

export const TrasferimentoChiamataStateModelDefaults: TrasferimentoChiamataStateModel = {
    vociTrasferimentoChiamata: undefined
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
    static vociTrasferimentoChiamata(state: TrasferimentoChiamataStateModel) {
       return state.vociTrasferimentoChiamata;
       /*state.vociTrasferimentoChiamata = [{
           id: 'aaa',
           codice: 2222,
           sedeDa: 'aaa',
           sedeA: 'aaa',
           data: 'aaa',
           operatore: 'aaa'
       }]*/
    }

    @Action(GetTrasferimentoChiamata)
    getTrasferimentoChiamata({ dispatch }: StateContext<TrasferimentoChiamataStateModel>, action: GetTrasferimentoChiamata) {
        dispatch(new StartLoading());
        const ricerca = this.store.selectSnapshot(RicercaTrasferimentoChiamataState.ricerca);
        const filters = {
            search: ricerca
        };
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: this.store.selectSnapshot(PaginationState.pageSize)
        };
        this.trasferimentoChiamataService.getTrasferimentoChiamata(filters, pagination).subscribe((response: ResponseInterface) => {
            dispatch([
                new PatchPagination(response.pagination),
                new SetTrasferimentoChiamata(response.dataArray),
                new StopLoading()
            ]);
        });
    }

    @Action(SetTrasferimentoChiamata)
    setTrasferimentoChiamata({ patchState }: StateContext<TrasferimentoChiamataStateModel>, action: SetTrasferimentoChiamata) {
        patchState({
            vociTrasferimentoChiamata: action.vociTrasferimentoChiamata
        });
    }

    @Action(AddVoceTrasferimentoChiamata)
    addTrasferimentoChiamata({ dispatch }: StateContext<TrasferimentoChiamataStateModel>) {
        const pagina = this.store.selectSnapshot(PaginationState.page);
        dispatch(new GetTrasferimentoChiamata(pagina));
    }


    @Action(UpdateVoceTrasferimentoChiamata)
    updateVoceRubrica({ setState }: StateContext<TrasferimentoChiamataStateModel>, action: UpdateVoceTrasferimentoChiamata) {
        setState(
            patch({
                vociTrasferimentoChiamata: updateItem<TrasferimentoChiamata>(voce => voce.codice === action.voceTrasferimentoChiamata.codice, action.voceTrasferimentoChiamata)
            })
        );
    }

    @Action(DeleteVoceTrasferimentoChiamata)
    deleteVoceRubrica({ setState, getState, dispatch }: StateContext<TrasferimentoChiamataStateModel>, action: DeleteVoceTrasferimentoChiamata) {
        const state = getState();
        if (state.vociTrasferimentoChiamata && state.vociTrasferimentoChiamata.length === 1) {
            const page = this.store.selectSnapshot(PaginationState.page);
            dispatch(new GetTrasferimentoChiamata(page - 1));
        }
        setState(
            patch({
                vociTrasferimentoChiamata: removeItem<TrasferimentoChiamata>(voceTrasferimentoChiamata => voceTrasferimentoChiamata.id === action.idVoceTrasferimentoChiamata)
            })
        );
    }
}