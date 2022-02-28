import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ConcorrenzaService } from '../../../../core/service/concorrenza-service/concorrenza.service';
import { AddConcorrenza, DeleteAllConcorrenza, DeleteConcorrenza, GetConcorrenza } from '../../actions/concorrenza/concorrenza.actions';
import { ConcorrenzaInterface } from '../../../interface/concorrenza.interface';

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

    constructor(private concorrenzaService: ConcorrenzaService) {
    }

    @Selector()
    static concorrenza(state: ConcorrenzaStateModel): ConcorrenzaInterface[] {
        return state.concorrenza;
    }

    @Action(GetConcorrenza)
    getConcorrenza({ patchState }: StateContext<ConcorrenzaStateModel>): void {
        this.concorrenzaService.get().subscribe((concorrenza: ConcorrenzaInterface[]) => {
            patchState({
                concorrenza
            });
        });
    }

    @Action(AddConcorrenza)
    addConcorrenza({ patchState }: StateContext<ConcorrenzaStateModel>, action: AddConcorrenza): void {
        this.concorrenzaService.add(action.data).subscribe(() => {
        });
    }

    @Action(DeleteConcorrenza)
    deleteConcorrenza({ patchState }: StateContext<ConcorrenzaStateModel>, action: DeleteConcorrenza): void {
        this.concorrenzaService.delete(action.idConcorrenza).subscribe(() => {
        });
    }

    @Action(DeleteAllConcorrenza)
    deleteAllConcorrenza(): void {
        this.concorrenzaService.deleteAll().subscribe(() => {
        });
    }
}
