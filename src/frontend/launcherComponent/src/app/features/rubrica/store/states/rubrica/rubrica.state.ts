import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { StartLoading, StopLoading } from '../../../../../shared/store/actions/loading/loading.actions';
import { VoceRubrica, VoceRubricaTelefono } from '../../../../../shared/interface/rubrica.interface';
import { AddVoceRubrica, DeleteVoceRubrica, GetRubrica, SetRubrica, UpdateVoceRubrica } from '../../actions/rubrica/rubrica.actions';
import { RubricaService } from '../../../../../core/service/rubrica-service/rubrica.service';
import { RicercaRubricaState } from '../ricerca-rubrica/ricerca-rubrica.state';
import { ResponseInterface } from '../../../../../shared/interface/response.interface';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { TreeviewSelezione } from '../../../../../shared/model/treeview-selezione.model';
import { RicercaUtentiState } from '../../../../gestione-utenti/store/states/ricerca-utenti/ricerca-utenti.state';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';

export interface RubricaStateModel {
    vociRubrica: VoceRubrica[];
    voceRubricaForm: {
        model?: {
            descrizione: string;
            sedi: TreeviewSelezione[];
            ricorsivo: boolean;
            codCategoria: number,
            indirizzo: string,
            cap: string,
            noteEnte: string,
            email: string,
            telefoni: VoceRubricaTelefono[]
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const RubricaStateModelDefaults: RubricaStateModel = {
    vociRubrica: undefined,
    voceRubricaForm: {
        model: undefined,
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
    static sedeSelezionata(state: RubricaStateModel) {
        return state.voceRubricaForm.model.sedi;
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
    addVoceRubrica({ setState, getState }: StateContext<RubricaStateModel>) {
        const form = getState().voceRubricaForm.model;
        const newVoceRubrica = {
            descrizione: form.descrizione,
            codSede: null,
            ricorsivo: form.ricorsivo,
            codCategoria: form.codCategoria,
            indirizzo: form.indirizzo,
            cap: form.cap,
            noteEnte: form.noteEnte,
            email: form.email,
            telefoni: form.telefoni
        };
        form.sedi.forEach((value: TreeviewSelezione) => {
            newVoceRubrica.codSede.push({
                codSede: value.idSede
            });
        });
        this.rubricaService.addVoceRubrica(newVoceRubrica).subscribe((response: VoceRubrica) => {
            setState(
                patch({
                    vociRubrica: insertItem<VoceRubrica>(response)
                })
            );
        });
    }


    @Action(UpdateVoceRubrica)
    updateVoceRubrica({ setState }: StateContext<RubricaStateModel>, action: UpdateVoceRubrica) {
        this.rubricaService.updateVoceRubrica(action.voceRubrica).subscribe((response: VoceRubrica) => {
            setState(
                patch({
                    vociRubrica: updateItem<VoceRubrica>(voce => voce.codice === response.codice, response)
                })
            );
        });
    }

    @Action(DeleteVoceRubrica)
    deleteVoceRubrica({ setState }: StateContext<RubricaStateModel>, action: DeleteVoceRubrica) {
        this.rubricaService.deleteVoceRubrica(action.idVoceRubrica).subscribe(() => {
            setState(
                patch({
                    vociRubrica: removeItem<VoceRubrica>(voceRubrica => voceRubrica.id === action.idVoceRubrica)
                })
            );
        });
    }
}
