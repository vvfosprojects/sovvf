import { Action, Selector, State, StateContext } from '@ngxs/store';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { StopLoading } from '../../../../../shared/store/actions/loading/loading.actions';
import { VoceRubrica } from '../../../../../shared/interface/rubrica.interface';
import { SetEnti } from '../../../../../shared/store/actions/enti/enti.actions';
import { AddVoceRubrica, DeleteVoceRubrica, GetRubrica, SetRubrica, UpdateVoceRubrica } from '../../actions/rubrica/rubrica.actions';
import { RubricaService } from '../../../../../core/service/rubrica/rubrica.service';
import { RicercaRubricaState } from '../ricerca-rubrica/ricerca-rubrica.state';

export interface RubricaStateModel {
    vociRubrica: VoceRubrica[];
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

    constructor(private rubricaService: RubricaService) {
    }

    @Selector()
    static vociRubrica(state: RubricaStateModel) {
        return state.vociRubrica;
    }

    @Action(GetRubrica)
    getRubrica({ dispatch }: StateContext<RubricaStateModel>) {
        this.rubricaService.getRubrica().subscribe((response: VoceRubrica[]) => {
            dispatch([
                new SetRubrica(response),
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
    addVoceRubrica({ setState }: StateContext<RubricaStateModel>, action: AddVoceRubrica) {
        this.rubricaService.addVoceRubrica(action.voceRubrica).subscribe((response: VoceRubrica) => {
            setState(
                patch({
                    vociRubrica: insertItem<VoceRubrica>(response)
                })
            );
        });
    }


    @Action(UpdateVoceRubrica)
    updateVoceRubrica({ setState }: StateContext<RubricaStateModel>, action: UpdateVoceRubrica) {
        // todo
    }

    @Action(DeleteVoceRubrica)
    deleteVoceRubrica({ setState }: StateContext<RubricaStateModel>, action: DeleteVoceRubrica) {
        setState(
            patch({
                vociRubrica: removeItem(id => id === action.idVoceRubrica)
            })
        );
    }
}
