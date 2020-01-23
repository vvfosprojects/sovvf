import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PermessiService } from '../../../../../core/service/permessi-service/permessi-service.service';
import { GetPermessi, SetPermessi } from '../../actions/permessi/permessi.actions';

export interface PermessiStateModel {
    permessi: string[];
}

export const PermessiStateDefaults: PermessiStateModel = {
    permessi: []
};

@State<PermessiStateModel>({
    name: 'permessi',
    defaults: PermessiStateDefaults
})
export class PermessiState {

    constructor(private _permessi: PermessiService) {
    }

    @Selector()
    static permessi(state: PermessiStateModel) {
        return state.permessi;
    }

    @Action(GetPermessi)
    getPermessi({ dispatch }: StateContext<PermessiStateModel>) {
        this._permessi.getPermessi().subscribe((permessi: string[]) => {
            dispatch(new SetPermessi(permessi));
        });
    }

    @Action(SetPermessi)
    setPermessi({ patchState }: StateContext<PermessiStateModel>, action: SetPermessi) {
        patchState({
            permessi: action.permessi
        });
    }
}
