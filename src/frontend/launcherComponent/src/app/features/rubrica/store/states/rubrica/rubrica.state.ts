import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { patch, removeItem, updateItem } from '@ngxs/store/operators';
import { StartLoading, StopLoading } from '../../../../../shared/store/actions/loading/loading.actions';
import { Ente } from '../../../../../shared/interface/ente.interface';
import {
    GetRubrica,
    SetRubrica,
    AddVoceRubrica,
    UpdateVoceRubrica,
    DeleteVoceRubrica
} from '../../actions/rubrica/rubrica.actions';
import { RubricaService } from '../../../../../core/service/rubrica-service/rubrica.service';
import { RicercaRubricaState } from '../ricerca-rubrica/ricerca-rubrica.state';
import { ResponseInterface } from '../../../../../shared/interface/response.interface';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';

export interface RubricaStateModel {
    vociRubrica: Ente[];
}

export const RubricaStateModelDefaults: RubricaStateModel = {
    vociRubrica: undefined
};

@State<RubricaStateModel>({
    name: 'rubrica',
    defaults: RubricaStateModelDefaults,
    children: [RicercaRubricaState]
})
export class RubricaState {

    constructor(private store: Store,
                private rubricaService: RubricaService) {
    }

    @Selector()
    static vociRubrica(state: RubricaStateModel) {
        return state.vociRubrica;
    }

    @Action(GetRubrica)
    getRubrica({ dispatch }: StateContext<RubricaStateModel>, action: GetRubrica) {
        dispatch(new StartLoading());
        const ricerca = this.store.selectSnapshot(RicercaRubricaState.ricerca);
        const filters = {
            search: ricerca
        };
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: this.store.selectSnapshot(PaginationState.pageSize)
        };
        this.rubricaService.getRubrica(filters, pagination).subscribe((response: ResponseInterface) => {
            dispatch([
                new PatchPagination(response.pagination),
                new SetRubrica(response.dataArray),
                new StopLoading()
            ]);
        });
    }

    @Action(SetRubrica)
    setRubrica({ patchState }: StateContext<RubricaStateModel>, action: SetRubrica) {
        patchState({
            vociRubrica: action.vociRubrica
        });
    }

    @Action(AddVoceRubrica)
    addVoceRubrica({ dispatch }: StateContext<RubricaStateModel>) {
        const pagina = this.store.selectSnapshot(PaginationState.page);
        dispatch(new GetRubrica(pagina));
    }


    @Action(UpdateVoceRubrica)
    updateVoceRubrica({ setState }: StateContext<RubricaStateModel>, action: UpdateVoceRubrica) {
        setState(
            patch({
                vociRubrica: updateItem<Ente>(voce => voce.codice === action.voceRubrica.codice, action.voceRubrica)
            })
        );
    }

    @Action(DeleteVoceRubrica)
    deleteVoceRubrica({ setState, getState, dispatch }: StateContext<RubricaStateModel>, action: DeleteVoceRubrica) {
        const state = getState();
        if (state.vociRubrica && state.vociRubrica.length === 1) {
            const page = this.store.selectSnapshot(PaginationState.page);
            dispatch(new GetRubrica(page - 1));
        }
        setState(
            patch({
                vociRubrica: removeItem<Ente>(voceRubrica => voceRubrica.id === action.idVoceRubrica)
            })
        );
    }
}
