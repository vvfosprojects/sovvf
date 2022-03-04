import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ConcorrenzaService } from '../../../../core/service/concorrenza-service/concorrenza.service';
import { AddConcorrenza, DeleteAllConcorrenza, DeleteConcorrenza, GetConcorrenza, SetConcorrenza } from '../../actions/concorrenza/concorrenza.actions';
import { ConcorrenzaInterface } from '../../../interface/concorrenza.interface';
import { GetAllResponseInterface } from '../../../interface/response/concorrenza/get-all-response.interface';
import { AuthState } from '../../../../features/auth/store/auth.state';
import { TipoConcorrenzaEnum } from '../../../enum/tipo-concorrenza.enum';
import { DeleteConcorrenzaDtoInterface } from '../../../interface/dto/concorrenza/delete-concorrenza-dto.interface';

export interface ConcorrenzaStateModel {
    concorrenza: ConcorrenzaInterface[];
}

export const ConcorrenzaStateDefaults: ConcorrenzaStateModel = {
    concorrenza: null
};

@Injectable()
@State<ConcorrenzaStateModel>({
    name: 'concorrenza',
    defaults: ConcorrenzaStateDefaults
})

export class ConcorrenzaState {

    constructor(private concorrenzaService: ConcorrenzaService,
                private store: Store) {
    }

    @Selector()
    static concorrenza(state: ConcorrenzaStateModel): ConcorrenzaInterface[] {
        return state.concorrenza;
    }

    @Action(GetConcorrenza)
    getConcorrenza({ dispatch }: StateContext<ConcorrenzaStateModel>): void {
        this.concorrenzaService.get().subscribe((response: GetAllResponseInterface) => {
            dispatch(new SetConcorrenza(response.blocksList));
        });
    }

    @Action(SetConcorrenza)
    setConcorrenza({ patchState }: StateContext<ConcorrenzaStateModel>, action: SetConcorrenza): void {
        patchState({
            concorrenza: action.data
        });
    }

    @Action(AddConcorrenza)
    addConcorrenza({ patchState }: StateContext<ConcorrenzaStateModel>, action: AddConcorrenza): void {
        this.concorrenzaService.add(action.data).subscribe(() => {
        });
    }

    @Action(DeleteConcorrenza)
    deleteConcorrenza({ getState }: StateContext<ConcorrenzaStateModel>, action: DeleteConcorrenza): void {
        const state = getState();
        const type = action.type;
        const concorrenza = state.concorrenza;
        const utenteLoggato = this.store.selectSnapshot(AuthState.currentUser);
        let concorrenzaToDelete: ConcorrenzaInterface[];
        switch (type) {
            case TipoConcorrenzaEnum.Richiesta:
                concorrenzaToDelete = concorrenza.filter((c: ConcorrenzaInterface) => c.type === type && c.idOperatore === utenteLoggato.id);
                break;
            case TipoConcorrenzaEnum.Mezzo:
                concorrenzaToDelete = concorrenza.filter((c: ConcorrenzaInterface) => c.type === type && action.value.includes(c.value) && c.idOperatore === utenteLoggato.id);
                break;
            case TipoConcorrenzaEnum.Squadra:
                concorrenzaToDelete = concorrenza.filter((c: ConcorrenzaInterface) => c.type === type && action.value.includes(c.value) && c.idOperatore === utenteLoggato.id);
                break;
        }
        const concorrenzaToDeleteIds = concorrenzaToDelete.map((c: ConcorrenzaInterface) => {
            return { id: c.id } as DeleteConcorrenzaDtoInterface;
        }) as DeleteConcorrenzaDtoInterface[];
        if (concorrenzaToDelete) {
            this.concorrenzaService.delete(concorrenzaToDeleteIds).subscribe(() => {
            });
        }
    }

    @Action(DeleteAllConcorrenza)
    deleteAllConcorrenza(): void {
        this.concorrenzaService.deleteAll().subscribe(() => {
        });
    }
}
