import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ConcorrenzaService } from '../../../../core/service/concorrenza-service/concorrenza.service';
import { AddConcorrenza, DeleteAllConcorrenza, DeleteConcorrenza, GetConcorrenza, SetConcorrenza } from '../../actions/concorrenza/concorrenza.actions';
import { ConcorrenzaInterface } from '../../../interface/concorrenza.interface';
import { GetAllResponseInterface } from '../../../interface/response/concorrenza/get-all-response.interface';
import { AuthState } from '../../../../features/auth/store/auth.state';

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
    deleteConcorrenza({ getState }: StateContext<ConcorrenzaStateModel>): void {
        const state = getState();
        const concorrenza = state.concorrenza;
        const utenteLoggato = this.store.selectSnapshot(AuthState.currentUser);
        const concorrenzaToDelete = concorrenza.filter((c: ConcorrenzaInterface) => c.idOperatore === utenteLoggato.id)[0];
        if (concorrenzaToDelete) {
            this.concorrenzaService.delete(concorrenzaToDelete.id).subscribe(() => {
            });
        }
    }

    @Action(DeleteAllConcorrenza)
    deleteAllConcorrenza(): void {
        this.concorrenzaService.deleteAll().subscribe(() => {
        });
    }
}
