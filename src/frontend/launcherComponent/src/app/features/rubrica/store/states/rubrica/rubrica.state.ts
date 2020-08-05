import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { patch, removeItem, updateItem } from '@ngxs/store/operators';
import { StartLoading, StopLoading } from '../../../../../shared/store/actions/loading/loading.actions';
import {
    CategoriaVoceRubrica,
    ResponseAddVoceRubricaInterface,
    ResponseDeleteVoceRubricaInterface,
    ResponseUpdateVoceRubricaInterface,
    TipoTelefono,
    VoceRubrica
} from '../../../../../shared/interface/rubrica.interface';
import {
    RequestAddVoceRubrica,
    ClearFormVoceRubrica,
    RequestDeleteVoceRubrica,
    GetCategorieVoceRubrica,
    GetRubrica,
    SetCategorieVoceRubrica,
    SetRubrica,
    RequestUpdateVoceRubrica,
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
    vociRubrica: VoceRubrica[];
    categorieVoceRubrica: CategoriaVoceRubrica[];
    voceRubricaForm: {
        model?: {
            descrizione: string;
            ricorsivo: boolean;
            codCategoria: number,
            indirizzo: string,
            cap: string,
            noteEnte: string,
            email: string,
            telefono: string,
            fax: string
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const RubricaStateModelDefaults: RubricaStateModel = {
    vociRubrica: undefined,
    categorieVoceRubrica: undefined,
    voceRubricaForm: {
        model: {
            descrizione: undefined,
            ricorsivo: false,
            codCategoria: undefined,
            indirizzo: undefined,
            cap: undefined,
            noteEnte: undefined,
            email: undefined,
            telefono: undefined,
            fax: undefined
        },
        dirty: false,
        status: '',
        errors: {}
    }
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

    @Selector()
    static formValid(state: RubricaStateModel) {
        return state.voceRubricaForm.status !== 'INVALID';
    }

    @Selector()
    static categorieVoceRubrica(state: RubricaStateModel) {
        return state.categorieVoceRubrica;
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

    @Action(RequestAddVoceRubrica)
    requestAddVoceRubrica({ getState, dispatch }: StateContext<RubricaStateModel>) {
        const form = getState().voceRubricaForm.model;
        const newVoceRubrica = {
            descrizione: form.descrizione,
            ricorsivo: form.ricorsivo,
            codCategoria: form.codCategoria,
            indirizzo: form.indirizzo,
            cap: form.cap,
            noteEnte: form.noteEnte,
            email: form.email,
            telefoni: []
        };

        // telefono
        if (form.telefono) {
            newVoceRubrica.telefoni.push(
                {
                    tipo: TipoTelefono.Telefono,
                    numero: form.telefono
                }
            );
        }
        // fax
        if (form.fax) {
            newVoceRubrica.telefoni.push(
                {
                    tipo: TipoTelefono.Fax,
                    numero: form.fax
                }
            );
        }

        this.rubricaService.addVoceRubrica(newVoceRubrica).subscribe((response: ResponseAddVoceRubricaInterface) => {
                dispatch(new ClearFormVoceRubrica());
                dispatch(new AddVoceRubrica());
                // todo: aspettare implementazione lato BE per togliere i commenti
                // const pagination = this.store.selectSnapshot(PaginationState.pagination);
                // dispatch(new PatchPagination({ ...pagination, totalItems: response.pagination.totalItems }));
            }, (error) => dispatch(new ClearFormVoceRubrica())
        );
    }


    @Action(RequestUpdateVoceRubrica)
    requestUpdateVoceRubrica({ dispatch }: StateContext<RubricaStateModel>, action: RequestUpdateVoceRubrica) {
        this.rubricaService.updateVoceRubrica(action.voceRubrica).subscribe((response: ResponseUpdateVoceRubricaInterface) => {
                dispatch(new ClearFormVoceRubrica());
                dispatch(new UpdateVoceRubrica(response.data));
                // todo: aspettare implementazione lato BE per togliere i commenti
                // const pagination = this.store.selectSnapshot(PaginationState.pagination);
                // dispatch(new PatchPagination({ ...pagination, totalItems: response.pagination.totalItems }));
            }, (error) => dispatch(new ClearFormVoceRubrica())
        );
    }

    @Action(RequestDeleteVoceRubrica)
    requestDeleteVoceRubrica({ setState, dispatch }: StateContext<RubricaStateModel>, action: RequestDeleteVoceRubrica) {
        this.rubricaService.deleteVoceRubrica(action.voceRubrica).subscribe((response: ResponseDeleteVoceRubricaInterface) => {
            dispatch(new DeleteVoceRubrica(response.data));
            // todo: aspettare implementazione lato BE per togliere i commenti
            // const pagination = this.store.selectSnapshot(PaginationState.pagination);
            // dispatch(new PatchPagination({ ...pagination, totalItems: response.pagination.totalItems }));
        });
    }

    @Action(AddVoceRubrica)
    addVoceRubrica({ dispatch }: StateContext<RubricaStateModel>) {
        const pagina = this.store.selectSnapshot(PaginationState.page);
        if (pagina === 1) {
            dispatch(new GetRubrica());
        }
    }


    @Action(UpdateVoceRubrica)
    updateVoceRubrica({ setState }: StateContext<RubricaStateModel>, action: UpdateVoceRubrica) {
        setState(
            patch({
                vociRubrica: updateItem<VoceRubrica>(voce => voce.codice === action.voceRubrica.codice, action.voceRubrica)
            })
        );
    }

    @Action(DeleteVoceRubrica)
    deleteVoceRubrica({ setState }: StateContext<RubricaStateModel>, action: DeleteVoceRubrica) {
        setState(
            patch({
                vociRubrica: removeItem<VoceRubrica>(voceRubrica => voceRubrica.id === action.idVoceRubrica)
            })
        );
    }

    @Action(GetCategorieVoceRubrica)
    getCategorieVoceRubrica({ dispatch }: StateContext<RubricaStateModel>) {
        this.rubricaService.getCategorieVoceRubrica().subscribe((categorie: CategoriaVoceRubrica[]) => {
            dispatch(new SetCategorieVoceRubrica(categorie));
        });
    }

    @Action(SetCategorieVoceRubrica)
    setCategorieVoceRubrica({ patchState }: StateContext<RubricaStateModel>, action: SetCategorieVoceRubrica) {
        this.rubricaService.getCategorieVoceRubrica().subscribe(() => {
            patchState({
                categorieVoceRubrica: action.categorieVoceRubrica
            });
        });
    }

    @Action(ClearFormVoceRubrica)
    clearFormVoceRubrica({ patchState }: StateContext<RubricaStateModel>) {
        patchState({
            voceRubricaForm: RubricaStateModelDefaults.voceRubricaForm
        });
    }
}
