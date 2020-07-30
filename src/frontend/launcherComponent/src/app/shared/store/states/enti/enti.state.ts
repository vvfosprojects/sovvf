import { Selector, State, Store, Action, StateContext } from '@ngxs/store';
import { Enti } from 'src/app/shared/interface/ente.interface';
import { SetEnti, GetEnti } from '../../actions/enti/enti.actions';
import { RubricaService } from 'src/app/core/service/rubrica/rubrica.service';
import { ResponseInterface } from 'src/app/shared/interface/response.interface';
import { StopLoading } from '../../actions/loading/loading.actions';

export interface EntiStateModel {
    enti: Array<Enti>;
}

export const entiStateDefaults: EntiStateModel = {
        enti: undefined
};

@State<EntiStateModel>({
    name: 'enti',
    defaults: entiStateDefaults
})

export class EntiState {

    @Selector()
    static enti(state: EntiStateModel) {
        return state.enti;
    }

    constructor(
        private rubricaService: RubricaService
    ) { }

    @Action(SetEnti)
    setEnti({ patchState }: StateContext<EntiStateModel>, action: SetEnti) {
        patchState({ 
            enti: action.enti
        })
    }

    @Action(GetEnti)
    getEnti({ dispatch }: StateContext<EntiStateModel>) {

        this.rubricaService.getEnti().subscribe((response: Enti[]) => {
            dispatch([
                new SetEnti(response),
                new StopLoading()
            ]);
        })
    }

}

