import { Selector, State, Action, StateContext } from '@ngxs/store';
import { VoceRubrica } from 'src/app/shared/interface/rubrica.interface';
import { SetEnti } from '../../actions/enti/enti.actions';

export interface EntiStateModel {
    enti: Array<VoceRubrica>;
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

    constructor() {
    }

    @Action(SetEnti)
    setEnti({ patchState }: StateContext<EntiStateModel>, action: SetEnti) {
        patchState({
            enti: action.enti
        });
    }
}
